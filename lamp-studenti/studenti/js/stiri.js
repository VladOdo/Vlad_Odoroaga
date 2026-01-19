document.addEventListener('DOMContentLoaded', () => {
    const stiriContainer = document.getElementById('stiri-container');
    if (!stiriContainer) return;

    window.incarcaStiri = async function() {
        try {
            const response = await fetch('backend/get_stiri.php');
            const data = await response.json();
            
            if (data.success) {
                renderStiri(data.stiri);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Eroare:', error);
        }
    };

    function renderStiri(listaStiri) {
        stiriContainer.innerHTML = ''; 

        if (listaStiri.length === 0) {
            stiriContainer.innerHTML = '<p>Nu există știri.</p>';
            return;
        }

        listaStiri.forEach(stire => {
            const imgPath = stire.imagine_url || 'https://placehold.co/250x180/800000/FFFFFF?text=Rapid';
            const contentId = `content-${stire.id}`;

            // Generăm HTML-ul pentru comentarii CU DATĂ
            let comentariiHTML = '';
            if (stire.comentarii && stire.comentarii.length > 0) {
                stire.comentarii.forEach(com => {
                    comentariiHTML += `
                        <div class="comentariu-item">
                            <div class="com-header">
                                <span class="com-nume">${com.nume}</span>
                                <span class="com-data">${com.data_formata}</span>
                            </div>
                            <div class="com-text">${com.comentariu}</div>
                        </div>`;
                });
            } else {
                comentariiHTML = '<p class="no-comm">Fii primul care comentează!</p>';
            }

            const card = `
                <article class="stire-card">
                    <img src="${imgPath}" alt="${stire.titlu}" class="stire-imagine">
                    <div class="stire-continut">
                        <h3>${stire.titlu}</h3>
                        <p class="stire-meta">Publicat: ${stire.data_afisare} | Autor: ${stire.autor || 'Admin'}</p>
                        <p class="stire-rezumat">${stire.rezumat}</p>
                        
                        <div id="${contentId}" class="stire-full-content hidden">
                            <hr>
                            <p>${stire.continut}</p>
                            
                            <div class="zona-comentarii">
                                <h4>Comentarii</h4>
                                <div class="lista-comentarii">
                                    ${comentariiHTML}
                                </div>
                                
                                <form class="form-comentariu" onsubmit="adaugaComentariu(event, ${stire.id})">
                                    <input type="text" name="nume" placeholder="Numele tău" required>
                                    <input type="text" name="comentariu" placeholder="Scrie un comentariu..." required>
                                    <button type="submit">Trimite</button>
                                </form>
                            </div>
                        </div>

                        <button class="stire-link" onclick="toggleStire('${stire.id}', this)">
                            Citește tot & Comentarii
                        </button>
                    </div>
                </article>
            `;
            stiriContainer.innerHTML += card;
        });
    }

    // Funcții globale
    window.toggleStire = function(id, btn) {
        const content = document.getElementById(`content-${id}`);
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            btn.textContent = "Ascunde";
        } else {
            content.classList.add('hidden');
            btn.textContent = "Citește tot & Comentarii";
        }
    };

    window.adaugaComentariu = async function(e, stireId) {
        e.preventDefault();
        const form = e.target;
        const nume = form.nume.value;
        const comentariu = form.comentariu.value;

        try {
            const response = await fetch('backend/add_comment.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ stire_id: stireId, nume, comentariu })
            });
            const data = await response.json();

            if (data.success) {
                await window.incarcaStiri();
                // Redeschidem automat știrea după reload
                setTimeout(() => {
                     const btn = document.querySelector(`button[onclick="toggleStire('${stireId}', this)"]`);
                     if(btn && btn.textContent.includes("Citește")) btn.click();
                }, 100);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    incarcaStiri();
});