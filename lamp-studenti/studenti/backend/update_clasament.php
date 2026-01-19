<?php
// 1. PORNIREA SESIUNII
session_start();

// 2. ASCUNDEREA ERORILOR
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 3. DEFINIREA LIMBAJULUI DE COMUNICARE
header('Content-Type: application/json');

// 4. CONECTAREA LA BAZA DE DATE
require_once '../db.php';

// 5. SECURITATE
// Verificam daca esti admin
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Acces refuzat!']);
    exit; 
}

// 6. PRELUAREA DATELOR
$input = json_decode(file_get_contents('php://input'), true);

// 7. EXTRAGEREA VARIABILELOR
//0->default
$id = $input['id'] ?? 0;         
$mj = $input['mj'] ?? 0;         
$puncte = $input['puncte'] ?? 0; 

// 8. MODIFICAREA ÎN BAZA DE DATE
try {
    $sql = "UPDATE clasament SET meciuri_jucate = ?, puncte = ? WHERE id = ?";
    
    // Prevenire SQL INJECTION
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([$mj, $puncte, $id]);

    // 9. RĂSPUNSUL FINAL
    if ($result) {
        // Dacă totul a mers bine, trimitem "Succes!" înapoi la pagină.
        echo json_encode(['success' => true, 'message' => 'Actualizat!']);
    } else {
        throw new Exception("Eroare la update.");
    }

} catch (Exception $e) {
    // 10. GESTIONAREA ERORILOR
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>