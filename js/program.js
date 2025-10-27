document.addEventListener('DOMContentLoaded', () => {

    const viitoareContainer = document.getElementById('meciuri-viitoare-container');
    const rezultateContainer = document.getElementById('rezultate-container');

    async function incarcaProgram() {
        try {
            const response = await fetch('program-data.json');
            if (!response.ok) {
                throw new Error(`Nu găsesc "program-data.json".`);
            }

            const data = await response.json();

            // AICI ESTE MAGIA:
            // 1. Luăm data și ora exactă de ACUM
            const acum = new Date();

            const meciuriViitoare = [];
            const meciuriTrecute = [];

            // 2. Parcurgem TOATĂ lista de meciuri
            data.meciuri.forEach(meci => {
                const dataMeci = new Date(meci.data_iso); // Convertim data din JSON

                // 3. Comparăm data meciului cu data de acum
                if (dataMeci < acum) {
                    meciuriTrecute.push(meci); // Dacă e în trecut, îl punem aici
                } else {
                    meciuriViitoare.push(meci); // Altfel, e în viitor
                }
            });

            // 4. Sortăm listele
            // Meciurile viitoare: de la cel mai apropiat la cel mai îndepărtat
            meciuriViitoare.sort((a, b) => new Date(a.data_iso) - new Date(b.data_iso));

            // Meciurile trecute: de la cel mai RECENT la cel mai vechi
            meciuriTrecute.sort((a, b) => new Date(b.data_iso) - new Date(a.data_iso));

            // 5. Afișăm listele sortate
            afiseazaMeciuriViitoare(meciuriViitoare);
            afiseazaRezultate(meciuriTrecute);

        } catch (error) {
            console.error('Eroare la încărcarea programului:', error);
            viitoareContainer.innerHTML = `<p style="color:red;"><b>Eroare:</b> ${error.message}</p>`;
        }
    }

    // Funcția de afișare meciuri viitoare (folosește 'data_afisare')
    function afiseazaMeciuriViitoare(meciuri) {
        viitoareContainer.innerHTML = '';
        if (!meciuri || meciuri.length === 0) {
            viitoareContainer.innerHTML = '<p>Niciun meci programat.</p>';
            return;
        }

        meciuri.forEach(meci => {
            const meciHtml = `
                <div class="meci-card viitor">
                  <span class="competitie">${meci.competitie}</span>
                  <h4>${meci.echipa_casa} vs. ${meci.echipa_oaspeti}</h4>
                  <p class="data-meci">${meci.data_afisare}</p>
                </div>
            `;
            viitoareContainer.innerHTML += meciHtml;
        });
    }

    // Funcția de afișare rezultate (folosește scorurile)
    function afiseazaRezultate(meciuri) {
        rezultateContainer.innerHTML = '';
        if (!meciuri || meciuri.length === 0) {
            rezultateContainer.innerHTML = '<p>Niciun rezultat recent.</p>';
            return;
        }

        meciuri.forEach(meci => {
            const meciHtml = `
                <div class="meci-card trecut">
                  <span class="competitie">${meci.competitie}</span>
                  <h4>
                    ${meci.echipa_casa} 
                    <strong>${meci.scor_casa} - ${meci.scor_oaspeti}</strong> 
                    ${meci.echipa_oaspeti}
                  </h4>
                  <p class="data-meci">${meci.data_afisare}</p>
                </div>
            `;
            rezultateContainer.innerHTML += meciHtml;
        });
    }

    // Pornește totul!
    incarcaProgram();
});