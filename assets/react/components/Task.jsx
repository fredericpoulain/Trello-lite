import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import {fetchDataFromServer} from "../utils/functions";
let dataTaskDragged;
export function Task({listes, setListes, keyValue, taskName, taskID, taskSort, listeID, temptTask, setTempTask}) {

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(taskName)
    const [prevName, setPrevName] = useState(taskName)
    const [initDraggableTask, setInitDraggableTask] = useState(false);
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


    const initDrag = (e, taskID, taskSort, listeID) => {
        // console.log('task InitDrag')
        e.currentTarget.setAttribute('draggable', true)
        setTempTask(e.currentTarget)
        setInitDraggableTask(true)
        dataTaskDragged  = {taskID, taskSort, listeID};

    }

    const handleDragStartTask = (e, taskID, taskSort, listeID) => {
        e.stopPropagation();
        e.target.style.opacity = '0.2'
        // console.log('task dragStart')
        const data = {taskID, taskSort, listeID};
        e.dataTransfer.setData("application/json", JSON.stringify(data));
    }


    const handleDragLeave = (e) => {

        //élément en cours de déplacement quitte une zone de dépôt valide.
        // console.log('handleDragLeave : quitte une zone de dépôt valide.')
        // console.log(e.currentTarget)
    }
    const handleDragEnter = (e) => {
        e.preventDefault()

        //élément en cours de déplacement arrive sur une zone de dépôt valide
        //ici il faudrait distinguer cette zone : elle ne doit pas être la même que celle qui est dragged
        // console.log('handleDragEnter : arrive sur une zone de dépôt valide')
        console.log('handleDragEnter')
        // console.log(dataTaskDragged)

        const draggedTaskListeID = dataTaskDragged.listeID;
        const draggedTaskID = dataTaskDragged.taskID;
        const draggedTaskSort = dataTaskDragged.taskSort;

        const dragEnterTaskListeID = Number(e.currentTarget.getAttribute('data-listeid'))
        const dragEnterTaskID = Number(e.currentTarget.getAttribute('data-taskid'))
        const dragEnterTaskSort = Number(e.currentTarget.getAttribute('data-tasksort'))

        if (draggedTaskID === dragEnterTaskID){
            e.currentTarget.style.opacity = '0.2'
        }

        if (draggedTaskID !== dragEnterTaskID){
            console.log('dépot valide')
            const updatedListes = [...listes];
            // //cherche l'index de la liste dragged et celle "enter"
            let iListeA = updatedListes.findIndex((l) => l.listeID == draggedTaskListeID)
            let iListeB = updatedListes.findIndex((l) => l.listeID == dragEnterTaskListeID)


            // //dans cette liste, parmis les 'listeTasks' je cherche l'index de la taskDragged par son ID
            // //dans cette liste, parmis les 'listeTasks' je cherche l'index de la taskEnter par son ID
            const iTaskA = updatedListes[iListeA].listeTasks.findIndex((l) => l.taskID == draggedTaskID)
            const iTaskB = updatedListes[iListeB].listeTasks.findIndex((l) => l.taskID == dragEnterTaskID)


            // const tempObjectB = updatedListes[iListeB].listeTasks[iTaskB];

            const sortTaskA = updatedListes[iListeA].listeTasks[iTaskA].taskSort;
            const sortTaskB = updatedListes[iListeB].listeTasks[iTaskB].taskSort;

            if (iListeA !== iListeB){
                console.log('liste différente')
                //on stock la task temporairement, et on lui ajout le sort de la taskB
                const tempObjectA = updatedListes[iListeA].listeTasks[iTaskA];
                tempObjectA.taskSort = sortTaskB;

                //on boucle sur les taskB  pour leur augmenter leur "sort" car la taskA va se placer devant.
                const arrayTaskB = updatedListes[iListeB].listeTasks
                for (let i = iTaskB; i<arrayTaskB.length; i++){
                    arrayTaskB[iTaskB].taskSort++
                }
                //on transfert l'objet taskA vers la liste des taskB à l'indice de la taskB survolée
                updatedListes[iListeB].listeTasks.splice(iTaskB, 0, tempObjectA );
                updatedListes[iListeA].listeTasks.splice(iTaskA, 1);

                //on réinitialise tous les "sort" des task de la liste A
                let compteur = 0
                for (let task of updatedListes[iListeA].listeTasks){
                    task.taskSort = compteur;
                    compteur++
                }


            }else{

                console.log('liste identique')

                if (sortTaskA < sortTaskB){
                    //on descend
                    updatedListes[iListeB].listeTasks[iTaskB].taskSort--
                    updatedListes[iListeA].listeTasks[iTaskA].taskSort++
                }else{
                    updatedListes[iListeB].listeTasks[iTaskB].taskSort++
                    updatedListes[iListeA].listeTasks[iTaskA].taskSort--
                }
            }

            setListes(updatedListes);
            dataTaskDragged.listeID = updatedListes[iListeB].listeID
        }

    }

    const handleDragOverTask = (e) => {
        e.preventDefault()
        e.stopPropagation();
        console.log('dragover')
        // console.log('task dragOver')

        // const elementSurvole = e.currentTarget.getAttribute('data-listeid');
        // console.log('ID Liste : '+elementSurvole)
    }
    const handleOnDrag = (e) => {
        console.log('on drag')

    }
    const handleDropTask = async (e, targetTaskID, targetTaskSort, targetListeID) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('task Drop')
        const data = JSON.parse(e.dataTransfer.getData("application/json"));
        // console.log(data)
        const draggedTaskID = data.taskID;
        const draggedTaskSort = data.taskSort;
        const draggedListeID = data.listeID;

        if (draggedTaskID != targetTaskID) {


            // console.log('on drag')
            // const updatedListes = [...listes];
            //
            // //cherche l'index de la liste dragged et celle target
            // const indexListeDraggedUseState = updatedListes.findIndex((l) => l.listeID == draggedListeID)
            // const indexListeTargetUseState = updatedListes.findIndex((l) => l.listeID == targetListeID)
            //
            // //dans cette liste, parmis les 'listeTasks' je cherche l'index de la taskDragged par son ID
            // //dans cette liste, parmis les 'listeTasks' je cherche l'index de la taskTarget par son ID
            // const indexTaskDraggedUseState = updatedListes[indexListeDraggedUseState].listeTasks.findIndex((l) => l.taskID == draggedTaskID)
            // const indexTaskTargetUseState = updatedListes[indexListeTargetUseState].listeTasks.findIndex((l) => l.taskID == targetTaskID)
            //
            // //je stock le "sort" de la task dragged
            // const tempSort = updatedListes[indexListeDraggedUseState].listeTasks[indexTaskDraggedUseState].taskSort;
            // updatedListes[indexListeDraggedUseState].listeTasks[indexTaskDraggedUseState].taskSort = updatedListes[indexListeTargetUseState].listeTasks[indexTaskTargetUseState].taskSort
            // updatedListes[indexListeTargetUseState].listeTasks[indexTaskTargetUseState].taskSort = tempSort;
            //
            // //Si par contre les listes sont différentes, il faudra en plus inverser les deux objets 'task'
            // if (draggedListeID != targetListeID) {
            //     const tempObject = updatedListes[indexListeDraggedUseState].listeTasks[indexTaskDraggedUseState];
            //     updatedListes[indexListeDraggedUseState].listeTasks[indexTaskDraggedUseState] = updatedListes[indexListeTargetUseState].listeTasks[indexTaskTargetUseState]
            //     updatedListes[indexListeTargetUseState].listeTasks[indexTaskTargetUseState] = tempObject;
            // }
            // setListes(updatedListes);
            //
            // try {
            //     const object = {
            //         'draggedTaskID': draggedTaskID,
            //         'draggedTaskSort': targetTaskSort,
            //         'draggedListeID': draggedListeID != targetListeID ? targetListeID : draggedListeID,
            //         'targetTaskID': targetTaskID,
            //         'targetTaskSort': draggedTaskSort,
            //         'targetListeID': draggedListeID != targetListeID ? draggedListeID : targetListeID,
            //
            //     };
            //     console.log(object);
            //     const result = await fetchDataFromServer(object, '/task/editSort', 'PATCH');
            //
            // } catch (error) {
            //     console.log(error)
            // }

        } else {
            console.log('On fait rien')
        }
        e.currentTarget.style.opacity = '1'
        setTempTask(null)
    }

    const handleDragEndTask = (e) => {
        e.stopPropagation();
        e.target.removeAttribute('draggable')
        e.target.style.opacity = '1'
        setInitDraggableTask(false)


    }


    return <>
        <li
            key={keyValue}
            data-taskid={taskID}
            data-tasksort={taskSort}
            data-listeid={listeID}
            className="h-11 bg-neutral-600 rounded-lg cursor-grab my-2.5 flex justify-between items-center truncate w-full"
            onMouseDown={(e) => initDrag(e, taskID, taskSort, listeID)}
            onDragStart={initDraggableTask ? ((e) => handleDragStartTask(e, taskID, taskSort, listeID)) : null}
            onDrag={handleOnDrag}

            onDragLeave={handleDragLeave}
            onDragEnter={handleDragEnter}

            onDragOver={handleDragOverTask}
            onDrop={(e) => handleDropTask(e, taskID, taskSort, listeID)}
            onDragEnd={initDraggableTask ? handleDragEndTask : null}

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
                        className=" z-1 w-5 h-5 p-5 me-1 hover:bg-neutral-500 rounded-full flex justify-center items-center cursor-pointer"
                        onClick={handleEditClick}
                    >
                <FontAwesomeIcon icon={faPen}/>
            </span>
                </>
            )}
        </li>

    </>
}