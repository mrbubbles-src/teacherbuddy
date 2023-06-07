import RetrieveLocalStorageData from "../RetrieveLocalStorageData/RetrieveLocalStorageData";

export default function CheckIfNamesExist() {
    let studentNamesArr = RetrieveLocalStorageData();
    if (studentNamesArr.length === 0) {
        document.getElementById(
            "name"
        ).innerHTML = `Please <span class="blue-span">enter the names of your students</span> to be able to <span class="orange-span">generate a random student name</span>.`;
        document.getElementById("generate").style.display = "none";
        document.getElementById("reset").style.display = "none";
    } else {
        document.getElementById(
            "name"
        ).innerHTML = `Press <span class="orange-span">'Generate!</span>' to generate a random student name.`;
        document.getElementById("generate").style.display = "inline-block";
        document.getElementById("reset").style.display = "inline-block";
    }
}
