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

        const studentName =
            studentNamesArr[student].charAt(0).toUpperCase() +
            studentNamesArr[student].slice(1);

        nameOutputField.innerHTML = studentName;

        studentNamesArr = studentNamesArr.filter(
            (name) => name !== studentNamesArr[student]
        );
    }
}
