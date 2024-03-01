import React, {useEffect, useRef, useState} from "react";
import {fetchDataFromServer} from "../utils/functions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";

export function InputListeName({listeID, listeName}) {

    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);
    const [name, setName] = useState(listeName)
    const [prevInputValue, setPrevInputValue] = useState(listeName);
    const handleMouseUp = (e) => {
        setIsEditing(true);
    };
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
        let newListeName = e.target.value.trim();
        if (newListeName === prevInputValue){
            console.log('pareil')
        }else {
            console.log('différente')
        }
        //
        if (newListeName !== prevInputValue){
        //     setTitle(newWorklabName)
            setPrevInputValue(newListeName)
            try {
                const object = {
                    'listeID': listeID,
                    'listeName': newListeName
                };
                console.log(object);
                const result = await fetchDataFromServer(object, '/liste/edit', 'PATCH');

            } catch (error) {
                console.log(error)
            }
        }
        setIsEditing(false);
    }


    const handleChange = (e) => {
        console.log('le titre change')
        setName(e.target.value)
    }

    return <>
        {isEditing ? (
        <input
            ref={inputRef}
        className="text-lg rounded-lg p-2.5 focus:border-cyan-400 bg-transparent dark:text-white cursor-text w-5/6 mb-2 overflow-ellipsis overflow-auto"
        value={name}
        // On ajoute les événements "onKeyPress" et "onBlur" à l'input
        onBlur={handleSubmit}
        onKeyPress={handleKeyPress}
        onChange={handleChange}

    />
        ) : (
            <>
                <h2 className="text-lg rounded-lg p-2.5 focus:border-cyan-400 bg-transparent dark:text-white cursor-pointer w-5/6 mb-2 overflow-ellipsis overflow-auto"
                    onMouseUp={handleMouseUp}>{name}</h2>
            </>
        )}
    </>

    // return <><input
    //     className="text-lg rounded-lg p-2.5 focus:border-cyan-400 bg-transparent dark:text-white cursor-pointer hover:bg-gray-700 transition-colors duration-200 w-5/6 mb-2 overflow-ellipsis overflow-auto"
    //     value={name}
    //     // On ajoute les événements "onKeyPress" et "onBlur" à l'input
    //     onBlur={handleSubmit}
    //     onKeyPress={handleKeyPress}
    //     onChange={handleChange}
    //     onMouseUp={handleMouseUp}
    // />
    //
    // </>
}








// import React, {useEffect, useState} from "react";
//
// export function InputWorklabName({id, name}) {
//     const [title, setTitle] = useState("")
//     useEffect(() => {
//         if (name) {
//             setTitle(name)
//         }
//     }, [name])
//
//
//     return <><input
//         className="ms-3 text-lg rounded-lg w-64 p-2.5 focus:border-cyan-400 bg-transparent dark:text-white mb-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
//         value={title}
//
//     />
//
//     </>
// }