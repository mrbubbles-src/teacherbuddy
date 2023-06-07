import RetrieveLocalStorageData from "../RetrieveLocalStorageData/RetrieveLocalStorageData";
import CapitalizeNames from "../CapitalizeNames/CapitalizeNames";

export default function StudentNameList() {
    const studentNames = RetrieveLocalStorageData();

    const sortedStudentNames = [...studentNames].sort(function (a, b) {
        let nameA = a.split(" ");
        let nameB = b.split(" ");

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        return 0;
    });

    return (
        <ul className="studentNameList">
            {sortedStudentNames.map((name, i) => (
                <li className="student" key={i}>
                    {CapitalizeNames(name)}
                </li>
            ))}
        </ul>
    );
}
