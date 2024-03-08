import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import {fetchDataFromServer} from "../utils/functions";
import {Draggable} from "@hello-pangea/dnd";

export function Task({keyValue, taskName, taskID, taskSort, listeID, index}) {

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(taskName)
    const [prevName, setPrevName] = useState(taskName)
    const [heightTextarea, setHeightTextarea] = useState(null)
    const inputRef = useRef(null);
    const handleEditClick = (e) => {
        setIsEditing(true);
        const heightParent = e.currentTarget.parentNode.clientHeight
        setHeightTextarea(heightParent * 1.20)
        // 108 -> 128px
    };

    const handleChange = (e) => {
        setName(e.target.value)
    }
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus(); // Mise du focus sur l'élément <input>
        }
    }, [isEditing]);


    //valide le nouveau nom de la tâche sur touche "Enter"
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
            e.target.blur()
        }
    }

    //Change le nom de la task
    const handleSubmit = async (e) => {
        let newTaskName = e.target.value.trim();

        if (newTaskName !== prevName) {
            setPrevName(newTaskName)
            try {
                const object = {
                    'taskID': taskID,
                    'taskName': newTaskName
                };
                const result = await fetchDataFromServer(object, '/task/editName', 'PATCH');
                console.log(result.message)
            } catch (error) {
                console.log(error)
            }
        }
        setIsEditing(false);
    }


    return <>
        <Draggable draggableId={taskID.toString()} index={index}>
            {(provider, snapshot) => (
                <li {...provider.draggableProps}
                    {...provider.dragHandleProps}
                    ref={provider.innerRef}
                    key={keyValue}
                    data-taskid={taskID}
                    data-tasksort={taskSort}
                    data-listeid={listeID}
                    className={`rounded-lg cursor-grab my-2.5 flex justify-between items-center w-full ${snapshot.isDragging ? 'bg-cyan-400 text-black' : 'bg-neutral-700'}`}

                >
                    {isEditing ? (
                        <textarea
                            ref={inputRef}
                            className="text-lg p-2.5 w-full rounded-lg outline-none focus:border-2 focus:border-cyan-400 bg-transparent dark:text-white w-5/6 overflow-hidden break-words overflow-y-hidden"
                            style={{height: heightTextarea || 'auto'}}
                            value={name}
                            // On ajoute les événements "onKeyPress" et "onBlur" à l'input
                            onBlur={handleSubmit}
                            onKeyPress={handleKeyPress}
                            onChange={handleChange}
                        />
                    ) : (
                        <>
                            <span className="p-1.5 w-5/6 break-words">{name}</span>
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