// js/setari.js

document.addEventListener('DOMContentLoaded', () => {
    // Selectăm cele două butoane radio
    const radioLuminos = document.getElementById('tema-luminos');
    const radioIntunecat = document.getElementById('tema-intunecat');

    // 1. Verificăm ce temă este salvată în localStorage
    const currentTheme = localStorage.getItem('theme');

    // Setăm butonul radio corect ca fiind bifat la încărcarea paginii
    if (currentTheme === 'dark') {
        radioIntunecat.checked = true;
    } else {
        radioLuminos.checked = true;
    }

    // 2. Adăugăm un eveniment când se schimbă selecția
    radioLuminos.addEventListener('change', () => {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    });

    radioIntunecat.addEventListener('change', () => {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    });
});