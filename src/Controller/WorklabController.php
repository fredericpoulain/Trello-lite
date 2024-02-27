<?php

namespace App\Controller;

use App\Entity\Worklab;
use App\Form\WorklabType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class WorklabController extends AbstractController
{
    #[Route('/worklab/form', name: 'app_worklab_form')]
    public function displayForm(): Response
    {
        $form = $this->createForm(WorklabType::class, null, [
            'action' => $this->generateUrl('app_worklab_create'), // indique la route qui traite le formulaire
        ]);
        return $this->render('_partials/formWorklab.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    #[Route('/worklab/create', name: 'app_worklab_create')]
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
            // Traitez les données du formulaire  ici
            // Par exemple, enregistrez l'entité dans la base de données
//            $worklab = $form->getData();
            // $entityManager = $this->getDoctrine()->getManager();
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
    #[Route('/worklab/delete/{id}', name: 'app_worklab_delete')]
    public function delete(
        Worklab $worklab,
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
}
