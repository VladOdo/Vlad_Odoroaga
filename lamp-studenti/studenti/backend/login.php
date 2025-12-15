<?php
// Pornim sesiunea pentru a putea memora utilizatorul logat pe server
session_start();

// Setăm header-ul pentru a răspunde exclusiv cu JSON către login.js
header('Content-Type: application/json');

// 1. Includem conexiunea la baza de date
if (!file_exists('../db.php')) {
    echo json_encode(['success' => false, 'message' => 'Eroare internă: Nu găsesc fișierul db.php']);
    exit;
}
require_once '../db.php';

// 2. Preluăm datele JSON trimise de login.js
$input = json_decode(file_get_contents('php://input'), true);

$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

// Validare de bază
if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Te rog completează utilizatorul și parola.']);
    exit;
}

try {
    // 3. Căutăm utilizatorul în baza de date
    $stmt = $pdo->prepare("SELECT user_id, username, password, role FROM users WHERE username = :username LIMIT 1");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    // 4. Verificăm parola
    if ($user && $password === $user['password']) {
        
        // --- LOGIN REUȘIT ---
        
        // Salvăm datele în sesiune PHP
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        // Verificăm dacă există un user_id valid înainte de update
        if (!empty($user['user_id'])) {
            $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE user_id = :id");
            $updateStmt->execute(['id' => $user['user_id']]);
        }

        // Trimitem răspunsul pozitiv către JS
        echo json_encode([
            'success' => true,
            'message' => 'Autentificare reușită!',
            'role' => $user['role'],     // Trimitem rolul pentru localStorage
            'username' => $user['username']
        ]);

    } else {
        // --- LOGIN EȘUAT ---
        echo json_encode([
            'success' => false,
            'message' => 'Utilizator sau parolă incorectă.'
        ]);
    }

} catch (Exception $e) {
    // În caz de eroare la baza de date
    echo json_encode([
        'success' => false, 
        'message' => 'Eroare server: ' . $e->getMessage()
    ]);
}
?>