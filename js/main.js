document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // 2. Sticky Navbar & Active Menu
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Menu Highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 3. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.querySelector('i').classList.remove('ph-x');
            hamburger.querySelector('i').classList.add('ph-list');
        });
    });

    // 4. Number Counters Animation
    const counters = document.querySelectorAll('.counter-number');
    let hasAnimated = false;

    const animateCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    // Use Intersection Observer to trigger counter animation
    const counterSection = document.querySelector('.trust-section');
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        }, { threshold: 0.5 });
        observer.observe(counterSection);
    }

    // Removed Services Carousel/Accordion logic as it's no longer needed


    // 5. Solar Savings Calculator
    const btnCalculate = document.getElementById('btn-calculate');
    const inputBill = document.getElementById('calc-bill');
    const inputType = document.getElementById('calc-property');
    
    if (btnCalculate) {
        btnCalculate.addEventListener('click', () => {
            const billAmount = parseFloat(inputBill.value);
            const propertyType = inputType.value;

            if (isNaN(billAmount) || billAmount < 500) {
                alert("Please enter a valid monthly bill amount (min ₹500).");
                return;
            }

            // Simple Estimation Logic
            // ₹1000 roughly equals ~1kW system in some regions
            let systemSize = (billAmount / 1000).toFixed(1);
            let annualSavings = billAmount * 12;
            let totalSavings = annualSavings * 25; // 25 years
            let paybackPeriod = (systemSize * 60000 / annualSavings).toFixed(1); // Assuming 60k per kW cost

            // Update DOM
            document.getElementById('res-size').innerText = systemSize;
            document.getElementById('res-annual').innerText = annualSavings.toLocaleString('en-IN');
            document.getElementById('res-total').innerText = totalSavings.toLocaleString('en-IN');
            document.getElementById('res-payback').innerText = paybackPeriod;
        });
    }

    // 6. Projects Filter Gallery
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 7. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close others
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // 8. Contact Form Submission
    const leadForm = document.getElementById('lead-form');
    const formMessage = document.getElementById('form-message');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple validation and success simulation
            formMessage.innerText = "Thank you! Your request has been received. Our team will contact you shortly.";
            formMessage.className = "form-message success";
            formMessage.style.display = "block";
            
            leadForm.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = "none";
            }, 5000);
        });
    }

    // 9. Testimonial Auto Slider
    const track = document.getElementById('testimonial-track');
    let slideIndex = 0;
    
    if (track) {
        const totalSlides = document.querySelectorAll('.testimonial-card').length;
        
        setInterval(() => {
            slideIndex++;
            if (window.innerWidth >= 992) {
                if (slideIndex > totalSlides - 3) slideIndex = 0;
            } else if (window.innerWidth >= 768) {
                if (slideIndex > totalSlides - 2) slideIndex = 0;
            } else {
                if (slideIndex > totalSlides - 1) slideIndex = 0;
            }
            
            // Assuming each card takes 100% on mobile, 50% on tablet, 33.3% on desktop + gap
            let cardWidth = document.querySelector('.testimonial-card').offsetWidth;
            let gap = 30; // 30px gap defined in CSS
            track.style.transform = `translateX(-${slideIndex * (cardWidth + gap)}px)`;
        }, 4000);
    }
});
