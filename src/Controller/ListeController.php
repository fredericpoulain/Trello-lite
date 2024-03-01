<?php

namespace App\Controller;

use App\Entity\Liste;
use App\Entity\Task;
use App\Entity\Worklab;
use App\Repository\ListeRepository;
use App\Repository\TaskRepository;
use App\Repository\WorklabRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/liste', name: 'app_liste_')]
class ListeController extends AbstractController
{
    #[Route('/getAll/{id}', name: 'get')]
    public function get($id, ListeRepository $listeRepository, WorklabRepository $worklabRepository): JsonResponse
    {
        $worklab = $worklabRepository->find($id);

        if (!$worklab) {
            // Gérer le cas où aucun Worklab ne correspond à l'id
            return $this->json([
                'isSuccessfull' => false,
                'message' => 'Aucun Worklab trouvé avec cet id'
            ], 404);
        }
        $listes = $listeRepository->findBy(
            ['worklab' => $worklab],
            ['sort' => 'ASC']
        );

        $arrayListes = [];
        foreach ($listes as $liste) {
            $listeID = $liste->getId();
            $listeName = $liste->getName();
            $tasks = $liste->getTasks();
            $taskDetails = [];
            foreach ($tasks as $task) {
                $taskDetails[] = [
                    'taskID' => $task->getId(),
                    'taskName' => $task->getName()
                ];
            }
            $arrayListes[] = [
                'listeID' => $listeID,
                'listeName' => $listeName,
                'listeTasks' => $taskDetails
            ];
        }
        $infoWorklab = [
            'worklabName' => $worklab->getName(),
            'worklabID' => $worklab->getId(),
        ];
        return $this->json([
            'isSuccessfull' => true,
            'listes' => $arrayListes,
            'infoWorklab' => $infoWorklab
        ]);

    }
//    #[Route('/create/{id}', name: 'create', methods: ['POST'])]
    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(
//        Worklab                $worklab,
        Request                $request,
        EntityManagerInterface $entityManager,
        WorklabRepository      $worklabRepository): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }

        $liste = new Liste();
//        if ($request->isMethod('POST')) {
//        $listeName = $request->get('listeName');
        $content = $request->getContent();
        $data = json_decode($content);
        $worklabID = $data->worklabID;
        $listeName = $data->listeName;
        $worklab = $worklabRepository->find($worklabID);
        $numberOfList = $worklab->getListes()->count();
        if ($listeName && $worklab) {
            $worklab->setUpdatedAt(new \DateTimeImmutable('now'));
            $entityManager->persist($worklab);
            $liste->setWorklab($worklab);
            $liste->setName($listeName);
            $liste->setSort($numberOfList + 1);
            $entityManager->persist($liste);
            $entityManager->flush();
            //on lui envoie la nouvelle liste
            return $this->json([
                'isSuccessfull' => true,
                'newListe' => [
                    'listeID' => $liste->getId(),
                    'listeName' => $liste->getName(),
                    'listeTasks' => $liste->getTasks(),
                ]
            ]);
        }
        return $this->redirectToRoute('app_home');
    }

    #[Route('/delete', name: 'delete', methods: ['DELETE'])]
    public function delete(
        Request                $request,
        EntityManagerInterface $entityManager,
        ListeRepository $listeRepository
    ): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $content = $request->getContent();
        $data = json_decode($content);
        $listeID = $data->listeID;

        $liste = $listeRepository->find($listeID);
        $entityManager->remove($liste);
        $entityManager->flush();


        return $this->json([
            'isSuccessfull' => true,
        ]);
    }
    #[Route('/edit', name: 'edit', methods: ['PATCH'])]
    public function edit(Request $request, EntityManagerInterface $entityManager, ListeRepository $listeRepository): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $content = $request->getContent();
        $data = json_decode($content);

        $listeID= $data->listeID;
        $listeName = $data->listeName;
        $liste = $listeRepository->find($listeID);
        if ($liste && $listeName){
            $liste->setName($listeName);
            $entityManager->persist($liste);
            $entityManager->flush();

            return $this->json([
                'isSuccessfull' => true,
                'message' => 'edit Liste OK'
            ]);
        }
        return $this->json([
            'isSuccessfull' => false,
            'message' => 'Données manquantes'
        ]);
    }
    #[Route('/taskEdit', name: 'taskEdit', methods: ['PATCH'])]
    public function taskEdit(Request $request, EntityManagerInterface $entityManager, TaskRepository $taskRepository): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $content = $request->getContent();
        $data = json_decode($content);

        $taskID= $data->taskID;
        $taskName = $data->taskName;
        $task = $taskRepository->find($taskID);
        if ($task && $taskName){
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
    #[Route('/task/create', name: 'createTask', methods: ['POST'])]
    public function createTask(
        Request                $request,
        EntityManagerInterface $entityManager,
        ListeRepository $listeRepository,
        WorklabRepository $worklabRepository
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
        if ($taskName && $liste) {
            //il faut changer la date updateDate lié au worklab de la liste liée à la nouvelle tâche
            $worklab = $worklabRepository->find($liste->getWorklab());
            $worklab->setUpdatedAt(new \DateTimeImmutable('now'));
            $entityManager->persist($worklab);

            $task->setName($taskName);
            $task->setListe($liste);
            $entityManager->persist($task);
            $entityManager->flush();
            //on lui envoie la nouvelle tâche
            return $this->json([
                'isSuccessfull' => true,
                'newTask' => [
                    'taskID' => $task->getId(),
                    'taskName' => $task->getName(),
                ]
            ]);
        }
        return $this->redirectToRoute('app_home');
    }
}
