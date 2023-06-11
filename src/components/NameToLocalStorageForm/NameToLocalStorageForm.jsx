import { useState } from "react";
import CheckIfNamesExist from "../CheckIfNameExist/CheckIfNamesExist";

export default function NameToLocalStorageForm() {
    const [studentName, setStudentName] = useState("");

    const saveToStorage = () => {
        localStorage.setItem(studentName, studentName);
        setStudentName("");
        CheckIfNamesExist();
    };

    return (
        <form onSubmit={(event) => event.preventDefault()}>
            <input
                className="input-student"
                type="text"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                placeholder="Input a Student's Name"
            />{" "}
            <button
                className="submit-student btn"
                type="submit"
                onClick={saveToStorage}
            >
                Submit Student
            </button>
        </form>
    );
}
