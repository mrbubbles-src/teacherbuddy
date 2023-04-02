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

        const studentNameInLi = document.querySelectorAll(".student");
        const studentNameInH2 = document.getElementById("name");

        studentNameInLi.forEach((student) => {
            if (student.textContent === studentNameInH2.textContent) {
                student.style.textDecoration = "line-through";
                student.style.textDecorationColor = "#FDD92E";
                student.style.color = "#A2C6FF";
            }
        });
    }
}
