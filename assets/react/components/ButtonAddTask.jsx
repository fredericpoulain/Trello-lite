import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faXmark} from '@fortawesome/free-solid-svg-icons';
import {fetchDataFromServer} from "../utils/functions";
import liste from "./Listes";

export function ButtonAddTask({listeID, setListes, isFormTaskVisible, setFormTaskVisible,verifyHeight}) {

    const toggleFormTaskVisibility = (e) => {
        setFormTaskVisible(isFormTaskVisible ? null : listeID);
    };
    useEffect(() => {
        if (isFormTaskVisible) {
            const elInput = document.querySelector(`#taskName-${listeID}`); // vous sélectionnez l'élément input correspondant à l'id de la liste
            elInput.focus();
        }
    }, [isFormTaskVisible, listeID]); // vous ajoutez listeID comme dépendance de useEffect

    const addTask = async (e) => {
        e.preventDefault()
        const elInputTaskName = e.target.parentNode.previousElementSibling;
        const elInputValue = elInputTaskName.value
        if (elInputValue) {
            const object = {
                'listeID': listeID,
                'taskName': elInputValue
            };
            try {
                // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
                const result = await fetchDataFromServer(object, '/task/create', 'POST');
                const newTask = result.newTask;
                //ici il faut modifier le useState de la liste en question parmis toutes les listes, en faisant un push de la tache
                setListes(prevListes => {
                    return prevListes.map(liste => {
                        if (liste.listeID === listeID) {
                            return {
                                ...liste,
                                listeTasks: [...liste.listeTasks, newTask]
                            };
                        }
                        return liste;
                    });
                });
                elInputTaskName.value = '';
                elInputTaskName.focus()
                verifyHeight()

            } catch (error) {
                console.log(error)
            }
        }
    };


    return (
        <>
            <div className="divbtnAddTask">
                <button type="button"
                        className="hover:bg-neutral-800 rounded-lg p-2.5 color duration-200 text-white w-full text-start "
                        onClick={toggleFormTaskVisibility}
                        style={{display: isFormTaskVisible ? 'none' : 'block'}}
                >
                    <FontAwesomeIcon icon={faPlus}/> <span className="ms-1">Ajouter une tâche</span>
                </button>
            </div>
            <form className={`h-fit rounded-lg w-full ${isFormTaskVisible ? '' : 'hidden'}`} method="POST">
                <textarea id={`taskName-${listeID}`}
                          className="text-lg p-2.5 w-full rounded-lg outline-none focus:border-2 focus:border-cyan-400 bg-transparent dark:text-white w-5/6 min-h-20 overflow-hidden break-words overflow-y-hidden"
                          name="taskName"
                       placeholder="Entrez le nom de la tâche…"/>
                <div className="flex justify-between mt-2">
                    <button type="submit"
                            className=" bg-cyan-600 hover:bg-cyan-400 rounded-lg p-3 transition-colors duration-200 text-white hover:text-black"
                            onClick={addTask}
                    >
                        Ajouter
                    </button>
                    <button className="w-10 hover:bg-red-900 rounded-lg text-3xl" type="button"
                            onClick={toggleFormTaskVisibility}><FontAwesomeIcon icon={faXmark}/></button>
                </div>
            </form>
        </>
    );
}
