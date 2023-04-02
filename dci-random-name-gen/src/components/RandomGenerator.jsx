import CapitalizeNames from "./CapitalizeNames";
import RetrieveLocalStorageData from "./RetrieveLocalStorageData";

let studentNamesArr = RetrieveLocalStorageData();

export default function RandomGenerator() {
    const nameOutputField = document.getElementById("name");
    if (studentNamesArr.length === 0) {
        nameOutputField.innerHTML =
            "No more names! Press 'Reset Generator' to start generating again!";
        document.getElementById("generate").style.display = "none";
    } else {
        let student = Math.floor(Math.random() * studentNamesArr.length);

        nameOutputField.innerHTML = CapitalizeNames(studentNamesArr[student]);

        studentNamesArr = studentNamesArr.filter(
            (name) => name !== studentNamesArr[student]
        );
    }
}
