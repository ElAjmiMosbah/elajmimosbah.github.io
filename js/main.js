document.addEventListener('DOMContentLoaded', () => {
    // Configuration des animations ScrollReveal
    ScrollReveal().reveal('.hero-content', {
        delay: 200,
        distance: '50px',
        origin: 'left',
        duration: 1000
    });

    ScrollReveal().reveal('.hero-image', {
        delay: 400,
        distance: '50px',
        origin: 'right',
        duration: 1000
    });

    ScrollReveal().reveal('.skills-grid', {
        delay: 200,
        distance: '50px',
        origin: 'bottom',
        duration: 1000
    });

    ScrollReveal().reveal('.service-card', {
        delay: 200,
        interval: 200,
        distance: '50px',
        origin: 'bottom',
        duration: 1000
    });

    // Animation des cercles de compétences
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const circle = item.querySelector('.progress-ring-circle');
        const percentage = item.querySelector('.skill-percentage').dataset.percent;
        
        item.addEventListener('mouseenter', () => {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            
            const offset = circumference - (percentage / 100 * circumference);
            circle.style.strokeDashoffset = offset;
        });
        
        item.addEventListener('mouseleave', () => {
            circle.style.strokeDashoffset = circle.style.strokeDasharray;
        });
    });

    // Animation du bouton au survol
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Ajouter au début du fichier, après DOMContentLoaded
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    // Fonction pour mettre à jour la navigation active
    const updateActiveNav = () => {
        const currentPos = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (currentPos >= sectionTop && currentPos < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    // Écouteur d'événement pour le défilement
    window.addEventListener('scroll', updateActiveNav);

    // Effet de défilement fluide pour les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Ajouter au début du fichier, dans l'événement DOMContentLoaded
    const header = document.querySelector('header');
    let lastScroll = 0;
    let scrollTimeout;

    // Fonction pour gérer l'apparence du header au scroll
    const handleHeaderScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Annuler le timeout précédent
        clearTimeout(scrollTimeout);
        
        // Si on est au tout début de la page
        if (currentScroll <= 0) {
            header.classList.remove('header-scrolled');
            header.classList.remove('header-visible');
            return;
        }
        
        // Si on a scrollé plus bas que la dernière position
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('header-scrolled');
            header.classList.remove('header-visible');
        } else {
            // Si on remonte
            header.classList.add('header-scrolled');
            header.classList.add('header-visible');
        }
        
        lastScroll = currentScroll;

        // Définir un timeout pour masquer le header après 3 secondes d'inactivité
        scrollTimeout = setTimeout(() => {
            if (currentScroll > 100) {
                header.classList.add('header-scrolled');
                header.classList.remove('header-visible');
            }
        }, 3000);
    };

    // Ajouter l'écouteur d'événement pour le scroll
    window.addEventListener('scroll', handleHeaderScroll);

    // Vérifier la position initiale au chargement
    handleHeaderScroll();

    // Gérer le survol du header
    header.addEventListener('mouseenter', () => {
        header.classList.add('header-visible');
    });

    // Optionnel : masquer le header quand la souris le quitte
    header.addEventListener('mouseleave', () => {
        if (window.pageYOffset > 100) {
            handleHeaderScroll();
        }
    });

    // Modifier la gestion du modal dans le code existant
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');

    portfolioLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project');
            const projectDetails = document.getElementById(`${projectId}-details`);
            
            // Cacher tous les contenus de projet
            document.querySelectorAll('.project-details').forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Afficher le contenu du projet sélectionné
            if (projectDetails) {
                projectDetails.style.display = 'block';
            }
            
            modal.style.display = 'block';
        });
    });

    // Ajouter la gestion de la fermeture du modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Fermer le modal en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Gestion des filtres du portfolio
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                // Si le filtre est "all" ou si l'item correspond au filtre
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    // Animation optionnelle pour une transition en douceur
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    // Cache les éléments qui ne correspondent pas au filtre
                    item.style.display = 'none';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                }
            });
        });
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Récupérer le bouton
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Désactiver le bouton et montrer le chargement
            submitButton.disabled = true;
            submitButton.classList.add('loading');

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: new FormData(this),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Succès
                    alert('Message envoyé avec succès !');
                    this.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi du message.');
                }
            } catch (error) {
                alert(error.message);
            } finally {
                // Réactiver le bouton et cacher le chargement
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        });
    }
}); 