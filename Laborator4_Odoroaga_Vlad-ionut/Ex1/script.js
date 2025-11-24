const input = document.getElementById("inputActivitate");
const btn = document.getElementById("btnAdauga");
const lista = document.getElementById("listaActivitati");
const luni = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
];

btn.addEventListener("click", function() {
    const textActivitate = input.value;
    if (textActivitate !== "") {
        const elementNou = document.createElement("li");
        const d = new Date();
        const dataF = d.getDate() + " " + luni[d.getMonth()] + " " + d.getFullYear();
        elementNou.textContent = `${textActivitate} - adăugată la: ${dataF}`;
        lista.appendChild(elementNou);
        input.value = "";
    } else {
        alert("Te rog introdu o activitate!");
    }
});