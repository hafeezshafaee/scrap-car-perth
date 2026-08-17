document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const navToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    if (navToggle && nav) {
        navToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", isOpen);
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =====================================================
       HERO SLIDER
    ===================================================== */

    const slides = document.querySelectorAll(".slide");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const dotsContainer = document.querySelector(".dots");
    const slideCounter = document.getElementById("currentSlide");

    let currentSlide = 0;
    let sliderTimer = null;

    /*
        Create the dots automatically based on
        the number of slides.
    */
    function createDots() {
        if (!dotsContainer) return;

        dotsContainer.innerHTML = "";

        slides.forEach((slide, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "dot";

            if (index === currentSlide) {
                dot.classList.add("active");
            }

            dot.setAttribute(
                "aria-label",
                `Go to slide ${index + 1}`
            );

            dot.addEventListener("click", () => {
                goToSlide(index);
                restartSlider();
            });

            dotsContainer.appendChild(dot);
        });
    }


    function updateDots() {
        if (!dotsContainer) return;

        const dots = dotsContainer.querySelectorAll(".dot");

        dots.forEach((dot, index) => {
            dot.classList.toggle(
                "active",
                index === currentSlide
            );
        });
    }


    function updateCounter() {
        if (!slideCounter) return;

        slideCounter.textContent =
            String(currentSlide + 1).padStart(2, "0");
    }


    function goToSlide(index) {
        if (!slides.length) return;

        /*
            Keep the index inside the slider range.
        */
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        /*
            Remove active from every slide.
        */
        slides.forEach((slide, index) => {
            slide.classList.toggle(
                "active",
                index === currentSlide
            );
        });

        updateDots();
        updateCounter();
    }


    function nextSlide() {
        goToSlide(currentSlide + 1);
    }


    function previousSlide() {
        goToSlide(currentSlide - 1);
    }


    function startSlider() {
        if (slides.length <= 1) return;

        clearInterval(sliderTimer);

        sliderTimer = setInterval(() => {
            nextSlide();
        }, 6000);
    }


    function stopSlider() {
        clearInterval(sliderTimer);
        sliderTimer = null;
    }


    function restartSlider() {
        stopSlider();
        startSlider();
    }


    /*
        Initialize slider
    */
    if (slides.length > 0) {

        createDots();
        goToSlide(0);
        startSlider();


        /*
            NEXT BUTTON
        */

        if (nextButton) {
            nextButton.addEventListener("click", event => {
                event.preventDefault();

                nextSlide();
                restartSlider();
            });
        }


        /*
            PREVIOUS BUTTON
        */

        if (prevButton) {
            prevButton.addEventListener("click", event => {
                event.preventDefault();

                previousSlide();
                restartSlider();
            });
        }


        /*
            Pause slider while mouse is over hero
        */

        const hero = document.querySelector(".hero-slider");

        if (hero) {
            hero.addEventListener("mouseenter", stopSlider);
            hero.addEventListener("mouseleave", startSlider);
        }


        /*
            Keyboard support
        */

        document.addEventListener("keydown", event => {

            if (event.key === "ArrowRight") {
                nextSlide();
                restartSlider();
            }

            if (event.key === "ArrowLeft") {
                previousSlide();
                restartSlider();
            }
        });


        /*
            Swipe support for mobile
        */

        let touchStartX = 0;
        let touchEndX = 0;

        if (hero) {

            hero.addEventListener(
                "touchstart",
                event => {
                    touchStartX =
                        event.changedTouches[0].screenX;
                },
                { passive: true }
            );

            hero.addEventListener(
                "touchend",
                event => {
                    touchEndX =
                        event.changedTouches[0].screenX;

                    const difference =
                        touchStartX - touchEndX;

                    /*
                        Swipe left
                    */
                    if (difference > 50) {
                        nextSlide();
                        restartSlider();
                    }

                    /*
                        Swipe right
                    */
                    if (difference < -50) {
                        previousSlide();
                        restartSlider();
                    }
                },
                { passive: true }
            );
        }
    }


    /* =====================================================
       SCROLL REVEAL ANIMATIONS
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       FORMS
    ===================================================== */

    const forms =
        document.querySelectorAll(
            'form[action*="formspree.io"]'
        );

    forms.forEach(form => {

        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                const submitButton =
                    form.querySelector(".submit-btn");

                const status =
                    form.querySelector(".form-status");

                const originalText =
                    submitButton
                        ? submitButton.innerHTML
                        : "";

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML =
                        "Sending...";
                }

                if (status) {
                    status.textContent = "";
                }

                try {

                    const response =
                        await fetch(
                            form.action,
                            {
                                method: "POST",
                                body: new FormData(form),
                                headers: {
                                    Accept:
                                        "application/json"
                                }
                            }
                        );

                    if (response.ok) {

                        form.reset();

                        if (status) {
                            status.textContent =
                                "Thanks. Your enquiry has been sent.";
                        }

                        showToast(
                            "Enquiry sent successfully."
                        );

                    } else {

                        if (status) {
                            status.textContent =
                                "We could not send the form. Please call 0432 300 785.";
                        }

                        showToast(
                            "Form submission failed."
                        );
                    }

                } catch (error) {

                    console.error(
                        "Form submission error:",
                        error
                    );

                    if (status) {
                        status.textContent =
                            "Network error. Please call 0432 300 785.";
                    }

                    showToast(
                        "Network error."
                    );

                } finally {

                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML =
                            originalText;
                    }

                }

            }
        );

    });


    /* =====================================================
       TOAST NOTIFICATION
    ===================================================== */

    let toastTimer = null;

    function showToast(message) {

        const toast =
            document.getElementById("toast");

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 4000);
    }

});