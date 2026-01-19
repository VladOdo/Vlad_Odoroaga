<?php
header('Content-Type: application/json');
require_once '../db.php';
// 1. CITIREA DATELOR TRIMISE DE PE SITE
// 'json_decode(..., true)' transformă textul primit într-un tabel (array) PHP pe care îl putem folosi.
$input = json_decode(file_get_contents('php://input'), true);
// 2. EXTRAGEREA ȘI CURĂȚAREA DATELOR
// Luăm ID-ul știrii.
$stire_id = $input['stire_id'] ?? 0;
// Transformă caracterele periculoase (ex: <script>) în text inofensiv.
$nume = htmlspecialchars($input['nume'] ?? '');
$comentariu = htmlspecialchars($input['comentariu'] ?? '');

// 3. VALIDAREA (VERIFICAREA)
// Verificăm dacă vreunul dintre câmpuri este gol.
if (empty($stire_id) || empty($nume) || empty($comentariu)) {
    echo json_encode(['success' => false, 'message' => 'Toate câmpurile sunt obligatorii!']);
    exit;
}
// 4. SALVAREA ÎN BAZA DE DATE
try {
    //prevenim SQL injection
    $stmt = $pdo->prepare("INSERT INTO comentarii (stire_id, nume, comentariu) VALUES (?, ?, ?)");
    $stmt->execute([$stire_id, $nume, $comentariu]);

    echo json_encode(['success' => true, 'message' => 'Comentariu adăugat!']);
} catch (Exception $e) {
     // Dacă a apărut o eroare, programul sare direct aici si trimite mesaj
    echo json_encode(['success' => false, 'message' => 'Eroare SQL: ' . $e->getMessage()]);
}
?>