<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class, [
                'label' => 'Adresse email *',
                'label_attr' => ['class' => 'mb-3 block'],
                'attr' => [
                    'class' => 'border text-lg rounded-lg block p-2.5 focus:border-cyan-400 focus:outline-none bg-transparent dark:text-white mb-8 w-full',
                    'placeholder' => 'exemple@domaine.com'
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Vous devez indiquer une adresse email.',
                    ]),
                    new Email([
                        'mode' => 'strict',
                        'message' => 'L\'adresse email n\'est pas valide.',
                    ]),
                ]
            ])
            ->add('agreeTerms', CheckboxType::class, [
                'mapped' => false,
                'constraints' => [
                    new IsTrue([
                        'message' => 'Vous devez accepter les conditions d\'utilisation.',
                    ]),
                ],
            ])
            ->add('userName', TextType::class, [
                'label' => 'Pseudo *',
                'label_attr' => ['class' => 'mb-3 block'],
                'attr' => [
                    'class' => 'border text-lg rounded-lg block p-2.5 focus:border-cyan-400 focus:outline-none bg-transparent dark:text-white mb-8 w-full',
                    'placeholder' => "Votre nom d'utilisateur"
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Vous devez indiquer un pseudo.',
                    ])
                ]
            ])
            ->add('plainPassword', PasswordType::class, [
                'mapped' => false,
                'label' => 'Mot de passe *',
                'label_attr' => ['class' => 'mb-3 block'],
                'attr' => [
                    'autocomplete' => 'new-password',
                    'class' => 'border text-lg rounded-lg block p-2.5 focus:border-cyan-400 focus:outline-none bg-transparent dark:text-white mb-8 w-full',
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un mot de passe',
                    ]),
                    new Length([
                        'min' => 6,
                        'minMessage' => 'Votre mot de passe doit être supérieur à {{ limit }} caractères',
                        'max' => 4096,
                    ]),
                ],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
