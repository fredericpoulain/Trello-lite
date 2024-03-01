import React, {useEffect, useRef, useState} from "react";
import {fetchDataFromServer} from "../utils/functions";

export function InputWorklabName({id, name}) {
    const [title, setTitle] = useState("")
    const [idWorklab, setIdWorklab] = useState("")
    const [prevInputValue, setPrevInputValue] = useState("");
    useEffect(() => {
        if (name) {
            // console.log(name)
            setTitle(name)
            setPrevInputValue(name)

        }
    }, [name])
    useEffect(() => {
        if (id) {
            setIdWorklab(id)
        }
    }, [id])


    const handleBlur = async (e) => {
        let newWorklabName = e.target.value.trim();

        if (newWorklabName !== prevInputValue){
            setTitle(newWorklabName)
            setPrevInputValue(newWorklabName)
            console.log('valeur changée')
            try {
                const object = {
                    'worklabID': idWorklab,
                    'worklabName': newWorklabName
                };
                console.log(object);

                // Utilisation de la fonction fetchDataFromServer pour communiquer avec le serveur
                const result = await fetchDataFromServer(object, '/worklab/edit', 'PATCH');
                const linkElementAside = document.querySelector(`li[data-idworklab='${idWorklab}'] a`);
                linkElementAside.textContent = newWorklabName;

            } catch (error) {
                console.log(error)
            }
        }
    }


    const handleChange = (e) => {
        setTitle(e.target.value)
    }

    return <><input
        className="ms-3 text-lg rounded-lg w-64 p-2.5 focus:border-cyan-400 bg-transparent dark:text-white mb-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
        value={title}
        // On ajoute les événements "onKeyPress" et "onBlur" à l'input
        onBlur={handleBlur}
        onChange={handleChange}

    />

    </>
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