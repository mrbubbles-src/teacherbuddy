import RetrieveLocalStorageData from "./RetrieveLocalStorageData";

let studentNamesArr = RetrieveLocalStorageData();

export default function CheckIfNamesExist() {
    if (studentNamesArr.length === 0) {
        document.getElementById("name").innerHTML =
            "Please enter the names of your students to be able to generate a random student name.";
        document.getElementById("generate").style.display = "none";
        document.getElementById("reset").style.display = "none";
    } else {
        document.getElementById("name").innerHTML =
            "Press 'Genereate!' to generate a random student name.";
        document.getElementById("generate").style.display = "inline-block";
        document.getElementById("reset").style.display = "inline-block";
    }
}
// CheckIfNamesExist();
