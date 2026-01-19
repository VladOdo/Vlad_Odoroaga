document.addEventListener("DOMContentLoaded", () => {
    
    // 1. LOGICA PENTRU HEADER (Antetul care se ascunde)

    // Căutăm elementul <header> în pagină
    const header = document.querySelector("header");
    
    if (!header) {
        return;
    }

    let lastScrollTop = 0; 

    window.addEventListener("scroll", function () {
        
        // Aflăm la câți pixeli de sus suntem acum
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        // VERIFICAREA DIRECȚIEI:
        // 1. Dacă 'scrollTop > lastScrollTop' înseamnă că cifra crește -> Mergem în JOS
        // 2. Dacă 'scrollTop > 80' înseamnă că am trecut de primii 80px (ca să nu dispară imediat)
        if (scrollTop > lastScrollTop && scrollTop > 80) {
            
            // Dacă mergem în jos, ASCUNDEM header-ul
            header.classList.add("header-hidden");
        } else {
            
            // Dacă mergem în SUS (sau suntem la început), ARĂTĂM header-ul
            header.classList.remove("header-hidden");
        }
        
        // Actualizăm "ultima poziție" cu poziția curentă, pentru următoarea verificare
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});

// 2. LOGICA PENTRU BUTONUL Back to Top

const topButton = document.getElementById("back-to-top-btn");

if (topButton) {
    
    // Ascultăm din nou scroll-ul (separat de header, pentru claritate)
    window.addEventListener("scroll", () => {
        
        // Dacă am coborât mai mult de 300 de pixeli...
        if (window.scrollY > 300) {
            topButton.classList.remove("hidden"); 
        } else {
            topButton.classList.add("hidden"); 
        }
    });

    topButton.addEventListener("click", (e) => {
        e.preventDefault(); 
        window.scrollTo({
            top: 0,            
            behavior: "smooth"  
        });
    });
}