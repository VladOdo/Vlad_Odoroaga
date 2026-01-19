document.addEventListener("DOMContentLoaded", () => {
    
    // 1. VERIFICAREA IDENTITĂȚII 
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    // Verificăm ce rol are utilizatorul (poate fi 'admin', 'user' sau nimic/null).
    const userRole = localStorage.getItem("userRole"); 
    const logoutBtn = document.getElementById("logout-button-header");
    
    // Căutăm zona din header unde stau butoanele de utilizator 
    const userActions = document.querySelector(".user-actions");

    // 2. CREAREA BUTONULUI DE "PANOU ADMIN" (Doar pentru Șefi)
    if (isLoggedIn && userRole === 'admin' && userActions) {

        const adminBtn = document.createElement("a");
        adminBtn.href = "admin.html";
        adminBtn.className = "logout-btn admin-panel-btn"; 
        adminBtn.textContent = "Panou Admin";
        userActions.insertBefore(adminBtn, userActions.firstChild);
    }

    // 3. GESTIONAREA BUTONULUI DE DECONECTARE
    if (logoutBtn) {
        // Verificăm din nou
        if (isLoggedIn && userRole === 'admin') {
            logoutBtn.classList.remove("hidden");
        } else {
            logoutBtn.classList.add("hidden");
        }

        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Ștergem TOT din memoria browserului
            localStorage.clear();
            
            // Reîncărcăm pagina principală ca un vizitator simplu
            window.location.href = "index.html";
        });
    }

    // 4. PAZNICUL PENTRU PAGINI INTERZISE
    // Verificăm dacă adresa URL conține "setari.html".
    if (window.location.pathname.includes("setari.html")) {
        window.location.href = "index.html";
    }
});