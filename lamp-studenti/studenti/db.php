<?php
$host = 'mysql'; 
$db   = 'studenti';
$user = 'user';
$pass = 'password';
$charset = 'utf8mb4';

// Data Source Name - specificațiile pentru PDO
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// Opțiuni pentru securitate și performanță
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Aruncă erori dacă interogările eșuează
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Returnează rezultatele ca array asociativ
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Folosește prepared statements reale (securitate SQL Injection)
];

try {
    // Crearea obiectului de conexiune $pdo
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Dacă conexiunea eșuează, returnăm un mesaj JSON clar pentru a ajuta la debugging
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => 'Eroare conexiune DB: ' . $e->getMessage()
    ]);
    exit;
}
?>