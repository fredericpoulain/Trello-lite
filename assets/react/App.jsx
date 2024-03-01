import React, {useState} from 'react';
import {Home} from "./components/Home";
import {InputWorklabName} from "./components/InputWorklabName";
function App() {
    const [worklab, setWorklab] = useState(null)
    return <>
        <InputWorklabName id={worklab?.worklabID} name={worklab?.worklabName}/>
        <div className="flex h-full"> <Home worklab={worklab} setWorklab={setWorklab} /></div>

    </>
}
export default App
