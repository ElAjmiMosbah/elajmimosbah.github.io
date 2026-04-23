document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll(".reveal");
    const progressBars = document.querySelectorAll(".skill-progress");
    const navigationLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const projectLinks = document.querySelectorAll(".project-link[data-project]");
    const projectModal = document.querySelector("#projectModal");
    const closeModalButton = document.querySelector(".close-modal");
    const projectDetails = document.querySelectorAll(".project-details");
    const carouselTrack = document.querySelector(".projects-grid");
    const carouselViewport = document.querySelector(".projects-viewport");
    const carouselPrev = document.querySelector(".carousel-prev");
    const carouselNext = document.querySelector(".carousel-next");
    const carouselDots = document.querySelector(".carousel-dots");
    let activeFilter = "all";
    let carouselIndex = 0;
    let carouselTimer;
    const sections = [...navigationLinks]
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");

                if (entry.target.classList.contains("skill-progress")) {
                    entry.target.style.width = entry.target.dataset.width || "0%";
                }

                revealObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.22,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    progressBars.forEach((bar) => revealObserver.observe(bar));

    navigationLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = document.querySelector(link.getAttribute("href"));

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    const setActiveLink = () => {
        const scrollPosition = window.scrollY + 140;

        sections.forEach((section) => {
            const id = section.getAttribute("id");
            const link = document.querySelector(`.nav-menu a[href="#${id}"]`);

            if (!link) {
                return;
            }

            const isActive =
                scrollPosition >= section.offsetTop &&
                scrollPosition < section.offsetTop + section.offsetHeight;

            link.classList.toggle("is-active", isActive);
        });
    };

    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();

    const getVisibleCount = () => {
        if (window.matchMedia("(max-width: 520px)").matches) {
            return 1;
        }

        if (window.matchMedia("(max-width: 760px)").matches) {
            return 2;
        }

        return 3;
    };

    const getActiveCards = () =>
        [...projectCards].filter((card) => activeFilter === "all" || card.dataset.category === activeFilter);

    const loadCardImages = (cards) => {
        cards.forEach((card) => {
            card.querySelectorAll("img[data-src]").forEach((image) => {
                image.src = image.dataset.src;
                image.removeAttribute("data-src");
            });
        });
    };

    const renderCarouselDots = (maxIndex) => {
        if (!carouselDots) {
            return;
        }

        carouselDots.innerHTML = "";

        for (let index = 0; index <= maxIndex; index += 1) {
            const dot = document.createElement("button");
            dot.className = "carousel-dot";
            dot.type = "button";
            dot.setAttribute("aria-label", `Aller au groupe ${index + 1}`);
            dot.addEventListener("click", () => {
                carouselIndex = index;
                updateCarousel();
                restartCarouselTimer();
            });
            carouselDots.appendChild(dot);
        }
    };

    const updateCarousel = () => {
        if (!carouselTrack || !carouselViewport) {
            return;
        }

        const activeCards = getActiveCards();
        const visibleCount = getVisibleCount();
        const maxIndex = Math.max(activeCards.length - visibleCount, 0);
        carouselIndex = Math.min(carouselIndex, maxIndex);

        projectCards.forEach((card) => {
            const isActive = activeCards.includes(card);
            card.classList.toggle("is-hidden", !isActive);
        });

        const cardWidth = activeCards[0]?.getBoundingClientRect().width || 0;
        const gap = Number.parseFloat(getComputedStyle(carouselTrack).gap) || 0;
        const offset = carouselIndex * (cardWidth + gap);

        carouselTrack.style.transform = `translateX(-${offset}px)`;

        renderCarouselDots(maxIndex);
        carouselDots?.querySelectorAll(".carousel-dot").forEach((dot, index) => {
            dot.classList.toggle("active", index === carouselIndex);
        });

        loadCardImages(activeCards.slice(carouselIndex, carouselIndex + visibleCount + 1));
    };

    const moveCarousel = (direction) => {
        const visibleCount = getVisibleCount();
        const maxIndex = Math.max(getActiveCards().length - visibleCount, 0);
        carouselIndex = direction === "next"
            ? (carouselIndex >= maxIndex ? 0 : carouselIndex + 1)
            : (carouselIndex <= 0 ? maxIndex : carouselIndex - 1);
        updateCarousel();
    };

    const restartCarouselTimer = () => {
        window.clearInterval(carouselTimer);
        carouselTimer = window.setInterval(() => moveCarousel("next"), 4500);
    };

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter;
            carouselIndex = 0;

            filterButtons.forEach((item) => item.classList.toggle("active", item === button));
            updateCarousel();
            restartCarouselTimer();
        });
    });

    carouselPrev?.addEventListener("click", () => {
        moveCarousel("prev");
        restartCarouselTimer();
    });

    carouselNext?.addEventListener("click", () => {
        moveCarousel("next");
        restartCarouselTimer();
    });

    window.addEventListener("resize", updateCarousel, { passive: true });
    updateCarousel();
    restartCarouselTimer();

    const closeProjectModal = () => {
        if (!projectModal) {
            return;
        }

        projectModal.classList.remove("is-open");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        projectDetails.forEach((detail) => detail.classList.remove("is-active"));
    };

    projectLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const detail = document.querySelector(`#${link.dataset.project}-details`);

            if (!projectModal || !detail) {
                return;
            }

            projectDetails.forEach((item) => item.classList.remove("is-active"));
            detail.classList.add("is-active");
            detail.querySelectorAll("img[data-src]").forEach((image) => {
                image.src = image.dataset.src;
                image.loading = "lazy";
                image.decoding = "async";
                image.removeAttribute("data-src");
            });
            projectModal.classList.add("is-open");
            projectModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");
        });
    });

    closeModalButton?.addEventListener("click", closeProjectModal);

    projectModal?.addEventListener("click", (event) => {
        if (event.target === projectModal) {
            closeProjectModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeProjectModal();
        }
    });

    document.querySelectorAll(".contact-form").forEach((form) => {
        const status = form.querySelector(".form-status");
        const submitButton = form.querySelector('button[type="submit"]');

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!form.action) {
                return;
            }

            form.classList.add("is-sending");
            submitButton.disabled = true;
            status.textContent = "";
            status.className = "form-status";

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: new FormData(form),
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Formspree error");
                }

                form.reset();
                status.textContent = "Merci pour votre message. Je reviens vers vous rapidement.";
                status.classList.add("is-success");
            } catch (error) {
                status.textContent = "L'envoi a echoue. Vous pouvez reessayer dans quelques instants.";
                status.classList.add("is-error");
            } finally {
                form.classList.remove("is-sending");
                submitButton.disabled = false;
            }
        });
    });
});
