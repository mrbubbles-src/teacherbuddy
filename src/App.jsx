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
                <h1 className="title">
                    <span className="orange-span">Random-</span>Student-Name
                    <span className="orange-span">-Generator</span>
                </h1>
                <section className="name-output">
                    <div className="name-container">
                        <h2 id="name"></h2>
                    </div>
                    <div className="btn-container">
                        <button
                            id="generate"
                            className="btn"
                            onClick={RandomGenerator}
                        >
                            Generate!
                        </button>
                        <button
                            id="reset"
                            className="btn"
                            onClick={() => window.location.reload()}
                        >
                            Reset Generator
                        </button>
                    </div>
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
