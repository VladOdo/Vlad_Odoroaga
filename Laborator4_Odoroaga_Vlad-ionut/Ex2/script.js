const luni = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
];

const divDetalii = document.getElementById("detalii");
const btnDetalii = document.getElementById("btnDetalii");
const spanData = document.getElementById("dataProdus");

window.onload = function() {
    divDetalii.classList.add("ascuns");
    const d = new Date();
    const dataCurenta = d.getDate() + " " + luni[d.getMonth()] + " " + d.getFullYear();
    
    if(spanData) {
        spanData.textContent = dataCurenta;
    }
};

btnDetalii.addEventListener("click", function() {
    divDetalii.classList.toggle("ascuns");
    if (!divDetalii.classList.contains("ascuns")) {
        btnDetalii.textContent = "Ascunde detalii";
    } else {
        btnDetalii.textContent = "Afișează detalii";
    }
});