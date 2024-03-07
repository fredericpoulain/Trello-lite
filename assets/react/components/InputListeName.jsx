import React, {useEffect, useRef, useState} from "react";
import {fetchDataFromServer} from "../utils/functions";


export function InputListeName({listeID, listeName}) {

    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);
    const [name, setName] = useState(listeName)
    const [prevInputValue, setPrevInputValue] = useState(listeName);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus(); // Mise du focus sur l'élément <input>
        }
    }, [isEditing]);
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
            e.target.blur()
        }
    }
    const handleMouseUpEditListe = () => {
        setIsEditing(true);
    }
    const handleSubmit = async (e) => {
        let newListeName = e.target.value.trim();
        if (newListeName !== prevInputValue){
            setPrevInputValue(newListeName)
            try {
                const object = {
                    'listeID': listeID,
                    'listeName': newListeName
                };
                const result = await fetchDataFromServer(object, '/liste/editName', 'PATCH');
                console.log(result.message)
            } catch (error) {
                console.log(error)
            }
        }
        setIsEditing(false);
    }


    const handleChange = (e) => {
        setName(e.target.value)
    }

    return <>
        {isEditing ? (
            <input
                ref={inputRef}
                className="ms-3 text-lg rounded-tl-lg border-2 border-transparent p-2.5 outline-none  bg-transparent dark:text-white cursor-text w-5/6 overflow-ellipsis overflow-auto"
                value={name}
                // On ajoute les événements "onKeyPress" et "onBlur" à l'input
                onBlur={handleSubmit}
                onKeyPress={handleKeyPress}
                onChange={handleChange}

            />
        ) : (
            <>
                <h2 className="text-lg ms-3 p-2.5 dark:text-white cursor-pointer w-5/6 hover:text-cyan-400 hover:text-bold overflow-ellipsis overflow auto overflow-y-clip transition duration-200"
                    onMouseUp={handleMouseUpEditListe}

                >{name}</h2>

            </>
        )}
    </>

}



