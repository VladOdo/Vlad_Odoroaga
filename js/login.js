// js/login.js

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("login-error-message");

    // Verifică dacă e deja logat
    if (localStorage.getItem("isLoggedIn") === "true") {
        // Dacă da, trimite-l direct la pagina Acasă
        window.location.href = "index.html";
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Oprește trimiterea formularului

        // Preluăm valorile
        const username = e.target.username.value;
        const password = e.target.password.value;

        // Datele "corecte" (le poți schimba)
        const corectUsername = "admin";
        const corectPassword = "1234";

        if (username === corectUsername && password === corectPassword) {
            // Logare reușită!
            // Salvăm starea de logat în browser
            localStorage.setItem("isLoggedIn", "true");

            // Trimitem utilizatorul la pagina Acasă
            window.location.href = "index.html";
        } else {
            // Logare eșuată!
            // Arătăm mesajul de eroare
            errorMessage.classList.remove("error-hidden");
        }
    });
});