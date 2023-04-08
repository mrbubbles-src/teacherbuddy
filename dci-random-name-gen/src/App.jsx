import { useEffect } from "react";
import "./App.scss";
import NameToLocalStorageForm from "./components/NameToLocalStorageForm/NameToLocalStorageForm";
import RetrieveLocalStorageData from "./components/RetrieveLocalStorageData/RetrieveLocalStorageData";
import RandomGenerator from "./components/RandomGenerator/RandomGenerator";
import CheckIfNamesExist from "./components/CheckIfNameExist/CheckIfNamesExist";
import StudentNameList from "./components/StudentNameList/StudentNameList";

function App() {
    useEffect(() => {
        RetrieveLocalStorageData();
        CheckIfNamesExist();
    }, []);

    return (
        <>
            <header className="input-student-name">
                <NameToLocalStorageForm />
            </header>
            <main className="main-container">
                <h1 className="title">DCI Random Student-Name Generator</h1>
                <section className="name-output">
                    <button id="generate" onClick={RandomGenerator}>
                        Generate!
                    </button>
                    <h2 id="name"></h2>
                    <button id="reset" onClick={() => window.location.reload()}>
                        Reset Generator
                    </button>
                </section>
                <section className="student-list">
                    <StudentNameList />
                </section>
            </main>
            <footer>
                <p>
                    Created by student{" "}
                    <a
                        href="https://github.com/mrbubbles-src"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Manuel Fahrenholz
                    </a>{" "}
                    in class 'FBW WD D07 A' of the{" "}
                    <a
                        href="https://digitalcareerinstitute.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Digital Career Institute
                    </a>
                </p>
            </footer>
        </>
    );
}

export default App;
