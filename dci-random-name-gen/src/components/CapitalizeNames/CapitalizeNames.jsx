export default function CapitalizeNames(names) {
    return names
        .split(" ")
        .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
        .join(" ");
}
