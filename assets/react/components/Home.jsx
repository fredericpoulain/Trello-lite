import React, {useState} from "react";

// import {useState} from 'react'
import {useFetchGetListes} from "./useFetchGetListes";
import {ButtonAddList} from "./ButtonAddList";
import Listes from "./Liste";

export function Home() {
    //On récupère l'id correspondant au worklab actif. Cet id est stocké dans un attribut du DOM
    const idWorklab = document.querySelector('#titleActiveWorklab').getAttribute('data-id');
    // On récupère les listes associées à ce worklab
    const URL = `/liste/getAll/${idWorklab}`;
    //on initialise le 'useState' des listes
    const [listes, setListes] = useState(null)
    //on récupère les listes en mettant à jour le 'useState'
    const {loading, errors} = useFetchGetListes(listes, setListes, URL);
    return <>
        {loading && 'chargement...!'}
        <Listes datas={listes} setListes={setListes} />
        {!loading && <ButtonAddList idWorklab={idWorklab} listes={listes} setListes={setListes}/>}
        {errors && <div>{errors}</div>}


    </>
}