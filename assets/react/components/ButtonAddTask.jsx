import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import {fetchDataFromServer} from "../utils/functions";
import liste from "./Liste";

export function ButtonAddTask({listeID, setListes, elementListe, setElementListe}) {
    const [isFormTaskVisible, setFormTaskVisible] = useState(false);
    const [elInput, setElInput] = useState(null);
    const toggleFormTaskVisibility = (e) => {
        setFormTaskVisible(!isFormTaskVisible);

        // if (!isFormTaskVisible){
        //     const element = e.target.nextElementSibling.firstElementChild;
        //     setElInput(element);
        // }else{
        //     setElInput(null);
        // }
    };
    // useEffect(() => {
    //     if (isFormTaskVisible) {
    //         elInput.focus();
    //     }
    // }, [isFormTaskVisible]);
    const addTask = async (e) => {
        e.preventDefault()

        //ya plusieurs taskname dans le DOM !! faudra récupérer le bon !
        const elInputTaskName = e.target.parentNode.previousElementSibling;        // const elTaskName = document.querySelector('#taskName');
        const elInputValue = elInputTaskName.value
        // console.log(inputTaskName.value)
        if (elInputValue){
            const object = {
                'listeID': listeID,
                'taskName': elInputValue
            };
            try {
                // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
                const result = await fetchDataFromServer(object, '/liste/task/create', 'POST');
                const newTask = result.newTask;
                //ici il faut modifier le useState de la liste en question parmis toutes les listes, en faisant un push de la tache
                setListes(prevListes => {
                    const updatedListe = [...prevListes];
                    let listeModify = updatedListe.find(liste => liste.listeID === listeID);
                    if (listeModify) {
                        listeModify.listeTasks.push({
                            "taskID": newTask.taskID,
                            "taskName": newTask.taskName
                        });
                        return updatedListe
                    }

                });
                elInputTaskName.value = '';
                toggleFormTaskVisibility();

            } catch (error) {
                console.log(error)
            }
        }

    };


    return (
        <>
            <button type="button"
                    className="hover:bg-neutral-800 rounded-lg p-2.5 color duration-200 text-white w-full text-start"
                    onClick={toggleFormTaskVisibility}
                    style={{ display: isFormTaskVisible ? 'none' : 'block' }}
            >
                <FontAwesomeIcon icon={faPlus}/> <span className="ms-1">Ajouter une tâche</span>
            </button>
            <form className={`h-fit rounded-lg w-full ${isFormTaskVisible ? '' : 'hidden'}`} method="POST" >
                <input id="taskName" className="p-3 w-full rounded-lg bg-slate-800 border-2 border-cyan-600 outline-0" name="taskName" placeholder="Entrez le nom de la tâche…"/>
                <div className="flex justify-between mt-2">
                    <button type="submit"
                            className=" bg-cyan-600 hover:bg-cyan-400 rounded-lg p-3 transition-colors duration-200 text-white hover:text-black"
                            onClick={addTask}
                    >
                        Ajouter
                    </button>
                    <button className="w-10 hover:bg-red-900 rounded-lg text-3xl" type="button" onClick={toggleFormTaskVisibility}><FontAwesomeIcon icon={faXmark}/></button>
                </div>
            </form>
        </>
    );
}
