import React, {useState} from "react";

import {useFetchGetListes} from "./useFetchGetListes";
import {ButtonAddList} from "./ButtonAddList";
import Listes from "./Listes";
import {fetchDataFromServer} from "../utils/functions";
// import uuid from "uuid";
// import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";


export function Home({worklab, setWorklab}) {



    //On récupère l'id correspondant au worklab actif. Cet id est stocké dans un attribut du DOM
    const elTitleWorklab = document.querySelector('#ulWorklabAside>li:first-of-type')
    if (elTitleWorklab) {
        // const idWorklab = elTitleWorklab.getAttribute('data-id');
        const idWorklab = elTitleWorklab.getAttribute('data-idWorklab');
        const URL = `/liste/getAll/${idWorklab}`;
        const [listes, setListes] = useState(null)
        const [listeIsDraggable, setListeIsDraggable] = useState(false);
        const [sourceListe, setSourceListe] = useState(null);
        const [destinationListe, setDestinationListe] = useState(null);

        // //on récupère les listes en mettant à jour le 'useState'
        const {loading, errors} = useFetchGetListes(worklab, setWorklab, listes, setListes, URL);


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

            try {
                // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
                const resultServer = await fetchDataFromServer(modifiedTasks, '/task/dragAndDrop', 'PATCH');
                if (!resultServer.isSuccessfull) throw new Error(`Une erreur est survenue: ${resultServer.message}`);
                console.log(resultServer.message)

            } catch (error) {
                console.log(error)
            }

        };
        const initDragListe = (e) => {
            setListeIsDraggable(true)
        }
        const onDragStartListe = (e) => {
            const listeID = Number(e.currentTarget.firstElementChild.getAttribute('data-listeid'));
            const listeSort = Number(e.currentTarget.firstElementChild.getAttribute('data-listesort'));

            setSourceListe({listeID, listeSort})
        }
        const onDragOverListe = (e) => {
            // const source = sourceListe.listeID
            const destination = Number(e.currentTarget.firstElementChild.getAttribute('data-listeid'));
            setDestinationListe(destination)


        }

        const onDragEndListe = async (e) => {
            const sourceID = sourceListe.listeID
            // const destinationID = destinationListe;
            if (sourceID === destinationListe) {
                return
            }

            const updatedListes = [...listes];

            // Trouver l'index de la liste source
            const sourceListeIndex = updatedListes.findIndex(liste => liste.listeID === sourceID);

            // Trouver l'index de la liste destination
            const destinationListeIndex = updatedListes.findIndex(liste => liste.listeID === destinationListe);

            // Assurez-vous que les indices trouvés sont valides
            if (sourceListeIndex === -1 || destinationListeIndex === -1) {
                console.error('Liste source ou destination non trouvée');
                return;
            }

            const listeSource = updatedListes[sourceListeIndex];
            // Utilisez les indices trouvés pour splice
            updatedListes.splice(sourceListeIndex, 1);
            updatedListes.splice(destinationListeIndex, 0, listeSource);

            const modifiedListe = [];
            // On met à jour les valeurs de listeSort pour chaque liste
            updatedListes.forEach((liste, index) => {
                liste.listeSort = index + 1;
                // On ajoute la liste modifiée au tableau
                modifiedListe.push({
                    listeID: Number(liste.listeID),
                    listeSort: Number(liste.listeSort),
                });
            });

            setListes(updatedListes);
            setListeIsDraggable(false)
            setSourceListe(null)

            try {
                // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
                const resultServer = await fetchDataFromServer(modifiedListe, '/liste/dragAndDrop', 'PATCH');
                if (!resultServer.isSuccessfull) throw new Error(`Une erreur est survenue: ${resultServer.message}`);
                console.log(resultServer.message)

            } catch (error) {
                console.log(error)
            }
        }


        return <>
            {loading && 'chargement...!'}
            <Listes
                listes={listes}
                setListes={setListes}
                onDragEnd={ondragend}
                initDragListe={initDragListe}
                listeIsDraggable={listeIsDraggable}
                onDragEndListe={onDragEndListe}
                onDragOverListe={onDragOverListe}
                onDragStartListe={onDragStartListe}
                sourceListe={sourceListe}

            />
            {!loading && <ButtonAddList idWorklab={idWorklab} setListes={setListes}/>}
            {errors && <div>{errors}</div>}
        </>
    }
}










// const itemsFromBackend = [
//     { id: uuidv4(), content: "First task" },
//     { id: uuidv4(), content: "Second task" },
//     { id: uuidv4(), content: "Third task" },
//     { id: uuidv4(), content: "Fourth task" },
//     { id: uuidv4(), content: "Fifth task" }
// ];
//
// const columnsFromBackend = {
//     [uuidv4()]: {
//         name: "Requested",
//         items: itemsFromBackend
//     },
//     [uuidv4()]: {
//         name: "To do",
//         items: []
//     },
//     [uuidv4()]: {
//         name: "In Progress",
//         items: []
//     },
//     [uuidv4()]: {
//         name: "Done",
//         items: []
//     }
// };


// const [columns, setColumns] = useState(columnsFromBackend);
// return (
//     <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
//         <DragDropContext
//             onDragEnd={result => onDragEnd(result, columns, setColumns)}
//         >
//             {Object.entries(columns).map(([columnId, column], index) => {
//                 return (
//                     <div
//                         style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center"
//                         }}
//                         key={columnId}
//                     >
//                         <h2>{column.name}</h2>
//                         <div style={{ margin: 8 }}>
//                             <Droppable droppableId={columnId} key={columnId}>
//                                 {(provided, snapshot) => {
//                                     return (
//                                         <div
//                                             {...provided.droppableProps}
//                                             ref={provided.innerRef}
//                                             style={{
//                                                 background: snapshot.isDraggingOver
//                                                     ? "lightblue"
//                                                     : "lightgrey",
//                                                 padding: 4,
//                                                 width: 250,
//                                                 minHeight: 500
//                                             }}
//                                         >
//                                             {column.items.map((item, index) => {
//                                                 return (
//                                                     <Draggable
//                                                         key={item.id}
//                                                         draggableId={item.id}
//                                                         index={index}
//                                                     >
//                                                         {(provided, snapshot) => {
//                                                             return (
//                                                                 <div
//                                                                     ref={provided.innerRef}
//                                                                     {...provided.draggableProps}
//                                                                     {...provided.dragHandleProps}
//                                                                     style={{
//                                                                         userSelect: "none",
//                                                                         padding: 16,
//                                                                         margin: "0 0 8px 0",
//                                                                         minHeight: "50px",
//                                                                         backgroundColor: snapshot.isDragging
//                                                                             ? "#263B4A"
//                                                                             : "#456C86",
//                                                                         color: "white",
//                                                                         ...provided.draggableProps.style
//                                                                     }}
//                                                                 >
//                                                                     {item.content}
//                                                                 </div>
//                                                             );
//                                                         }}
//                                                     </Draggable>
//                                                 );
//                                             })}
//                                             {provided.placeholder}
//                                         </div>
//                                     );
//                                 }}
//                             </Droppable>
//                         </div>
//                     </div>
//                 );
//             })}
//         </DragDropContext>
//     </div>
// );