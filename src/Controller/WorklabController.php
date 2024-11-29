<?php

namespace App\Controller;

use App\Entity\Worklab;
use App\Form\WorklabType;
use App\Repository\WorklabRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/worklab', name: 'app_worklab_')]
class WorklabController extends AbstractController
{
    /**
     * @return Response
     */
    #[Route('/form', name: 'form')]
    public function displayForm(): Response
    {
        $form = $this->createForm(WorklabType::class, null, [
            'action' => $this->generateUrl('app_worklab_create'), // indique la route qui traite le formulaire
        ]);
        return $this->render('_partials/formWorklab.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @return Response
     */
    #[Route('/create', name: 'create')]
    public function create(Request $request, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $worklab = new Worklab();
        $form = $this->createForm(WorklabType::class, $worklab);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $worklab->setUser($user);
            $entityManager->persist($worklab);
            $entityManager->flush();

            // Redirigez l'utilisateur vers une page de remerciement ou actualisez la page
            return $this->redirectToRoute('app_home');
        }

        // Si le formulaire n'est pas valide, affichez un message d'erreur
        $this->addFlash('error', 'Le formulaire n\'est pas valide.');
        return $this->redirectToRoute('app_home');
    }

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param WorklabRepository $worklabRepository
     * @return Response
     */
    #[Route('/edit', name: 'edit', methods: ['PATCH'])]
    public function edit(Request $request, EntityManagerInterface $entityManager, WorklabRepository $worklabRepository): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $content = $request->getContent();
        $data = json_decode($content);

        $worklabID= $data->worklabID;
        $worklabName = $data->worklabName;
        $worklab = $worklabRepository->find($worklabID);
        if ($worklab && $worklabName){
            $worklab->setName($worklabName);
            $entityManager->persist($worklab);
            $entityManager->flush();

            return $this->json([
                'isSuccessfull' => true,
                'message' => 'edit worklab OK'
            ]);
        }
        return $this->json([
            'isSuccessfull' => false,
            'message' => 'Données manquantes'
        ]);

    }

    /**
     * @param Worklab $worklab
     * @param EntityManagerInterface $entityManager
     * @return Response
     */
    #[Route('/delete/{id}', name: 'delete')]
    public function delete(
        Worklab                $worklab,
        EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }
        $entityManager->remove($worklab);
        $entityManager->flush();

        $this->addFlash('successMessageFlash', 'Worklab supprimé avec succès.');
        return $this->redirectToRoute('app_home');
    }

    /**
     * @param Worklab $worklab
     * @param EntityManagerInterface $entityManager
     * @return Response
     */
    #[Route('/active/{id}', name: 'active')]
    public function active(Worklab $worklab, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        if ($user === null) {
            return $this->redirectToRoute('app_home');
        }

        $worklab->setUpdatedAt(new \DateTimeImmutable('now'));
        $entityManager->flush();
        return $this->redirectToRoute('app_home');
    }
}
