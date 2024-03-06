import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faXmark} from "@fortawesome/free-solid-svg-icons";
import {fetchDataFromServer} from "../utils/functions.js";
import {ButtonAddTask} from "./ButtonAddTask";
import {InputListeName} from "./InputListeName";
import {Task} from "./Task";
import {DragDropContext, Droppable} from "@hello-pangea/dnd";


function Listes({
                    listes,
                    setListes,
                    onDragEnd,
                    initDragListe,
                    listeIsDraggable,
                    onDragEndListe,
                    onDragOverListe,
                    onDragStartListe,
                    sourceListe
                }) {
    const [visibleFormListeID, setVisibleFormListeID] = useState(null);
// console.log(listes)
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
    // draggableId={taskID.toString()}

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                {listes && listes.map(liste => (
                    <Droppable droppableId={liste.listeID.toString()} key={`droppable-${liste.listeID}`}>
                        {(provider, snapshot) => (
                            <div
                                {...provider.droppableProps}
                                ref={provider.innerRef}
                                key={`list-${liste.listeID}`}
                                draggable={listeIsDraggable}
                                onDragEnd={onDragEndListe}
                                onDragOver={onDragOverListe}
                                onDragStart={onDragStartListe}
                                className= 'h-full'
                                // style={{height: 'fit-content'}}
                                >


                                <div
                                    data-listeid={liste.listeID}
                                    data-listesort={liste.listeSort}
                                    className="flex justify-start max-h-full flex-col w-72 bg-neutral-900 mx-3 p-3 rounded-lg text-neutral-300 relative">
                                    <button
                                        className="w-10 hover:bg-red-900 rounded-lg text-3xl absolute top-1 right-1"
                                        type="button"
                                        onClick={() => handleDeleteConfirmation(liste.listeID)}>
                                        <FontAwesomeIcon icon={faXmark}/>
                                    </button>

                                    <InputListeName listeID={liste.listeID} listeName={liste.listeName}
                                                    initDragListe={initDragListe}/>
                                    <ul className="h-auto overflow-x-hidden scrollbar">
                                        {liste.listeTasks.map((task, index) => (
                                            <Task
                                                key={`task-${task.taskID}`}
                                                taskID={task.taskID}
                                                taskName={task.taskName}
                                                taskSort={task.taskSort}
                                                listeID={liste.listeID}
                                                index={index}
                                            />
                                        ))}
                                    </ul>

                                    <ButtonAddTask
                                        listeID={liste.listeID}
                                        setListes={setListes}
                                        isFormTaskVisible={liste.listeID === visibleFormListeID}
                                        setFormTaskVisible={setVisibleFormListeID}/>
                                </div>
                                {provider.placeholder}
                            </div>
                        )}

                    </Droppable>
                ))}
            </DragDropContext>
        </>
    );


}

export default Listes;
