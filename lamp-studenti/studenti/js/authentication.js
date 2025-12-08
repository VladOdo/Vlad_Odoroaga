(function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const onLoginPage = window.location.pathname.endsWith('login.html');

    if (isLoggedIn && onLoginPage) {
        window.location.href = "index.html";
    } 
    else if (!isLoggedIn && !onLoginPage) {
        window.location.href = "login.html";
    }
})();
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button-nav");

    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            window.location.href = "login.html";
        });
    }
});