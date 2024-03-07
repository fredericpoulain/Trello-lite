import React, {useEffect, useRef, useState} from "react";

import {useFetchGetListes} from "./useFetchGetListes";
import {ButtonAddList} from "./ButtonAddList";
import Listes from "./Listes";
import {fetchDataFromServer} from "../utils/functions";



export function Home({worklab, setWorklab}) {

    //On récupère l'id correspondant au worklab actif. Cet id est stocké dans un attribut du DOM
    const elTitleWorklab = document.querySelector('#ulWorklabAside>li:first-of-type')
    if (elTitleWorklab) {

        const idWorklab = elTitleWorklab.getAttribute('data-idWorklab');
        const URL = `/liste/getAll/${idWorklab}`;
        const [listes, setListes] = useState(null)

        // //on récupère les listes en mettant à jour le 'useState'
        const {loading, errors} = useFetchGetListes(worklab, setWorklab, listes, setListes, URL);
        const divRefs = useRef({});


        const verifyHeight = () => {
            Object.keys(divRefs.current).forEach(listeID => {
                const parentDiv = divRefs.current[listeID];
                const childDiv = parentDiv?.firstElementChild
                const elUl = childDiv?.firstElementChild

                const divAHeight = parentDiv?.offsetHeight;
                const ulBHeight = elUl?.offsetHeight;

                // Si le UL prend toute la hauteur de son parent
                if (ulBHeight >= 0.75 * divAHeight) {
                    elUl?.classList.add('overflow-x-hidden');
                } else {
                    elUl?.classList.remove('overflow-x-hidden');
                }

            });
        }
        useEffect(() => {
            verifyHeight();
        }, [listes]);



        const ondragend = async result => {
            const {destination, source, draggableId} = result;

            // Si le déplacement n'est pas valide, on ne fait rien
            if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
                return;
            }

            // Création d'une copie des listes pour modification
            const updatedListes = [...listes];
            // Tableau pour stocker les tâches modifiées
            const modifiedTasks = [];

            // Index de la liste source
            const sourceListeIndex = updatedListes.findIndex(liste => liste.listeID == source.droppableId);
            // Index de la liste destination
            const destinationListeIndex = updatedListes.findIndex(liste => liste.listeID == destination.droppableId);

            // Si le déplacement est au sein de la même liste
            if (source.droppableId === destination.droppableId) {
                const taskSource = updatedListes[sourceListeIndex].listeTasks[source.index];

                // On déplace la tâche dans la nouvelle position
                updatedListes[sourceListeIndex].listeTasks.splice(source.index, 1);
                updatedListes[sourceListeIndex].listeTasks.splice(destination.index, 0, taskSource);

                // On met à jour les valeurs de taskSort pour la liste source
                updatedListes[sourceListeIndex].listeTasks.forEach((task, index) => {
                    task.taskSort = index + 1; // +1 car l'index commence à 0
                    // On ajoute la tâche modifiée au tableau
                    modifiedTasks.push({
                        taskID: Number(task.taskID),
                        taskSort: Number(task.taskSort),
                        listeID: Number(updatedListes[sourceListeIndex].listeID)
                    });
                });
            } else {
                // Si le déplacement est entre différentes listes
                const taskSource = updatedListes[sourceListeIndex].listeTasks[source.index];

                // On supprime la tâche de la liste source
                updatedListes[sourceListeIndex].listeTasks.splice(source.index, 1);
                // On Ajoute la tâche à la liste destination
                updatedListes[destinationListeIndex].listeTasks.splice(destination.index, 0, taskSource);

                // On Met à jour les valeurs de taskSort pour les listes source et destination
                updatedListes[sourceListeIndex].listeTasks.forEach((task, index) => {
                    task.taskSort = index + 1; // +1 car l'index commence à 0
                    // On Ajoute la tâche modifiée au tableau
                    modifiedTasks.push({
                        taskID: Number(task.taskID),
                        taskSort: Number(task.taskSort),
                        listeID: Number(updatedListes[sourceListeIndex].listeID)
                    });
                });
                updatedListes[destinationListeIndex].listeTasks.forEach((task, index) => {
                    task.taskSort = index + 1;

                    modifiedTasks.push({
                        taskID: Number(task.taskID),
                        taskSort: Number(task.taskSort),
                        listeID: Number(updatedListes[destinationListeIndex].listeID)
                    });
                });
            }

            // Mise à jour du useState
            setListes(updatedListes);
            verifyHeight();
            try {
                // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
                const resultServer = await fetchDataFromServer(modifiedTasks, '/task/dragAndDrop', 'PATCH');
                if (!resultServer.isSuccessfull) throw new Error(`Une erreur est survenue: ${resultServer.message}`);
                console.log(resultServer.message)

            } catch (error) {
                console.log(error)
            }
        };


        return <>
            {loading && 'chargement...!'}
            <Listes
                listes={listes}
                setListes={setListes}
                onDragEnd={ondragend}
                // sourceListe={sourceListe}
                divRefs={divRefs}
                verifyHeight={verifyHeight}

            />
            {!loading && <ButtonAddList idWorklab={idWorklab} setListes={setListes}/>}
            {errors && <div>{errors}</div>}
        </>
    }

}

