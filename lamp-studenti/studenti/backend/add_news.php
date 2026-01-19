<?php
// 1. PORNIREA SESIUNII pt. a sti daca user-ul are dreptul sa vada pagina sau sa adauge stiri
session_start();

// 2. SETAREA FORMATULUI DE RĂSPUNS
header('Content-Type: application/json');

// 3. CONECTAREA LA BAZA DE DATE
require_once '../db.php';

// 4. VERIFICAREA DE SECURITATE 
// Dacă nu e admin, oprim totul aici ('exit') și trimitem un mesaj de eroare.
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Acces interzis! Nu ești admin.']);
    exit; 
}

// 5. CITIREA DATELOR TRIMISE DIN FORMULAR
$input = json_decode(file_get_contents('php://input'), true);

// 6. CURĂȚAREA DATELOR
// Transformă caracterele periculoase (ex: <script>) în text inofensiv.
$titlu    = htmlspecialchars($input['titlu'] ?? '');
$imagine  = htmlspecialchars($input['imagine_url'] ?? '');
$rezumat  = htmlspecialchars($input['rezumat'] ?? '');
$continut = htmlspecialchars($input['continut'] ?? ''); 
$autor    = htmlspecialchars($input['autor'] ?? 'Admin'); 

// 7. VALIDAREA DATELOR
// Verificăm dacă cele mai importante câmpuri sunt completate.
if (empty($titlu) || empty($continut)) {
    echo json_encode(['success' => false, 'message' => 'Titlul și Conținutul sunt obligatorii!']);
    exit;
}

// 8. SALVAREA ÎN BAZA DE DATE
try {
    $sql = "INSERT INTO stiri (titlu, imagine_url, rezumat, continut, autor) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$titlu, $imagine, $rezumat, $continut, $autor]);
    echo json_encode(['success' => true, 'message' => 'Știrea a fost publicată cu succes!']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Eroare SQL: ' . $e->getMessage()]);
}
?>