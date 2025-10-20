// Așteaptă ca tot HTML-ul să fie încărcat înainte de a rula scriptul
document.addEventListener('DOMContentLoaded', () => {

    // Găsim containerele din HTML
    const viitoareContainer = document.getElementById('meciuri-viitoare-container');
    const rezultateContainer = document.getElementById('rezultate-container');

    // Funcția care încarcă datele
    async function incarcaProgram() {
        try {
            // 1. Cere datele din fișierul JSON
            const response = await fetch('program-data.json');

            // Verifică dacă cererea a avut succes
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 2. Transformă răspunsul text în obiect JSON
            const data = await response.json();

            // 3. Afișează datele (injectează HTML)
            afiseazaMeciuriViitoare(data.meciuri_viitoare);
            afiseazaRezultate(data.meciuri_trecute);

        } catch (error) {
            // Gestionează erorile (de ex. fișierul nu e găsit)
            console.error('Nu am putut încărca programul:', error);
            viitoareContainer.innerHTML = '<p>Eroare la încărcarea programului. Încearcă din nou mai târziu.</p>';
            rezultateContainer.innerHTML = ''; // Golește și celălalt container
        }
    }

    // Funcție pentru a genera HTML-ul pentru meciurile viitoare
    function afiseazaMeciuriViitoare(meciuri) {
        // Golește containerul de textul "Se încarcă..."
        viitoareContainer.innerHTML = '';

        if (meciuri.length === 0) {
            viitoareContainer.innerHTML = '<p>Niciun meci programat.</p>';
            return;
        }

        // Creează câte un card/div pentru fiecare meci
        meciuri.forEach(meci => {
            const meciHtml = `
        <div class="meci-card viitor">
          <span class="competitie">${meci.competitie}</span>
          <h4>${meci.echipa_casa} vs. ${meci.echipa_oaspeti}</h4>
          <p class="data-meci">${meci.data}</p>
        </div>
      `;
            // Adaugă HTML-ul generat în container
            viitoareContainer.innerHTML += meciHtml;
        });
    }

    // Funcție pentru a genera HTML-ul pentru rezultate
    function afiseazaRezultate(meciuri) {
        rezultateContainer.innerHTML = '';

        if (meciuri.length === 0) {
            rezultateContainer.innerHTML = '<p>Niciun rezultat recent.</p>';
            return;
        }

        meciuri.forEach(meci => {
            const meciHtml = `
        <div class="meci-card trecut">
          <span class="competitie">${meci.competitie} (${meci.data})</span>
          <h4>
            ${meci.echipa_casa} 
            <strong>${meci.scor_casa} - ${meci.scor_oaspeti}</strong> 
            ${meci.echipa_oaspeti}
          </h4>
        </div>
      `;
            rezultateContainer.innerHTML += meciHtml;
        });
    }

    // Pornește totul!
    incarcaProgram();

});