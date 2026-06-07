// menu burger
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        // 1. Toggle au clic sur le bouton hamburger
        menuToggle.addEventListener('click', (e) => {
            // e.stopPropagation() empêche ce clic d'être détecté par l'écouteur du document juste en dessous
            e.stopPropagation(); 
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // 2. Fermer le menu si on clique n'importe où ailleurs à l'extérieur
        document.addEventListener('click', (e) => {
            // Si le menu est actif ET que le clic n'est ni sur le menu ni sur le bouton hamburger
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // 3. Fermer le menu automatiquement lors du scroll
        window.addEventListener('scroll', () => {
            if (navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});