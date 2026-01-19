document.addEventListener("DOMContentLoaded", () => {
    // Căutăm formularul din footer
    const contactForm = document.getElementById("footer-form");
    
    // Dacă nu există pe pagină, oprim scriptul
    if (!contactForm) return;

    // Creăm un element pentru mesajele de stare (succes/eroare)
    const statusMessage = document.createElement("p");
    statusMessage.style.marginTop = "10px";
    statusMessage.style.fontSize = "0.9rem";
    statusMessage.style.fontWeight = "bold";
    statusMessage.style.display = "none"; // Ascuns inițial
    
    // Îl adăugăm sub butonul de trimitere
    contactForm.appendChild(statusMessage);

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Oprim reîncărcarea paginii

        // Colectăm datele
        // ATENȚIE: Trebuie să ne asigurăm că input-urile au name="nume", name="email", name="mesaj"
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Dezactivăm butonul în timpul trimiterii
        const btn = contactForm.querySelector("button");
        const btnTextInitial = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Se trimite...";
        
        statusMessage.style.display = "none"; // Ascundem mesajul vechi

        try {
            const response = await fetch('backend/contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                // Succes
                statusMessage.textContent = "✅ " + result.message;
                statusMessage.style.color = "#4CAF50"; // Verde
                contactForm.reset(); // Golim formularul
            } else {
                // Eroare de validare sau server
                statusMessage.textContent = "❌ " + result.message;
                statusMessage.style.color = "#ff4444"; // Roșu
            }

        } catch (error) {
            console.error("Eroare contact:", error);
            statusMessage.textContent = "❌ Eroare de conexiune. Încearcă mai târziu.";
            statusMessage.style.color = "#ff4444";
        } finally {
            // Reactivăm butonul și afișăm mesajul
            btn.disabled = false;
            btn.textContent = btnTextInitial;
            statusMessage.style.display = "block";
            
            // Ascundem mesajul de succes după 5 secunde
            if (statusMessage.style.color === "rgb(76, 175, 80)") { // Verde
                setTimeout(() => { statusMessage.style.display = "none"; }, 5000);
            }
        }
    });
});