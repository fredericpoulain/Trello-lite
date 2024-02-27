<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/home.html.twig');
    }

    #[Route('/ajouter-un-worklab', name: 'app_addWorkLab')]
    public function workLab(): Response
    {
        return $this->render('home/home.html.twig');
    }
}
