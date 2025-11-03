// js/theme-loader.js

(function () {
    // Verificăm ce temă este salvată în memoria browserului
    const theme = localStorage.getItem('theme');

    if (theme === 'dark') {
        // Dacă e 'dark', adăugăm clasa 'dark-mode' pe tag-ul <html>
        // Facem asta instantaneu pentru a preveni flash-ul
        document.documentElement.classList.add('dark-mode');
    }
})();