document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MENU BURGER MOBILE
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); 
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 2. HEADER DYNAMIQUE AU SCROLL
    // ==========================================
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        // Ajoute la classe 'scrolled' si on descend de plus de 50px
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // On profite de l'événement scroll pour replier le menu mobile s'il est ouvert
        if (navMenu && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ==========================================
    // 3. BOUTON RETOUR EN HAUT FLUIDE
    // ==========================================
    const scrollButton = document.querySelector('.btn-scroll');
    
    if (scrollButton) {
        // On récupère la balise <a> qui entoure ton bouton
        const scrollLink = scrollButton.parentElement; 

        // Apparition du bouton après 300px de scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollButton.classList.add('show');
            } else {
                scrollButton.classList.remove('show');
            }
        });

        // Remontée fluide au clic
        scrollLink.addEventListener('click', (e) => {
            e.preventDefault(); // Annule le saut brusque par défaut du href="#"
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // L'effet de glissement pro
            });
        });
    }

});


// ==========================================
    // 4. LIGHTBOX GALERIE (Zoom sur image)
    // ==========================================
    const galerieImages = document.querySelectorAll('.galerie-item img');

    if (galerieImages.length > 0) {
        // 1. Création de la structure HTML de la Lightbox en JS
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-img" src="" alt="Image en grand">
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        // 2. Ouvrir la Lightbox au clic sur une image
        galerieImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src; // Récupère la source de l'image cliquée
                lightbox.classList.add('active'); // Affiche la lightbox
            });
        });

        // 3. Fermer la Lightbox au clic sur la croix
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        // 4. Fermer la Lightbox au clic dans le vide (sur le fond noir)
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 5. ANIMATIONS D'APPARITION AU SCROLL (Scroll Reveal)
    // ==========================================
    // On cible tous les éléments qui méritent une animation d'entrée
    const elementsToAnimate = document.querySelectorAll('.actu-card, .player-card, .staff-card, .galerie-item, .contact-container, .match-card, .actualité, .palmares-item, .chiffre-item');
    if (elementsToAnimate.length > 0) {
        // On leur ajoute la classe de départ cachée directement en JS
        elementsToAnimate.forEach(el => {
            el.classList.add('reveal-hidden');
        });

        // Configuration de l'observateur
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    
                    // NOUVEAU : Si c'est un compteur, on lance l'animation
                    if (entry.target.classList.contains('chiffre-number')) {
                        animateCounter(entry.target);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null, // Par rapport au viewport (l'écran)
            threshold: 0.1, // Déclenche dès que 10% de l'objet est visible
            rootMargin: "0px 0px -50px 0px" // Se déclenche un poil avant que l'élément soit trop haut
        });

        // On active l'observation sur chaque élément
        elementsToAnimate.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ==========================================
    // 6. ANIMATION COMPTEUR DE CHIFFRES
    // ==========================================
    const animateCounter = (el) => {
        const target = parseInt(el.innerText.replace(/\D/g, '')); // Extrait le nombre du texte (ex: 600+ -> 600)
        let count = 0;
        const duration = 2000; // Durée de l'animation en ms
        const step = target / (duration / 16); // Calcul du pas

        const update = () => {
            count += step;
            if (count < target) {
                el.innerText = Math.floor(count) + (el.innerText.includes('+') ? '+' : '');
                requestAnimationFrame(update);
            } else {
                el.innerText = target + (el.innerText.includes('+') ? '+' : '');
            }
        };
        update();
    };

    // On l'intègre dans notre observateur existant (IntersectionObserver)
    // Dans le callback 'revealCallback' précédent, ajoute cette condition :
    /* if (entry.target.classList.contains('chiffre-number')) {
           animateCounter(entry.target);
       }
    */