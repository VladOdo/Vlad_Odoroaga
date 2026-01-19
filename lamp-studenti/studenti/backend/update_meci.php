<?php
// 1. PORNIREA SESIUNII
session_start();

// 2. ASCUNDEREA ERORILOR
ini_set('display_errors', 0);
error_reporting(E_ALL); 

// 3. DEFINIREA LIMBAJULUI
header('Content-Type: application/json');

// 4. CONECTAREA LA BAZA DE DATE
require_once '../db.php';

// 5. PAZNICUL (Securitatea)
// Verificăm dacă ești logat ca admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Acces refuzat!']);
    exit;
}

// 6. PRELUAREA DATELOR
$input = json_decode(file_get_contents('php://input'), true);

// 7. PREGĂTIREA VARIABILELOR
$id = $input['id'] ?? 0; 
// - Dacă adminul șterge scorul și lasă gol (''), îl transformăm în NULL (adică meci nejucat).
// - Dacă adminul scrie '0', rămâne '0'.
$scor_casa = (isset($input['scor_casa']) && $input['scor_casa'] !== '') ? $input['scor_casa'] : null;
$scor_oaspeti = (isset($input['scor_oaspeti']) && $input['scor_oaspeti'] !== '') ? $input['scor_oaspeti'] : null;

// 8. ACTUALIZAREA ÎN BAZA DE DATE
try {
    $stmt = $pdo->prepare("UPDATE meciuri SET scor_casa = ?, scor_oaspeti = ? WHERE id = ?");
    $result = $stmt->execute([$scor_casa, $scor_oaspeti, $id]);

    if ($result) {
        // Dacă a mers, trimitem mesaj de succes.
        echo json_encode(['success' => true, 'message' => 'Scor salvat!']);
    } else {
        throw new Exception("Nu s-a putut actualiza baza de date.");
    }
} catch (Exception $e) {
    // 9. GESTIONAREA ERORILOR
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>