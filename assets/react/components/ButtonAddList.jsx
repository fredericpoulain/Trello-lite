import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import {fetchDataFromServer} from "../utils/functions";
import liste from "./Liste";

export function ButtonAddList({idWorklab ,listes, setListes}) {
    const [isFormVisible, setFormVisible] = useState(false);

    const toggleFormVisibility = () => {
        setFormVisible(!isFormVisible);
    };
    const addList = async (e, idWorklab) => {

        e.preventDefault()
        const elListeName = document.querySelector('#listeName');
        const listeName = elListeName.value
        console.log(typeof listeName)
        if (listeName){
            const object = {
                'worklabID': idWorklab,
                'listeName': listeName
            };
            try {
                // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
                const result = await fetchDataFromServer(object, '/liste/create', 'POST');
                const newListe = result.newListe;
                console.log(newListe)
                setListes(prevListes => {
                    console.log(prevListes)
                    const updatedListe = [...prevListes];
                    updatedListe.push(newListe)
                    return updatedListe;
                });
                elListeName.value = '';
                toggleFormVisibility();

            } catch (error) {
                console.log(error)
            }
        }

    };


    return (
        <>
            <button type="button"
                    className="bg-gray-100 bg-opacity-30 hover:bg-opacity-15 rounded-lg p-3 transition-opacity duration-200 text-white w-64 h-12 text-start mx-3"
                    onClick={toggleFormVisibility}
                    style={{ display: isFormVisible ? 'none' : 'block' }}
            >
                <FontAwesomeIcon icon={faPlus}/> <span className="ms-1">Ajouter une liste</span>
            </button>
            <form className={`h-fit bg-neutral-950 p-2 rounded-lg w-64 ${isFormVisible ? '' : 'hidden'}`} method="POST" >
                <input id="listeName" className="p-3 w-full rounded-lg bg-slate-800 border-2 border-cyan-600 outline-0" name="listeName" placeholder="Saisissez le titre de la liste…"/>
                <div className="flex justify-between mt-2">
                    <button type="submit"
                            className=" bg-cyan-600 hover:bg-cyan-400 rounded-lg p-3 transition-colors duration-200 text-white hover:text-black"
                            onClick={(e) => addList(e, idWorklab)}
                    >
                        Ajouter une liste
                    </button>
                    <button className="w-10 hover:bg-red-900 rounded-lg text-3xl" type="button" onClick={toggleFormVisibility}><FontAwesomeIcon icon={faXmark}/></button>
                </div>
            </form>
        </>
    );
}
