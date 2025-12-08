document.addEventListener('DOMContentLoaded', () => {
    const radioLuminos = document.getElementById('tema-luminos');
    const radioIntunecat = document.getElementById('tema-intunecat');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        radioIntunecat.checked = true;
    } else {
        radioLuminos.checked = true;
    }
    radioLuminos.addEventListener('change', () => {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    });

    radioIntunecat.addEventListener('change', () => {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    });
});