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
            const acum = new Date();

            const meciuriViitoare = [];
            const meciuriTrecute = [];
            data.meciuri.forEach(meci => {
                const dataMeci = new Date(meci.data_iso); 
                if (dataMeci < acum) {
                    meciuriTrecute.push(meci); 
                } else {
                    meciuriViitoare.push(meci); 
                }
            });
            meciuriViitoare.sort((a, b) => new Date(a.data_iso) - new Date(b.data_iso));
            meciuriTrecute.sort((a, b) => new Date(b.data_iso) - new Date(a.data_iso));

            afiseazaMeciuriViitoare(meciuriViitoare);
            afiseazaRezultate(meciuriTrecute);

        } catch (error) {
            console.error('Eroare la încărcarea programului:', error);
            viitoareContainer.innerHTML = `<p style="color:red;"><b>Eroare:</b> ${error.message}</p>`;
        }
    }

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
    async function incarcaClasament() {
        const container = document.getElementById('clasament-container');
        if (!container) {
            return;
        }

        try {
            const response = await fetch('clasament.json');
            if (!response.ok) {
                throw new Error('Nu am găsit fișierul clasament.json');
            }

            const data = await response.json();
            data.echipe.sort((a, b) => b.pct - a.pct);
            let html = `
                <table class="clasament-table">
                    <thead>
                        <tr>
                            <th>Loc</th>
                            <th class="team-name">Echipa</th>
                            <th>MJ</th>
                            <th>Pct</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            data.echipe.forEach((echipa, index) => {

                let rapidClass = echipa.nume.includes('Rapid') ? ' rapid-highlight' : '';

                html += `
                    <tr class="team-row${rapidClass}">
                        <td>${index + 1}</td> 
                        <td class="team-name">${echipa.nume}</td>
                        <td>${echipa.mj}</td>
                        <td><strong>${echipa.pct}</strong></td>
                    </tr>
                `;
            });
            html += `
                    </tbody>
                </table>
            `;

            container.innerHTML = html;

        } catch (error) {
            console.error('Eroare la încărcarea clasamentului:', error);
            container.innerHTML = '<p>Clasamentul nu este disponibil.</p>';
        }
    }
    incarcaProgram();
    incarcaClasament(); 

});