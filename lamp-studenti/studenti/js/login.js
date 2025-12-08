document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("login-error-message");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const username = e.target.username.value;
        const password = e.target.password.value;
        
        const corectUsername = "admin";
        const corectPassword = "1234";

        if (username === corectUsername && password === corectPassword) {
            // Logare reușită
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "index.html";
        } else {
            // Logare eșuată
            errorMessage.classList.remove("error-hidden");
        }
    });
});