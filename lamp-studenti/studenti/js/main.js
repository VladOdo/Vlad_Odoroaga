document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    if (!header) {
        return;
    }

    let lastScrollTop = 0; 
    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 80) {
            header.classList.add("header-hidden");
        } else {
            header.classList.remove("header-hidden");
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});
const topButton = document.getElementById("back-to-top-btn");

if (topButton) {
    window.addEventListener("scroll", () => {
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