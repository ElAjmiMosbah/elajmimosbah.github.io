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
            const targetId = link.getAttribute('href');
            
            // Vérifier si c'est un lien interne (commence par #)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
            // Si ce n'est pas un lien interne, laisse le comportement par défaut
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

    // Ajouter l'écouteur d'év��nement pour le scroll
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
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            let visibleItems = 0;
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = '';  // Reset display pour la pagination
                    visibleItems++;
                } else {
                    item.style.display = 'none';
                }
            });

            // Réinitialiser la pagination après le filtrage
            currentPage = 1;
            
            // Mettre à jour les boutons de pagination en fonction des éléments visibles
            prevBtn.disabled = true;
            nextBtn.disabled = visibleItems <= itemsPerPage;
            
            // Mettre à jour les numéros de page en fonction des éléments visibles
            const totalPages = Math.ceil(visibleItems / itemsPerPage);
            pageNumbers.innerHTML = '';
            
            if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                    const pageNumber = document.createElement('span');
                    pageNumber.classList.add('page-number');
                    if (i === 1) pageNumber.classList.add('active');
                    pageNumber.textContent = i;
                    pageNumber.addEventListener('click', () => {
                        currentPage = i;
                        showFilteredPage(i, filterValue);
                    });
                    pageNumbers.appendChild(pageNumber);
                }
            }
            
            showFilteredPage(1, filterValue);
        });
    });

    // Nouvelle fonction pour afficher les pages filtrées
    function showFilteredPage(page, filterValue) {
        const filteredItems = filterValue === 'all' 
            ? Array.from(portfolioItems)
            : Array.from(portfolioItems).filter(item => item.classList.contains(filterValue));
            
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        portfolioItems.forEach(item => {
            const isVisible = filterValue === 'all' || item.classList.contains(filterValue);
            const inRange = filteredItems.indexOf(item) >= start && filteredItems.indexOf(item) < end;
            item.classList.toggle('visible', isVisible && inRange);
        });

        // Mettre à jour l'état des boutons
        prevBtn.disabled = page === 1;
        nextBtn.disabled = page >= Math.ceil(filteredItems.length / itemsPerPage);

        // Mettre à jour les numéros de page actifs
        const pageNumbers = document.querySelectorAll('.page-number');
        pageNumbers.forEach(num => {
            num.classList.toggle('active', parseInt(num.textContent) === page);
        });
    }

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

    // Gestion de la pagination du portfolio
    const itemsPerPage = 6;
    const paginationContainer = document.querySelector('.portfolio-pagination');
    const pageNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.pagination-btn.prev');
    const nextBtn = document.querySelector('.pagination-btn.next');
    let currentPage = 1;

    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        portfolioItems.forEach((item, index) => {
            item.classList.toggle('visible', index >= start && index < end);
        });

        // Mettre à jour l'état des boutons
        prevBtn.disabled = page === 1;
        nextBtn.disabled = page >= Math.ceil(portfolioItems.length / itemsPerPage);

        // Mettre à jour les numéros de page
        updatePageNumbers(page);
    }

    function updatePageNumbers(currentPage) {
        const totalPages = Math.ceil(portfolioItems.length / itemsPerPage);
        pageNumbers.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.classList.add('page-number');
            if (i === currentPage) pageNumber.classList.add('active');
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                showPage(currentPage);
            });
            pageNumbers.appendChild(pageNumber);
        }
    }

    // Initialiser la pagination
    if (portfolioItems.length > 0) {
        showPage(1);

        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < Math.ceil(portfolioItems.length / itemsPerPage)) {
                currentPage++;
                showPage(currentPage);
            }
        });
    }

    // Ajouter au début du fichier, dans l'événement DOMContentLoaded
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('nav ul');

    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}); 