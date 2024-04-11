import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faXmark} from "@fortawesome/free-solid-svg-icons";
import {fetchDataFromServer} from "../utils/functions.js";
import {ButtonAddTask} from "./Buttons/ButtonAddTask";
import {InputListeName} from "./Inputs/InputListeName";
import {Task} from "./Task";
import {DragDropContext, Droppable} from "@hello-pangea/dnd";


function Listes({listes, setListes, onDragEnd, initDragListe, divRefs, verifyHeight }) {
    const [visibleFormListeID, setVisibleFormListeID] = useState(null);


    const deleteListe = async (listeID) => {
        const object = {'listeID': listeID};
        try {
            // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
            const result = await fetchDataFromServer(object, '/liste/delete', 'DELETE');
            console.log(result.message);

            // Mise à jour du 'useState'
            const updatedDataListes = listes.filter(liste => liste.listeID !== listeID);
            setListes(updatedDataListes);

        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteConfirmation = (listeID) => {
        const isConfirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cette liste ?');
        if (isConfirmed) deleteListe(listeID);
    }


    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                {listes && listes.map(liste => (
                    <React.Fragment key={`listparent-${liste.listeID}`}>
                        <div className="liste">
                            <div className="headerListe relative">
                                <div className='bg-neutral-900 w-72 mx-auto rounded-t-lg'>
                                    <button
                                        className="w-10 hover:bg-red-900 rounded-tr-lg text-3xl absolute top-0 right-3 h-full"
                                        type="button"
                                        onClick={() => handleDeleteConfirmation(liste.listeID)}>
                                        <FontAwesomeIcon icon={faXmark}/>
                                    </button>
                                    <InputListeName
                                        listeID={liste.listeID}
                                        listeName={liste.listeName}
                                        initDragListe={initDragListe}
                                    />
                                </div>

                            </div>
                            <div ref={el => divRefs.current[liste.listeID] = el} className="bodyListe">
                                <Droppable droppableId={liste.listeID.toString()} key={`droppable-${liste.listeID}`}>
                                    {(provider, snapshot) => (
                                        <div
                                            {...provider.droppableProps}
                                            ref={provider.innerRef}
                                            key={`list-${liste.listeID}`}
                                            data-listeid={liste.listeID}
                                            data-listesort={liste.listeSort}
                                            className="flex justify-start flex-col w-72 bg-neutral-900 mx-3 p-3 pt-4 rounded-b-lg text-neutral-300 relative bodyListeContainer">

                                            <ul
                                                className="listeUl scrollbar"
                                            >
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
                                            {provider.placeholder}
                                            <ButtonAddTask
                                                listeID={liste.listeID}
                                                setListes={setListes}
                                                isFormTaskVisible={liste.listeID === visibleFormListeID}
                                                setFormTaskVisible={setVisibleFormListeID}
                                                verifyHeight={verifyHeight}

                                            />

                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    </React.Fragment>

                ))}
            </DragDropContext>
        </>
    );


}

export default Listes;

