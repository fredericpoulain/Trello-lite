<?php

namespace App\Controller;

use App\Entity\Task;
use App\Repository\ListeRepository;
use App\Repository\TaskRepository;
use App\Repository\WorklabRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/task', name: 'app_task_')]
class TaskController extends AbstractController
{
    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(
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
        $numberOfTask = $liste->getTasks()->count();
        if ($taskName && $liste) {
            //il faut changer la date updateDate lié au worklab de la liste liée à la nouvelle tâche
            $worklab = $worklabRepository->find($liste->getWorklab());
            $worklab->setUpdatedAt(new \DateTimeImmutable('now'));
            $entityManager->persist($worklab);

            $task->setName($taskName);
            $task->setListe($liste);
            $task->setSort($numberOfTask +1);
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

    #[Route('/editName', name: 'edit', methods: ['PATCH'])]
    public function editName(Request $request, EntityManagerInterface $entityManager, TaskRepository $taskRepository): Response
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

    #[Route('/editSort', name: 'editSort', methods: ['PATCH'])]
    public function editSort(
        Request $request,
        EntityManagerInterface $entityManager,
        TaskRepository $taskRepository,
        ListeRepository $listeRepository
    ): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $content = $request->getContent();
        $data = json_decode($content);
        //element dragged
        $draggedTaskID = $data->draggedTaskID;
        $draggedTaskSort = $data->draggedTaskSort;
        $draggedListeID= $data->draggedListeID;

        //element target
        $targetTaskID = $data->targetTaskID;
        $targetTaskSort = $data->targetTaskSort;
        $targetListeID= $data->targetListeID;

        $draggedTask = $taskRepository->find($draggedTaskID);
        $targetTask = $taskRepository->find($targetTaskID);

        //vérifier aussi si $targetListeID renvoie un object ?
        $draggedList = $listeRepository->find($draggedListeID);
        $targetList= $listeRepository->find($targetListeID);

        if ($draggedTask && $targetTask && $draggedList && $targetList){

            $draggedTask->setSort($draggedTaskSort);
            $draggedTask->setListe($draggedList);

            $targetTask->setSort($targetTaskSort);
            $targetTask->setListe($targetList);

            $entityManager->persist($draggedTask);
            $entityManager->persist($targetTask);

            $entityManager->flush();

            return $this->json([
                'isSuccessfull' => true,
                'message' => 'Edit sort task OK'
            ]);
        }
        return $this->json([
            'isSuccessfull' => false,
            'message' => 'Données manquantes'
        ]);
    }

}
