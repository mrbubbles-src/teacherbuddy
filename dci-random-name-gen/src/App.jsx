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
