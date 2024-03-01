import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import {fetchDataFromServer} from "../utils/functions";

export function Task({keyValue, taskName, taskID}) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(taskName)
    const [prevName, setPrevName] = useState(taskName)
    const inputRef = useRef(null);
    const handleEditClick = (e) => {
        setIsEditing(true);
    };
    const handleChange = (e) => {
        console.log('le nom de la tâche change')
        setName(e.target.value)
        console.log(name)
    }
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus(); // Mise du focus sur l'élément <input>
        }
    }, [isEditing]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            console.log(e.target)
            handleSubmit(e);
            e.target.blur()
        }
    }
    const handleSubmit = async (e) => {
        let newTaskName = e.target.value.trim();
        if (newTaskName === prevName){
            console.log('pareil')
        }else {
            console.log('différente')
        }
        //
        if (newTaskName !== prevName){
            //     setTitle(newWorklabName)
            setPrevName(newTaskName)
            try {
                const object = {
                    'taskID': taskID,
                    'taskName': newTaskName
                };
                console.log(object);
                const result = await fetchDataFromServer(object, '/liste/taskEdit', 'PATCH');

            } catch (error) {
                console.log(error)
            }
        }
        setIsEditing(false);
    }
    return <>
        <li key={keyValue} className="h-11 bg-neutral-600 rounded-lg cursor-grab my-2.5 flex justify-between items-center truncate w-full">
            {isEditing ? (
                <input
                    ref={inputRef}
                    className="text-lg p-1.5 w-full rounded-lg outline-none focus:border-2 focus:border-cyan-400 bg-transparent dark:text-white w-5/6 "
                    value={name}
                    // On ajoute les événements "onKeyPress" et "onBlur" à l'input
                    onBlur={handleSubmit}
                    onKeyPress={handleKeyPress}
                    onChange={handleChange}
                />
            ) : (
                <>
                    <span className="p-1.5 w-5/6 truncate overflow-ellipsis">{name}</span>
                    <span
                        className=" z-1 w-5 h-5 p-5 me-1 hover:bg-neutral-500 rounded-full flex justify-center items-center cursor-pointer"
                        onClick={handleEditClick}
                    >
                <FontAwesomeIcon icon={faPen}/>
            </span>
                </>
            )}
        </li>

    </>
    // Créer un état local pour le nom et le mode édition de la tâche
    // const [name, setName] = useState(taskName);
    // const [isEditing, setIsEditing] = useState(false);
    //
    // // Créer une fonction qui change le mode édition lorsque l'on clique sur l'icône du stylo
    // const handleEditClick = () => {
    //     setIsEditing(true);
    // };
    //
    // // Créer une fonction qui change le nom de la tâche lorsque l'on change la valeur de l'input
    // const handleChange = (event) => {
    //     setName(event.target.value);
    // };
    //
    // // Créer une fonction qui valide le changement de nom et sort du mode édition lorsque l'on appuie sur la touche Entrée
    // const handleKeyDown = (event) => {
    //     if (event.key === "Enter") {
    //         // Ici, vous pouvez aussi appeler une fonction qui met à jour le nom de la tâche sur le serveur
    //         setIsEditing(false);
    //     }
    // };

    // Rendre le li avec une condition pour afficher soit un span, soit un input
    // return (
    //     <li
    //         key={`task-${taskID}`}
    //         className="p-1.5 h-11 bg-neutral-600 rounded-lg cursor-grab my-2.5 flex justify-between items-center truncate w-full"
    //     >
    //         {isEditing ? (
    //             <input
    //                 type="text"
    //                 value={name}
    //                 onChange={handleChange}
    //                 onKeyDown={handleKeyDown}
    //                 className="w-5/6 truncate overflow-ellipsis"
    //             />
    //         ) : (
    //             <span className="w-5/6 truncate overflow-ellipsis">{name}</span>
    //         )}
    //         <span
    //             className=" z-1 w-5 h-5 p-5 hover:bg-neutral-500 rounded-full flex justify-center items-center cursor-pointer"
    //             onClick={handleEditClick}
    //         >
    //     <FontAwesomeIcon icon={faPen}/>
    //   </span>
    //     </li>
    // );
}