import React, {useState} from "react";

// import {useState} from 'react'
import {useFetchGetListes} from "./useFetchGetListes";
import {ButtonAddList} from "./ButtonAddList";
import Listes from "./Liste";
import {InputWorklabName} from "./InputWorklabName";

export function Home({worklab, setWorklab}) {

    //On récupère l'id correspondant au worklab actif. Cet id est stocké dans un attribut du DOM
    const elTitleWorklab = document.querySelector('#ulWorklabAside>li:first-of-type')
    if(elTitleWorklab){
        // const idWorklab = elTitleWorklab.getAttribute('data-id');
        const idWorklab = elTitleWorklab.getAttribute('data-idWorklab');
        // console.log(idWorklabb)
        // On récupère les listes associées à ce worklab
        const URL = `/liste/getAll/${idWorklab}`;
        //on initialise le 'useState' des listes
        const [listes, setListes] = useState(null)

        //on récupère les listes en mettant à jour le 'useState'
        const {loading, errors} = useFetchGetListes(worklab, setWorklab, listes, setListes, URL);

        return <>
            {loading && 'chargement...!'}
            {/*{!loading && (<div><InputWorklabName worklab={worklab} /></div>)}*/}
            <Listes datas={listes} listes={listes} setListes={setListes}/>
            {!loading && <ButtonAddList idWorklab={idWorklab} setListes={setListes}/>}
            {errors && <div>{errors}</div>}

        </>
    }
}