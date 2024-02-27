<?php

namespace App\Repository;

use App\Entity\Worklab;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Worklab>
 *
 * @method Worklab|null find($id, $lockMode = null, $lockVersion = null)
 * @method Worklab|null findOneBy(array $criteria, array $orderBy = null)
 * @method Worklab[]    findAll()
 * @method Worklab[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WorklabRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Worklab::class);
    }

    //    /**
    //     * @return Worklab[] Returns an array of Worklab objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('w')
    //            ->andWhere('w.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('w.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Worklab
    //    {
    //        return $this->createQueryBuilder('w')
    //            ->andWhere('w.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
