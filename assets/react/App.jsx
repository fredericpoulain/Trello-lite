import React, {useEffect, useRef, useState} from 'react';
import {Home} from "./components/Home";
import {InputWorklabName} from "./components/Inputs/InputWorklabName";

function App() {
    const [worklab, setWorklab] = useState(null)


    return <>
        <InputWorklabName id={worklab?.worklabID} name={worklab?.worklabName}/>
        {/*overflow-hidden*/}
            <div className="flex mainContainer">
                <Home
                    worklab={worklab}
                    setWorklab={setWorklab}
                />
            </div>


    </>

}

export default App
