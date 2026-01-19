<?php
// Dezactivăm buffering-ul pentru a vedea erorile imediat
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/plain');

echo "--- Diagnosticare Conexiune Bază de Date ---\n\n";

// 1. Verificăm dacă fișierul db.php există
if (!file_exists('db.php')) {
    die("EROARE: Nu găsesc fișierul db.php în folderul curent!\n");
}

try {
    // Încercăm să includem fișierul de conexiune
    include 'db.php';
    echo "1. Fișierul db.php a fost încărcat cu succes.\n";
} catch (Exception $e) {
    die("EROARE la încărcarea db.php: " . $e->getMessage());
}

try {
    // 2. Verificăm dacă variabila $pdo a fost creată în db.php
    if (!isset($pdo)) {
        throw new Exception("Variabila \$pdo nu a fost găsită. Verifică dacă în db.php ai scris corect \$pdo = new PDO(...);");
    }

    // 3. Testăm conexiunea reală cu o interogare simplă
    $query = $pdo->query("SELECT VERSION() as version");
    $row = $query->fetch();

    echo "2. CONEXIUNE REUȘITĂ!\n";
    echo "3. Versiune MySQL: " . $row['version'] . "\n";
    
    // 4. Verificăm dacă tabelul 'users' există
    $tableCheck = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($tableCheck->rowCount() > 0) {
        echo "4. Tabelul 'users' a fost găsit.\n";
        
        // 5. Verificăm structura tabelului users (numele coloanelor)
        $columns = $pdo->query("DESCRIBE users")->fetchAll(PDO::FETCH_COLUMN);
        echo "5. Coloane găsite în 'users': " . implode(", ", $columns) . "\n";
    } else {
        echo "4. ATENȚIE: Tabelul 'users' NU există în baza de date 'studenti'.\n";
    }

} catch (PDOException $e) {
    echo "2. EROARE DE CONEXIUNE (PDO):\n";
    echo "   Mesaj: " . $e->getMessage() . "\n";
    echo "   Cod eroare: " . $e->getCode() . "\n\n";
    
    echo "VERIFICĂ URMĂTOARELE:\n";
    if (strpos($e->getMessage(), 'getaddrinfo failed') !== false) {
        echo "-> HOST GREȘIT: În db.php trebuie să ai \$host = 'mysql'; (NU localhost).\n";
    } elseif (strpos($e->getMessage(), 'Connection refused') !== false) {
        echo "-> PORT SAU SERVICIU: Verifică dacă containerul 'lamp_mysql' rulează.\n";
    } elseif (strpos($e->getMessage(), 'Access denied') !== false) {
        echo "-> CREDENȚIALE: Username-ul sau parola nu se potrivesc cu cele din docker-compose.yml.\n";
    } elseif (strpos($e->getMessage(), 'could not find driver') !== false) {
        echo "-> EXTENSIE LIPSĂ: Trebuie să rulezi 'docker compose up -d --build' pentru a instala pdo_mysql.\n";
    }
} catch (Exception $e) {
    echo "2. EROARE GENERALĂ: " . $e->getMessage() . "\n";
}
?>