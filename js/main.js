// js/main.js

// Așteaptă ca pagina să se încarce
document.addEventListener("DOMContentLoaded", () => {

    // Selectează header-ul
    const header = document.querySelector("header");

    // Verifică dacă header-ul există pe pagină
    if (!header) {
        return;
    }

    let lastScrollTop = 0; // Stochează ultima poziție de scroll

    // Adaugă un eveniment care "ascultă" când se dă scroll
    window.addEventListener("scroll", function () {
        // Obține poziția curentă de scroll
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 80) {
            // Dacă dăm SCROLL ÎN JOS și am trecut de 80px
            // Adaugă clasa care ascunde header-ul
            header.classList.add("header-hidden");
        } else {
            // Dacă dăm SCROLL ÎN SUS
            // Scoate clasa care ascunde header-ul
            header.classList.remove("header-hidden");
        }

        // Actualizează ultima poziție de scroll
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});
// --- LOGICA PENTRU BUTONUL "BACK TO TOP" ---
const topButton = document.getElementById("back-to-top-btn");

if (topButton) {

    // 1. Logica de afișare/ascundere la scroll
    window.addEventListener("scroll", () => {
        // Dacă am derulat mai mult de 300px în jos
        if (window.scrollY > 300) {
            topButton.classList.remove("hidden"); // Arată butonul
        } else {
            topButton.classList.add("hidden"); // Ascunde butonul
        }
    });

    // 2. Logica de click (scroll sus)
    topButton.addEventListener("click", (e) => {
        e.preventDefault(); // Oprește link-ul (href="#")

        // Trimite utilizatorul sus, cu animație "smooth"
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}