<?php
header('Content-Type: application/json');
require_once '../db.php';

try {
    // Luăm echipele ordonate DESC după puncte, ASC după meciuri jucate
    $stmt = $pdo->query("SELECT * FROM clasament ORDER BY puncte DESC, meciuri_jucate ASC");
    $clasament = $stmt->fetchAll();

    echo json_encode(['success' => true, 'clasament' => $clasament]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Eroare SQL: ' . $e->getMessage()]);
}
?>