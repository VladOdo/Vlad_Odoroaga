document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Verificare Admin
    const userRole = localStorage.getItem("userRole");
    if (userRole !== 'admin') {
        window.location.href = "index.html";
        return;
    }

    // 2. LOGICA DE TAB-URI 
    const tabs = document.querySelectorAll('.admin-tab');
    const sections = document.querySelectorAll('.admin-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Dezactivăm tot
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Activăm curentul
            tab.classList.add('active');
            
            // Găsim secțiunea țintă
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');

            // Încărcăm datele specifice doar când dăm click
            if (targetId === 'section-meciuri') {
                incarcaMeciuriAdmin();
            } else if (targetId === 'section-clasament') {
                incarcaClasamentAdmin();
            }
        });
    });

    // 3. LOGICA ADAUGĂ ȘTIRE
    const newsForm = document.getElementById("add-news-form");
    if (newsForm) {
        newsForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const msgBox = document.getElementById("form-message");
            const formData = new FormData(newsForm);
            
            try {
                const response = await fetch('backend/add_news.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                const result = await response.json();
                
                msgBox.textContent = result.message;
                msgBox.className = result.success ? "success" : "error";
                msgBox.classList.remove("hidden");
                
                if (result.success) newsForm.reset();
            } catch (err) {
                console.error(err);
            }
        });
    }
});

// --- FUNCȚII GLOBALE PENTRU ADMIN ---

// A. MECIURI
async function incarcaMeciuriAdmin() {
    const container = document.getElementById('admin-meciuri-list');
    container.innerHTML = "<p>Se actualizează lista...</p>";

    try {
        const response = await fetch('backend/get_meciuri.php');
        const data = await response.json();

        if (data.success) {
            let html = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Meci</th>
                            <th>Scor Gazdă</th>
                            <th>Scor Oaspete</th>
                            <th>Acțiune</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            data.meciuri.forEach(m => {
                // Tratăm valorile null
                const s1 = m.scor_casa !== null ? m.scor_casa : '';
                const s2 = m.scor_oaspeti !== null ? m.scor_oaspeti : '';

                html += `
                    <tr>
                        <td><small>${m.data_afisare}</small></td>
                        <td>${m.echipa_casa} vs ${m.echipa_oaspeti}</td>
                        <td><input type="number" id="sc-${m.id}" value="${s1}" placeholder="-"></td>
                        <td><input type="number" id="so-${m.id}" value="${s2}" placeholder="-"></td>
                        <td>
                            <button class="btn-save" onclick="salveazaMeci(${m.id}, this)">Salvează</button>
                        </td>
                    </tr>`;
            });
            html += `</tbody></table>`;
            container.innerHTML = html;
        }
    } catch (err) {
        container.innerHTML = "<p style='color:red'>Eroare la încărcare. Verifică backend/get_meciuri.php</p>";
    }
}

async function salveazaMeci(id, btn) {
    const scor_casa = document.getElementById(`sc-${id}`).value;
    const scor_oaspeti = document.getElementById(`so-${id}`).value;
    
    const originalText = btn.textContent;
    btn.textContent = "Wait...";
    btn.classList.add("btn-disabled");
    btn.disabled = true;

    try {
        const response = await fetch('backend/update_meci.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id, scor_casa, scor_oaspeti })
        });
        const res = await response.json();
        
        if(res.success) {
            alert("✅ Scor salvat!");
            // Facem input-urile verzi scurt timp
            document.getElementById(`sc-${id}`).style.backgroundColor = "#d4edda";
            document.getElementById(`so-${id}`).style.backgroundColor = "#d4edda";
        } else {
            alert("❌ Eroare: " + res.message);
        }
    } catch (err) {
        alert("Eroare de conexiune.");
    } finally {
        btn.textContent = originalText;
        btn.classList.remove("btn-disabled");
        btn.disabled = false;
    }
}

// B. CLASAMENT
async function incarcaClasamentAdmin() {
    const container = document.getElementById('admin-clasament-list');
    container.innerHTML = "<p>Se actualizează clasamentul...</p>";

    try {
        const response = await fetch('backend/get_clasament.php');
        const data = await response.json();

        if (data.success) {
            // Sortăm alfabetic ca să găsești ușor echipa
            data.clasament.sort((a, b) => a.echipa.localeCompare(b.echipa));

            let html = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Echipa</th>
                            <th>Meciuri (MJ)</th>
                            <th>Puncte</th>
                            <th>Acțiune</th>
                        </tr>
                    </thead>
                    <tbody>`;
            
            data.clasament.forEach(e => {
                html += `
                    <tr>
                        <td style="text-align:left; font-weight:bold;">${e.echipa}</td>
                        <td><input type="number" id="mj-${e.id}" value="${e.meciuri_jucate}"></td>
                        <td><input type="number" id="pct-${e.id}" value="${e.puncte}"></td>
                        <td>
                            <button class="btn-save" onclick="salveazaClasament(${e.id}, this)">Salvează</button>
                        </td>
                    </tr>`;
            });
            html += `</tbody></table>`;
            container.innerHTML = html;
        }
    } catch (err) {
        container.innerHTML = "<p style='color:red'>Eroare la încărcare.</p>";
    }
}

async function salveazaClasament(id, btn) {
    const mj = document.getElementById(`mj-${id}`).value;
    const puncte = document.getElementById(`pct-${id}`).value;

    const originalText = btn.textContent;
    btn.textContent = "...";
    btn.disabled = true;

    try {
        const response = await fetch('backend/update_clasament.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id, mj, puncte })
        });
        const res = await response.json();
        
        if(res.success) {
            alert("✅ Echipa actualizată!");
        } else {
            alert("❌ Eroare: " + res.message);
        }
    } catch (err) {
        alert("Eroare de conexiune.");
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}