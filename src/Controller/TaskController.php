<?php

namespace App\Controller;

use App\Entity\Task;
use App\Repository\ListeRepository;
use App\Repository\TaskRepository;
use App\Repository\WorklabRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;


#[Route('/task', name: 'app_task_')]
class TaskController extends AbstractController
{
    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param ListeRepository $listeRepository
     * @param WorklabRepository $worklabRepository
     * @return Response
     */
    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(
        Request                $request,
        EntityManagerInterface $entityManager,
        ListeRepository        $listeRepository,
        WorklabRepository      $worklabRepository
    ): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }

        $task = new Task();

        $content = $request->getContent();
        $data = json_decode($content);
        $listeID = $data->listeID;
        $taskName = $data->taskName;
        $liste = $listeRepository->find($listeID);
        $numberOfTask = $liste->getTasks()->count();
        if ($taskName && $liste) {
            //il faut changer la date updateDate lié au worklab de la liste liée à la nouvelle tâche
            $worklab = $worklabRepository->find($liste->getWorklab());
            $worklab->setUpdatedAt(new \DateTimeImmutable('now'));
            $entityManager->persist($worklab);

            $task->setName($taskName);
            $task->setListe($liste);
            $task->setSort($numberOfTask + 1);
            $entityManager->persist($task);
            $entityManager->flush();
            //on lui envoie la nouvelle tâche
            return $this->json([
                'isSuccessfull' => true,
                'newTask' => [
                    'taskID' => $task->getId(),
                    'taskName' => $task->getName(),
                    'taskSort' => $task->getSort()
                ]
            ]);
        }
        return $this->redirectToRoute('app_home');
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param TaskRepository $taskRepository
     * @return Response
     */
    #[Route('/editName', name: 'edit', methods: ['PATCH'])]
    public function editName(Request $request, EntityManagerInterface $entityManager, TaskRepository $taskRepository): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $content = $request->getContent();
        $data = json_decode($content);

        $taskID = $data->taskID;
        $taskName = $data->taskName;
        $task = $taskRepository->find($taskID);
        if ($task && $taskName) {
            $task->setName($taskName);
            $entityManager->persist($task);
            $entityManager->flush();

            return $this->json([
                'isSuccessfull' => true,
                'message' => 'edit task OK'
            ]);
        }
        return $this->json([
            'isSuccessfull' => false,
            'message' => 'Données manquantes'
        ]);
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param TaskRepository $taskRepository
     * @param ListeRepository $listeRepository
     * @return Response
     */
    #[Route('/dragAndDrop', name: 'dragAndDrop', methods: ['PATCH'])]
    public function dragAndDrop(
        Request                $request,
        EntityManagerInterface $entityManager,
        TaskRepository         $taskRepository,
        ListeRepository        $listeRepository
    ): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $content = $request->getContent();
        $data = json_decode($content);
        try {
            foreach ($data as $task) {
                $taskBDD = $taskRepository->find($task->taskID);
                $listeBDD = $listeRepository->find($task->listeID);
                // Vérifiez si la tâche existe
                if (!$taskBDD) {
                    throw new Exception("Tâche non trouvée avec l'ID $task->taskID");
                }
                if (!$listeBDD) {
                    throw new Exception("Liste non trouvée avec l'ID $task->listeID");
                }
                $taskBDD->setSort($task->taskSort);
                $taskBDD->setListe($listeBDD);
                $entityManager->persist($taskBDD);
            }
            $entityManager->flush();

            return $this->json([
                'isSuccessfull' => true,
                'message' => 'DragAndDrop task OK'
            ]);
        } catch (\Exception $exception) {
            // Gérer l'exception et retourner une réponse JSON avec un message d'erreur
            return $this->json([
                'isSuccessfull' => false,
                'message' => 'Erreur lors de la mise à jour des tâches lors du DragAndDrop: ' . $exception->getMessage()
            ]);
        }

    }

}
