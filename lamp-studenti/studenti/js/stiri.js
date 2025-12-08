document.addEventListener('DOMContentLoaded', () => {

    const stiriContainer = document.getElementById('stiri-container');
    if (!stiriContainer) {
        return;
    }

    async function incarcaStiri() {
        try {
            const response = await fetch('stiri-data.json');
            if (!response.ok) {
                throw new Error(`Eroare: Nu găsesc fișierul stiri-data.json`);
            }

            const data = await response.json();
            data.stiri.sort((a, b) => new Date(b.data_iso) - new Date(a.data_iso));

            afiseazaStiri(data.stiri);

        } catch (error) {
            console.error('Eroare la încărcarea știrilor:', error);
            stiriContainer.innerHTML = `<p style="color:red;"><b>Eroare:</b> ${error.message}</p>`;
        }
    }

    function afiseazaStiri(stiri) {
        stiriContainer.innerHTML = '';

        if (!stiri || stiri.length === 0) {
            stiriContainer.innerHTML = '<p>Nicio știre de afișat momentan.</p>';
            return;
        }
        stiri.forEach(stire => {
            const stireHtml = `
                <!-- Acesta este "CHENARUL" (.stire-card) -->
                <article class="stire-card">
                    <img src="${stire.imagine_url}" alt="${stire.titlu}" class="stire-imagine">
                    <div class="stire-continut">
                        <h3>${stire.titlu}</h3>
                        <p class="stire-meta">Publicat pe: ${stire.data_afisare}</p>
                        <p class="stire-rezumat">${stire.rezumat}</p>
                        
                        <!-- Acesta este "BUTONUL" (.stire-link) -->
                        <a href="${stire.link_sursa}" target="_blank" class="stire-link">Citește știrea</a>
                    </div>
                </article>
            `;
            stiriContainer.innerHTML += stireHtml;
        });
    }
    incarcaStiri();
});