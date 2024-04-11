import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faXmark} from '@fortawesome/free-solid-svg-icons';
import {fetchDataFromServer} from "../../utils/functions";
import liste from "../Listes";

export function ButtonAddList({idWorklab, setListes}) {
    const [isFormVisible, setFormVisible] = useState(false);

    const toggleFormVisibility = () => {
        setFormVisible(!isFormVisible);
    };
    useEffect(() => {
        if (isFormVisible) {
            const elInput = document.querySelector('#listeName');
            elInput.focus();
        }
    }, [isFormVisible]);
    const addList = async (e) => {
        e.preventDefault()
        const elListeName = document.querySelector('#listeName');
        const listeName = elListeName.value
        if (listeName) {
            const object = {
                'worklabID': idWorklab,
                'listeName': listeName
            };
            try {
                // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
                const result = await fetchDataFromServer(object, '/liste/create', 'POST');
                const newListe = result.newListe;
                setListes(prevListes => {
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
            <div className="w-72 mx-3 p-3 pt-0">
                <button type="button"
                        className="bg-gray-100 bg-opacity-30 hover:bg-opacity-15 rounded-lg transition-opacity duration-200 text-white text-start whitespace-nowrap w-64 h-12 ps-4"
                        onClick={toggleFormVisibility}
                        style={{display: isFormVisible ? 'none' : 'block'}}
                >
                    <FontAwesomeIcon icon={faPlus}/> <span className="ms-1">Ajouter une liste</span>
                </button>
                <form className={`h-fit bg-neutral-950 p-2 rounded-lg ${isFormVisible ? '' : 'hidden'}`}
                      style={{width: 'inherit'}}
                      method="POST">
                    <input
                        id="listeName"
                        className="text-lg rounded-lg outline-none focus:border-2 focus:border-cyan-400 bg-transparent dark:text-white overflow-hidden break-words overflow-y-hidden w-64 px-3 py-2.5"
                        style={{width: '100%'}}
                        name="listeName"
                        placeholder="Entrez le nom de la liste…"
                    />
                    <div className="flex justify-between mt-2">
                        <button type="submit"
                                className=" bg-cyan-600 hover:bg-cyan-400 rounded-lg p-3 transition-colors duration-200 text-white hover:text-black"
                                onClick={(e) => addList(e)}
                        >
                            Ajouter
                        </button>
                        <button className="w-10 hover:bg-red-900 rounded-lg text-3xl" type="button"
                                onClick={toggleFormVisibility}><FontAwesomeIcon icon={faXmark}/></button>
                    </div>
                </form>
            </div>
        </>
    );
}
