import { useEffect } from "react";
import "./App.css";
import NameToLocalStorageForm from "./components/NameToLocalStorageForm";
import RetrieveLocalStorageData from "./components/RetrieveLocalStorageData";
import RandomGenerator from "./components/RandomGenerator";
import CheckIfNamesExist from "./components/CheckIfNamesExist";
import StudentNameList from "./components/StudentNameList";

function App() {
    useEffect(() => {
        RetrieveLocalStorageData();
        CheckIfNamesExist();
    }, []);

    return (
        <main className="main-container">
            <NameToLocalStorageForm />
            <button id="generate" onClick={RandomGenerator}>
                Generate!
            </button>{" "}
            <button id="reset" onClick={() => window.location.reload()}>
                Reset Generator
            </button>
            <h2 id="name"></h2>
            <StudentNameList />
        </main>
    );
}

export default App;
