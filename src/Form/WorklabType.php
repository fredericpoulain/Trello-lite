<?php

namespace App\Form;

use App\Entity\User;
use App\Entity\Worklab;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;

class WorklabType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Ajouter un worklab',
                'label_attr' => ['class' => 'mb-3 block font-bold'],
                'attr' => [
                    'class' => 'border text-lg rounded-lg block p-2.5 focus:border-cyan-400 focus:outline-none bg-transparent dark:text-white mb-2 w-full',
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Vous devez indiquer un nom.',
                    ])
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Worklab::class,
        ]);
    }
}
