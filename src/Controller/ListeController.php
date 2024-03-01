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
            $listeSort= $liste->getSort();
            $tasks = $liste->getTasks();
            $taskDetails = [];
            foreach ($tasks as $task) {
                $taskDetails[] = [
                    'taskID' => $task->getId(),
                    'taskName' => $task->getName(),
                    'taskSort' => $task->getSort()
                ];
            }
            $arrayListes[] = [
                'listeID' => $listeID,
                'listeName' => $listeName,
                'listeSort' => $listeSort,
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

    #[Route('/create', name: 'create', methods: ['POST'])]
    public function create(

        Request                $request,
        EntityManagerInterface $entityManager,
        WorklabRepository      $worklabRepository): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }

        $liste = new Liste();

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
    #[Route('/editName', name: 'edit', methods: ['PATCH'])]
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

    #[Route('/editSort', name: 'editSort', methods: ['PATCH'])]
    public function editSort
    (Request $request,
     EntityManagerInterface $entityManager,
     ListeRepository $listeRepository): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $content = $request->getContent();
        $data = json_decode($content);

        $draggedListID= $data->draggedListID;
        $draggedListSort= $data->draggedListSort;

        $targetListID= $data->targetListID;
        $targetListSort= $data->targetListSort;

        $draggedList = $listeRepository->find($draggedListID);
        $targetList = $listeRepository->find($targetListID);



        if ($draggedList && $targetListID){
            $draggedList->setSort($draggedListSort);
            $targetList->setSort($targetListSort);
            $entityManager->persist($draggedList);
            $entityManager->persist($targetList);
            $entityManager->flush();

            return $this->json([
                'isSuccessfull' => true,
                'message' => 'Edit sort list OK'
            ]);
        }
        return $this->json([
            'isSuccessfull' => false,
            'message' => 'Données manquantes'
        ]);
    }

}
