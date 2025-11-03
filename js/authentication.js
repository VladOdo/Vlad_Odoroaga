if (localStorage.getItem("isLoggedIn") !== "true") {

    // Dacă nu suntem logați, ne trimite la pagina de login
    window.location.href = "login.html";
}