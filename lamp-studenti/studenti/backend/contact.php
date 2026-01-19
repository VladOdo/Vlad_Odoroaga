<?php
header('Content-Type: application/json');

// Conectare la baza de date
if (!file_exists('../db.php')) {
    echo json_encode(['success' => false, 'message' => 'Eroare internă: db.php lipsă.']);
    exit;
}
require_once '../db.php';

// Preluare date JSON
$input = json_decode(file_get_contents('php://input'), true);

// Validare și curățare
$nume = htmlspecialchars(trim($input['nume'] ?? ''));
$email = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$mesaj = htmlspecialchars(trim($input['mesaj'] ?? ''));

// Verificare câmpuri goale
if (empty($nume) || empty($email) || empty($mesaj)) {
    echo json_encode(['success' => false, 'message' => 'Te rugăm să completezi toate câmpurile corect (inclusiv un email valid).']);
    exit;
}

try {
    // Inserare în baza de date
    $stmt = $pdo->prepare("INSERT INTO mesaje_contact (nume, email, mesaj) VALUES (?, ?, ?)");
    $stmt->execute([$nume, $email, $mesaj]);

    echo json_encode(['success' => true, 'message' => 'Mesajul tău a fost trimis cu succes!']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Eroare la salvare: ' . $e->getMessage()]);
}
?>