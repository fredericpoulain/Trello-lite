import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import {fetchDataFromServer} from "../utils/functions";
import {Draggable} from "@hello-pangea/dnd";

export function Task({keyValue, taskName, taskID, taskSort, listeID, index}) {

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

    //si modification faudrait peut etre mettre a jour le useState non ?????????????????????????????????????????
    const handleSubmit = async (e) => {
        let newTaskName = e.target.value.trim();
        if (newTaskName === prevName) {
            console.log('pareil')
        } else {
            console.log('différente')
        }
        //
        if (newTaskName !== prevName) {
            //     setTitle(newWorklabName)
            setPrevName(newTaskName)
            try {
                const object = {
                    'taskID': taskID,
                    'taskName': newTaskName
                };
                console.log(object);
                const result = await fetchDataFromServer(object, '/task/editName', 'PATCH');

            } catch (error) {
                console.log(error)
            }
        }
        setIsEditing(false);
    }


    return <>
        <Draggable draggableId={taskID.toString()} index={index}>
            {provider => (
                <li {...provider.draggableProps}
                    {...provider.dragHandleProps}
                    ref={provider.innerRef}
                    key={keyValue}
                    data-taskid={taskID}
                    data-tasksort={taskSort}
                    data-listeid={listeID}
                    className="h-11 bg-neutral-700 rounded-lg cursor-grab my-2.5 flex justify-between items-center truncate w-full"
                >
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
                                className=" w-5 h-5 p-5 me-1 hover:bg-neutral-500 rounded-full flex justify-center items-center cursor-pointer"
                                onClick={handleEditClick}
                            >
                <FontAwesomeIcon icon={faPen}/>
            </span>
                        </>
                    )}
                </li>
            )}

        </Draggable>
    </>
}