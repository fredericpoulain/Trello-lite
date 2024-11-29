<?php

namespace App\Controller;

use App\Entity\Liste;
use App\Entity\Task;
use App\Entity\Worklab;
use App\Repository\ListeRepository;
use App\Repository\TaskRepository;
use App\Repository\WorklabRepository;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use phpDocumentor\Reflection\Types\Integer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/liste', name: 'app_liste_')]
class ListeController extends AbstractController
{
    /**
     * @param $id
     * @param ListeRepository $listeRepository
     * @param WorklabRepository $worklabRepository
     * @return JsonResponse
     */
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
            $listeSort = $liste->getSort();
            $tasks = $liste->getTasks()->toArray(); // Convertir en tableau

            // Triez les tâches en fonction de taskSort
            usort($tasks, function ($a, $b) {
                return $a->getSort() - $b->getSort();
            });

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

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param WorklabRepository $worklabRepository
     * @return Response
     */
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

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param ListeRepository $listeRepository
     * @return Response
     */
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

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param ListeRepository $listeRepository
     * @return Response
     */
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

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param ListeRepository $listeRepository
     * @return Response
     */
    #[Route('/dragAndDrop', name: 'dragAndDrop', methods: ['PATCH'])]
    public function dragAndDrop
    (Request $request,
     EntityManagerInterface $entityManager,
     ListeRepository $listeRepository): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $content = $request->getContent();
        $listes = json_decode($content);
//        dd($listes);
        try {
            foreach ($listes as $liste) {
                $listeBDD = $listeRepository->find($liste->listeID);
                // Vérifiez si la tâche existe
                if (!$listeBDD) {
                    throw new Exception("Liste non trouvée avec l'ID $liste->listeID");
                }
                $listeBDD->setSort($liste->listeSort);
                $entityManager->persist($listeBDD);
            }
            $entityManager->flush();

            return $this->json([
                'isSuccessfull' => true,
                'message' => 'DragAndDrop Liste OK'
            ]);
        } catch (\Exception $exception) {
            // Gérer l'exception et retourner une réponse JSON avec un message d'erreur
            return $this->json([
                'isSuccessfull' => false,
                'message' => 'Erreur lors de la mise à jour des listes lors du DragAndDrop: ' . $exception->getMessage()
            ]);
        }
    }

}
