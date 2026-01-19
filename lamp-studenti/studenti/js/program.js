document.addEventListener('DOMContentLoaded', () => {
    const viitoareContainer = document.getElementById('meciuri-viitoare-container');
    const rezultateContainer = document.getElementById('rezultate-container');
    const clasamentContainer = document.getElementById('clasament-container');

    // --- 1. ÎNCĂRCARE MECIURI ---
    async function incarcaMeciuri() {
        if (!viitoareContainer || !rezultateContainer) return;

        try {
            const response = await fetch('backend/get_meciuri.php');
            const data = await response.json();

            if (data.success) {
                // Filtrăm meciurile pe baza flag-ului 'e_trecut' calculat de PHP
                const meciuri = data.meciuri;
                
                // Meciurile trecute le inversăm (cele mai recente primele)
                const trecute = meciuri.filter(m => m.e_trecut).reverse();
                
                // Meciurile viitoare rămân în ordinea cronologică
                const viitoare = meciuri.filter(m => !m.e_trecut);

                populeazaLista(viitoare, viitoareContainer, 'viitor');
                populeazaLista(trecute, rezultateContainer, 'trecut');
            } else {
                console.error("Eroare server meciuri:", data.message);
            }
        } catch (error) {
            console.error('Eroare conexiune meciuri:', error);
        }
    }

    function populeazaLista(lista, container, tip) {
        container.innerHTML = ''; 
        
        if (lista.length === 0) {
            container.innerHTML = '<p>Nu există date disponibile.</p>';
            return;
        }

        lista.forEach(meci => {
            // Logica de afișare scor
            let scorDisplay = 'vs';
            // Dacă meciul e trecut sau are scor setat, îl afișăm
            if (meci.scor_casa !== null && meci.scor_oaspeti !== null) {
                scorDisplay = `<strong>${meci.scor_casa} - ${meci.scor_oaspeti}</strong>`;
            }

            const html = `
                <div class="meci-card ${tip}">
                    <span class="competitie">${meci.competitie}</span>
                    <h4>${meci.echipa_casa} ${scorDisplay} ${meci.echipa_oaspeti}</h4>
                    <p class="data-meci">${meci.data_afisare}</p>
                </div>
            `;
            container.innerHTML += html;
        });
    }

    // --- 2. ÎNCĂRCARE CLASAMENT ---
    async function incarcaClasament() {
        if (!clasamentContainer) return;

        try {
            const response = await fetch('backend/get_clasament.php');
            const data = await response.json();

            if (data.success) {
                let html = `
                    <table class="clasament-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th class="team-name">Echipa</th>
                                <th>MJ</th>
                                <th>Pct</th>
                            </tr>
                        </thead>
                        <tbody>`;
                
                // Generăm rândurile tabelului
                data.clasament.forEach((echipa, index) => {

                    const isRapid = echipa.echipa.toLowerCase().includes('rapid');
                    const clasa = isRapid ? 'rapid-highlight' : '';
                    
                    html += `
                        <tr class="${clasa}">
                            <td>${index + 1}</td>
                            <td class="team-name">${echipa.echipa}</td>
                            <td>${echipa.meciuri_jucate}</td>
                            <td><strong>${echipa.puncte}</strong></td>
                        </tr>`;
                });

                html += `</tbody></table>
                         <p class="clasament-meta">(Clasament actualizat)</p>`;
                
                clasamentContainer.innerHTML = html;
            }
        } catch (error) {
            console.error('Eroare conexiune clasament:', error);
            clasamentContainer.innerHTML = '<p>Clasamentul nu este disponibil.</p>';
        }
    }

    incarcaMeciuri();
    incarcaClasament();
});