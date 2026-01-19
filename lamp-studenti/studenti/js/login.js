document.addEventListener("DOMContentLoaded", () => {
    
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("login-error-message");
    
    // Verificăm dacă aceste elemente chiar există pe pagină.
    // Dacă nu suntem pe pagina de login (ex: suntem pe Home), scriptul se oprește aici ca să nu dea erori.
    if (!loginForm || !errorMessage) return;

    // Căutăm butonul de trimitere ("Autentificare") din interiorul formularului
    const submitButton = loginForm.querySelector("button[type='submit']");

    loginForm.addEventListener("submit", (e) => { 
        e.preventDefault(); 
        // 1. Colectăm datele scrise de utilizator în câmpuri
        // '.trim()' șterge spațiile goale accidentale de la început sau sfârșit
        const username = e.target.username.value.trim();
        const password = e.target.password.value;

        // Resetăm interfața înainte de a trimite cererea:
        // Ascundem orice mesaj de eroare vechi adăugând clasa 'error-hidden'
        errorMessage.classList.add("error-hidden");
    
        errorMessage.style.display = "none";
        errorMessage.textContent = "";
        
        // Dacă am găsit butonul, îl blocăm ca utilizatorul să nu poată apăsa de 10 ori la rând
        if (submitButton) {
            submitButton.disabled = true; 
            submitButton.textContent = "Se verifică..."; 
        }

        // 2. Trimiterea datelor către server (Backend PHP)
        // Folosim funcția 'fetch' pentru a trimite un mesaj către fișierul 'backend/login.php'
        fetch('backend/login.php', {
            method: 'POST', // Metoda POST este folosită pentru a trimite date sensibile (nu apar în URL)
            headers: {
                'Content-Type': 'application/json' // Îi spunem serverului că îi trimitem date în format JSON
            },
            // Transformăm datele noastre (obiect JS) în text JSON pentru a putea fi trimise prin internet
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => {
            // Aici primim primul răspuns de la server 
            if (!response.ok) {
                // Dacă serverul a dat eroare (ex: 404 sau 500), aruncăm o excepție manuală
                throw new Error('Serverul a răspuns cu eroarea: ' + response.status);
            }
            return response.json();
        }) 
        .then(data => {
            // 3. Interpretarea răspunsului final de la PHP
            if (data.success === true) {
                // Salvăm în memoria browserului (localStorage) faptul că suntem logați
                localStorage.setItem("isLoggedIn", "true");
                
                // Salvăm numele utilizatorului
                localStorage.setItem("username", data.username || username);
                
                // Dacă serverul ne-a trimis și rolul (ex: 'admin'), îl salvăm
                if (data.role) {
                    localStorage.setItem("userRole", data.role);
                }
                
                window.location.href = "index.html";
            } else {
                // Afișăm mesajul de eroare primit de la PHP (sau un mesaj standard)
                errorMessage.textContent = data.message || "Date de autentificare invalide.";
                
                // Facem mesajul vizibil
                errorMessage.classList.remove("error-hidden");
                errorMessage.style.display = "block";
            }
        })
        .catch(error => {
            console.error('Eroare tehnică:', error);
            errorMessage.textContent = "Nu s-a putut contacta serverul. Verifică Docker.";
            errorMessage.classList.remove("error-hidden");
            errorMessage.style.display = "block";
        })
        .finally(() => {
            // Acest bloc se execută MEREU, indiferent dacă a fost succes sau eroare            
            // Reactivăm butonul ca utilizatorul să poată încerca din nou
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Autentificare";
            }
        });
    });
});