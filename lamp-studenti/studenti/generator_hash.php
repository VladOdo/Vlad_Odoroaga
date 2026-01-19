<?php
// Script simplu pentru a genera hash-uri
// Accesează-l în browser: http://localhost:8080/generate_hash.php

$parola_mea = 'rapid1923'; // Schimbă aici cu ce parolă vrei
$hash = password_hash($parola_mea, PASSWORD_DEFAULT);

echo "<h3>Generator de Parole Securizate</h3>";
echo "Parola ta: <strong>" . $parola_mea . "</strong><br><br>";
echo "Hash-ul (copiază-l în DB):<br>";
echo "<textarea cols='70' rows='3'>" . $hash . "</textarea>";
?>