export default function RetrieveLocalStorageData() {
    let studentNamesArr = [];
    for (let i = 0; i < localStorage.length; i++) {
        const localStorageNameKey = localStorage.key(i);
        const studentName = localStorage.getItem(localStorageNameKey);
        studentNamesArr.push(studentName);
    }
    return studentNamesArr;
}
