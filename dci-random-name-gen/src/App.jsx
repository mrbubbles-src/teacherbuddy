import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import NameToLocalStorageForm from "./components/NameToLocalStorageForm";
import RetrieveLocalStorageData from "./components/RetrieveLocalStorageData";
import RandomGenerator from "./components/RandomGenerator";
import CheckIfNamesExist from "./components/CheckIfNamesExist";

function App() {
    useEffect(() => {
        RetrieveLocalStorageData();
        CheckIfNamesExist();
    }, []);

    return (
        <div className="App">
            <NameToLocalStorageForm />
            <button id="generate" onClick={RandomGenerator}>
                Generate!
            </button>{" "}
            <button id="reset" onClick={() => window.location.reload()}>
                Reset Generator
            </button>
            <h2 id="name"></h2>
        </div>
    );
}

export default App;
