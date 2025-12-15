document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("login-error-message");
    
    // Selectăm butonul pentru a-l putea dezactiva în timpul încărcării
    const submitButton = loginForm.querySelector("button[type='submit']");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        // 1. Colectăm datele din formular
        const username = e.target.username.value;
        const password = e.target.password.value;

        // Resetăm mesajele de eroare anterioare
        errorMessage.classList.add("error-hidden");
        errorMessage.textContent = "";

        // 2. Le trimitem către server (Backend PHP)
        fetch('backend/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => {
            // Verificăm dacă răspunsul rețelei este OK
            if (!response.ok) {
                throw new Error('Eroare rețea sau server: ' + response.status);
            }
            return response.json();
        }) 
        .then(data => {
            // 3. Verificăm ce a răspuns serverul (Baza de date)
            if (data.success === true) {
                // --- Logare reușită ---
                console.log("Login reușit. Rol:", data.role);
                
                // Salvăm starea și rolul în localStorage
                localStorage.setItem("isLoggedIn", "true");
                
                // Dacă backend-ul trimite rolul, îl salvăm (util pentru permisiuni viitoare)
                if (data.role) {
                    localStorage.setItem("userRole", data.role);
                }
                
                // Redirecționare către pagina principală
                window.location.href = "index.html";
            } else {
                // --- Logare eșuată ---
                // Afișăm mesajul de eroare venit din PHP (ex: "Utilizator sau parolă incorectă")
                errorMessage.textContent = data.message || "Eroare la autentificare";
                errorMessage.classList.remove("error-hidden");
            }
        })
        .catch(error => {
            // Erori tehnice (conexiune, server picat, JSON invalid)
            console.error('Eroare:', error);
            errorMessage.textContent = "A apărut o eroare de conexiune cu serverul.";
            errorMessage.classList.remove("error-hidden");
        });
    });
});