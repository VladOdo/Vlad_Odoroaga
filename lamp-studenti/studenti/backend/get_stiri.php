<?php
header('Content-Type: application/json');
require_once '../db.php';

try {
    // 1. Luăm știrile
    $stmt = $pdo->query("SELECT id, titlu, imagine_url, rezumat, continut, autor, data_publicare FROM stiri ORDER BY id DESC");
    $stiri = $stmt->fetchAll();

    foreach ($stiri as &$stire) {
        // Formatare Dată Știre
        if (!empty($stire['data_publicare'])) {
            $dt = new DateTime($stire['data_publicare']);
            $stire['data_afisare'] = $dt->format('d.m.Y');
        } else {
            $stire['data_afisare'] = "Recent";
        }
        
        if (empty($stire['continut'])) {
            $stire['continut'] = $stire['rezumat'];
        }

        // --- PRELUARE COMENTARII CU DATĂ ---
        // Acum selectăm și 'data_adaugare'
        $stmt_comm = $pdo->prepare("SELECT nume, comentariu, data_adaugare FROM comentarii WHERE stire_id = ? ORDER BY id DESC");
        $stmt_comm->execute([$stire['id']]);
        $comentarii_raw = $stmt_comm->fetchAll();

        // Formatăm data pentru fiecare comentariu
        foreach($comentarii_raw as &$com) {
            if(!empty($com['data_adaugare'])) {
                $d = new DateTime($com['data_adaugare']);
                $com['data_formata'] = $d->format('d.m.Y H:i'); // Ex: 18.01.2026 14:30
            } else {
                $com['data_formata'] = '';
            }
        }
        
        $stire['comentarii'] = $comentarii_raw;
    }

    echo json_encode(['success' => true, 'stiri' => $stiri]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Eroare SQL: ' . $e->getMessage()]);
}
?>