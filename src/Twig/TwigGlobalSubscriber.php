<?php

namespace App\Twig;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Twig\Environment;

readonly class TwigGlobalSubscriber implements EventSubscriberInterface
{
    public function __construct(
        Private Environment            $twig,
        Private EntityManagerInterface $entityManager,
        Private Security $security
    )

    {
    }
    public function injectGlobalUserWorklab(ControllerEvent $event): void
    {
        //on récupère l'id de l'utilisateur actuellement connecté :
        $user = $this->security->getUser(); // récupérez l'objet User
        $worklabList = [];
        if ($user){
            $userId = $user->getId(); // récupérez son identifiant

            //et on injecte son ID dans requête sql pour récupérer ses worklab:
            $worklabList = $this->entityManager->getConnection()
                ->executeQuery('SELECT worklab.* FROM worklab 
WHERE worklab.user_id = :userId ', ['userId' => $userId])
                ->fetchAllAssociative();
        }


        // On injecte les données dans une variable globale de Twig
        $this->twig->addGlobal('globalWorklabList', $worklabList);
    }

    public static function getSubscribedEvents(): array
    {
        return [KernelEvents::CONTROLLER => 'injectGlobalUserWorklab'];
    }
}