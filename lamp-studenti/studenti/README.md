Rapid FanClub - Manual de Utilizare

Acest proiect este un site web dinamic pentru fanii echipei Rapid București, construit folosind PHP, MySQL și Docker. Include un sistem de administrare pentru știri, meciuri și clasament.

1. Cum pornesc proiectul? (Docker)

Pentru a rula site-ul, ai nevoie de Docker Desktop instalat.

Pasul 1: Deschide Terminalul

Navighează în folderul principal al proiectului (acolo unde se află fișierul docker-compose.yml).

cd /calea/catre/folderul/tau


Pasul 2: Pornește containerele

Execută următoarea comandă pentru a descărca imaginile și a porni serverul:

docker compose up -d --build


(Parametrul --build asigură că orice modificare de configurare este aplicată).

Pasul 3: Verifică starea

Poți verifica dacă totul rulează corect cu comanda:

docker ps


Ar trebui să vezi două containere active: lamp_apache și lamp_mysql.

2. Cum accesez site-ul?

După ce containerele au pornit, deschide browserul preferat (Chrome, Safari, etc.) și accesează:

🌐 Link Site: http://localhost:8080/index.html

Alte link-uri utile:

Login: http://localhost:8080/login.html

Diagnosticare DB: http://localhost:8080/test_db.php (Folosește-l dacă ai probleme de conexiune)

3. Cum folosesc Panoul de Admin?

Site-ul are o secțiune protejată pentru administrator.

Logare ca Admin

Mergi în subsolul paginii (Footer) și apasă pe link-ul mic "Administrare Sistem" (sau intră direct pe /login.html).

Introdu datele de acces (definite în baza de date):

User: vlad (sau userul tău de admin)

Parolă: rapid1923 (sau parola ta)

Funcționalități Admin

Odată logat, va apărea un buton galben "🛠️ Panou Admin" în partea de sus a site-ului. Apasă pe el pentru a accesa panoul de control:

📰 Tab-ul Știri:

Poți scrie un titlu, adăuga un link de imagine și textul știrii.

Apasă "Publică" și știrea va apărea instant pe pagina "Știri".

⚽ Tab-ul Meciuri:

Vezi lista tuturor meciurilor din sezon.

Poți modifica scorul (ex: 2 - 1).

Apasă "Salvează" pe rândul respectiv. Pe site, meciul se va muta automat la "Rezultate Recente" dacă data a trecut.

🏆 Tab-ul Clasament:

Modifică numărul de meciuri jucate (MJ) și Punctele (Pct) pentru orice echipă.

Clasamentul de pe site se va reordona automat în funcție de puncte.

Deconectare

Apasă butonul alb "Ieșire Admin" din dreapta-sus sau din meniul lateral pentru a te deloga.

4. Cum opresc proiectul?

Când ai terminat lucrul, este recomandat să oprești containerele pentru a elibera resursele calculatorului.

În terminal, în folderul proiectului, rulează:

docker compose stop


(Dacă vrei să ștergi și rețelele create, folosește docker compose down).

Structura Folderelor

docker-compose.yml: Configurația serverului.

studenti/: Folderul cu codul sursă.

db.php: Conexiunea la baza de date.

backend/: Scripturile PHP care procesează datele.

js/: Logica site-ului (login, afișare știri, admin).

css/: Stilurile vizuale.