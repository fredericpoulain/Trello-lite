import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faXmark} from "@fortawesome/free-solid-svg-icons";
import {fetchDataFromServer} from "../utils/functions.js";
import {ButtonAddTask} from "./ButtonAddTask";
import {InputListeName} from "./InputListeName";
import {Task} from "./Task";


function Listes({ listes, setListes}) {
    const [visibleFormListeID, setVisibleFormListeID] = useState(null);
    const [initDraggableListe, setInitDraggableListe] = useState(false);
console.log(listes)
    const deleteListe = async (listeID) => {
        console.log('Suppression de la liste avec l\'ID :', listeID);
        //bloc de code à mettre dans une fonction ou un composant
        const object = {'listeID': listeID};
        try {
            // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
            const result = await fetchDataFromServer(object, '/liste/delete', 'DELETE');
            console.log(result);

            // Mise à jour du useState
            const updatedDataListes = listes.filter(liste => liste.listeID !== listeID);
            setListes(updatedDataListes);


        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteConfirmation = (listeID) => {
        const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette liste ?');
        if (isConfirmed) {
            deleteListe(listeID);
        }
    }

    const initDrag = (e) => {
        e.target.parentNode.setAttribute('draggable', true)
        setInitDraggableListe(true)
    }
    const handleDragStartListe = (e, listeID, listeSort) => {
        console.log('handleDragStartListe');

        //L'id de l'élément en cours de "drop" est stocké dans le dataTransfert
        const data = { listeID, listeSort };
        e.dataTransfer.setData("application/json", JSON.stringify(data));
    };

    const handleDragOverListe = (e) => {
        e.preventDefault()
        const elementSurvole = e.currentTarget.getAttribute('data-listeid');
        console.log('ID Liste : '+elementSurvole)

    }
    const handleDropListe = async (e, targetListID, targetListSort) => {
        console.log('handleDropListe')
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
        const draggedListID = data.listeID;
        const draggedListSort = data.listeSort;

        if (draggedListID !== targetListID) {
            const updatedListes = [...listes];
            const indexDraggedUseState = updatedListes.findIndex((l) => l.listeID == draggedListID)
            const indexTargetUseState = updatedListes.findIndex((l) => l.listeID == targetListID)
            // Inverse les valeurs de listeSort des deux premières listes
            const temp = updatedListes[indexDraggedUseState].listeSort;
            updatedListes[indexDraggedUseState].listeSort = updatedListes[indexTargetUseState].listeSort;
            updatedListes[indexTargetUseState].listeSort = temp;

            // Met à jour l'état avec la nouvelle liste modifiée
            setListes(updatedListes);

            try {
                const object = {
                    'draggedListID': draggedListID,
                    'draggedListSort': listes[indexDraggedUseState].listeSort,
                    'targetListID': targetListID,
                    'targetListSort': listes[indexTargetUseState].listeSort,
                };
                console.log(object);
                const result = await fetchDataFromServer(object, '/liste/editSort', 'PATCH');

            } catch (error) {
                console.log(error)
            }
        }



    };

    const handleDragEnd = (e) => {
        e.target.removeAttribute('draggable')
        setInitDraggableListe(false)
    }



    return (
        <>
            {listes && listes
                .slice() // Crée une copie de la liste pour éviter la mutation de la liste originale
                .sort((a, b) => a.listeSort - b.listeSort) // Trie la liste par ordre croissant de listeSort
                .map(liste => (
                    <div key={liste.listeID}
                         data-listeid={liste.listeID}
                         data-listesort={liste.listeSort}
                         onDragStart={initDraggableListe ? ((e) => handleDragStartListe(e, liste.listeID, liste.listeSort)) : null}
                         onDragOver={initDraggableListe ? handleDragOverListe : null}
                         onDrop={initDraggableListe ? ((e) => handleDropListe(e, liste.listeID, liste.listeSort)) : null}
                         onDragEnd={initDraggableListe ? handleDragEnd : null}
                         className="w-64 bg-neutral-900 mx-3 p-3 rounded-lg text-neutral-300 h-fit relative">
                        <button className="w-10 hover:bg-red-900 rounded-lg text-3xl absolute top-1 right-1" type="button"
                                onClick={() => handleDeleteConfirmation(liste.listeID)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <InputListeName listeID={liste.listeID} listeName={liste.listeName} initDrag={initDrag}/>
                        <ul>
                            {liste.listeTasks
                                .slice() // Crée une copie de la liste des tâches pour éviter la mutation de la liste originale
                                .sort((a, b) => a.taskSort - b.taskSort) // Trie les tâches par ordre croissant de taskSort
                                .map(task => (
                                    <Task
                                        key={`task-${task.taskID}`}
                                        taskID={task.taskID}
                                        taskName={task.taskName}
                                        taskSort={task.taskSort}
                                        listeID = {liste.listeID}
                                        listes={listes}
                                        setListes={setListes}
                                    />
                                ))}
                        </ul>
                        <ButtonAddTask
                            listeID={liste.listeID}
                            setListes={setListes}
                            isFormTaskVisible={liste.listeID === visibleFormListeID}
                            setFormTaskVisible={setVisibleFormListeID} />
                    </div>
                ))}
        </>
    );


}

export default Listes;

// if (listes){
//     // console.log(listes)
//     listes.map(liste => {
//         console.log(liste.listeID)
//         console.log(liste.listeName)
//         // const tasks = liste.listeTasks;
//         liste.listeTasks.map(task => {
//             console.log(task.taskID)
//             console.log(task.taskName)
//         })
//     })
//
// }