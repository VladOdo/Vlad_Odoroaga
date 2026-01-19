<?php
session_start();
header('Content-Type: application/json');

if (!file_exists('../db.php')) {
    echo json_encode(['success' => false, 'message' => 'Eroare: Nu găsesc db.php']);
    exit;
}
require_once '../db.php';

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Completează toate datele.']);
    exit;
}

try {
    // 1. Căutăm utilizatorul
    $stmt = $pdo->prepare("SELECT user_id, username, password, role FROM users WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // 2. Verificăm parola folosind HASH
    // password_verify ia parola introdusă și o compară cu hash-ul din DB
    if ($user && password_verify($password, $user['password'])) {
        
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = !empty($user['role']) ? $user['role'] : 'user';

        // Actualizăm last_login
        $update = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE user_id = ?");
        $update->execute([$user['user_id']]);

        echo json_encode([
            'success' => true,
            'message' => 'Login OK',
            'role' => $_SESSION['role'],
            'username' => $user['username']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User sau parolă incorectă.']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Eroare SQL: ' . $e->getMessage()]);
}
?>