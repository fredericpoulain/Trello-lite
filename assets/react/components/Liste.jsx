import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {fetchDataFromServer} from "../utils/functions.js";
import {ButtonAddTask} from "./ButtonAddTask";


function Listes({ datas, setListes, elementListe, setElementListe}) {
    const deleteListe = async (listeID) => {
        console.log('Suppression de la liste avec l\'ID :', listeID);
        //bloc de code à mettre dans une fonction ou un composant
        const object = {'listeID': listeID};
        try {
            // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
            const result = await fetchDataFromServer(object, '/liste/delete', 'DELETE');
            console.log(result);

            // Mise à jour du useState
            const updatedDataListes = datas.filter(liste => liste.listeID !== listeID);
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
    return (
        <>
            {datas && datas.map(liste => (
                <div key={liste.listeID}
                     className="w-64 bg-neutral-900 mx-3 p-3 rounded-lg text-neutral-300 h-fit relative">
                    <button className="w-10 hover:bg-red-900 rounded-lg text-3xl absolute top-1 right-1" type="button"
                            onClick={() => handleDeleteConfirmation(liste.listeID)}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </button>

                    <h2 className="text-2xl my-2 p-3">{liste.listeName}</h2>
                    <ul>
                        {liste.listeTasks.map(task => (
                            <li key={task.taskID}
                                className="p-2.5 bg-neutral-600 rounded-lg cursor-grab my-2.5">{task.taskName}</li>
                        ))}
                    </ul>
                    <ButtonAddTask listeID={liste.listeID} setListes={setListes} elementListe={elementListe} setElementListe={setElementListe}/>

                </div>
            ))}

        </>
    );

}

export default Listes;

// if (datas){
//     // console.log(datas)
//     datas.map(liste => {
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