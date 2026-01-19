<?php
header('Content-Type: application/json');
require_once '../db.php';

try {
    // Luăm meciurile ordonate cronologic
    $stmt = $pdo->query("SELECT * FROM meciuri ORDER BY data_meci ASC");
    $meciuri = $stmt->fetchAll();

    foreach ($meciuri as &$meci) {
        // Formatăm data: 18 Noiembrie 2025
        $dt = new DateTime($meci['data_meci']);
        
        // Array cu lunile în română pentru a le afișa frumos
        $luni = [
            'January' => 'Ianuarie', 'February' => 'Februarie', 'March' => 'Martie',
            'April' => 'Aprilie', 'May' => 'Mai', 'June' => 'Iunie',
            'July' => 'Iulie', 'August' => 'August', 'September' => 'Septembrie',
            'October' => 'Octombrie', 'November' => 'Noiembrie', 'December' => 'Decembrie'
        ];
        
        $luna = $luni[$dt->format('F')];
        $meci['data_afisare'] = $dt->format('d') . ' ' . $luna . ' ' . $dt->format('Y');

        // Flag pentru JS: e meci trecut sau viitor?
        // Comparăm cu momentul curent
        $meci['e_trecut'] = ($dt < new DateTime());
    }

    echo json_encode(['success' => true, 'meciuri' => $meciuri]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Eroare SQL: ' . $e->getMessage()]);
}
?>