import CapitalizeNames from "../CapitalizeNames/CapitalizeNames";
import RetrieveLocalStorageData from "../RetrieveLocalStorageData/RetrieveLocalStorageData";

let studentNamesArr = RetrieveLocalStorageData();

export default function RandomGenerator() {
    const nameOutputField = document.getElementById("name");
    if (studentNamesArr.length === 0) {
        nameOutputField.innerHTML = `No more names! Press <span class="orange-span">'Reset Generator'</span> to start generating again!`;
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
                student.style.textDecorationColor = "#ff6001";
                student.style.color = "#1b39c9";
            }
        });
    }
}
