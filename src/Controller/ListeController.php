<?php

namespace App\Controller;

use App\Entity\Liste;
use App\Entity\Worklab;
use App\Repository\ListeRepository;
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
        $listes = $listeRepository->findBy(['worklab' => $worklab]);

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
        return $this->json([
            'isSuccessfull' => true,
            'listes' => $arrayListes
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
        if ($listeName && $worklab) {
            $worklab->setUpdatedAt(new \DateTimeImmutable('now'));
            $entityManager->persist($worklab);
            $liste->setWorklab($worklab);
            $liste->setName($listeName);
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
//        }
//        return $this->redirectToRoute('app_home');
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
//            'res' => $res
        ]);
//        }
//        return $this->redirectToRoute('app_home');
    }
}
