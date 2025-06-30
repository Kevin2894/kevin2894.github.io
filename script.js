// Performance optimalisatie: gebruik requestAnimationFrame voor smooth animations
let animationId;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

// Check of device touch of mouse heeft
const hasTouch = 'ontouchstart' in window;
const hasMouse = matchMedia('(pointer:fine)').matches;

// Custom Cursor alleen voor desktop
if (hasMouse && !hasTouch) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Mouse movement met requestAnimationFrame voor betere performance
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.9;
        cursorY += (mouseY - cursorY) * 0.9;
        
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
        cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;
        
        animationId = requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1.5)`;
            cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px) scale(1.5)`;
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1)`;
            cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px) scale(1)`;
        });
    });
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Smooth Scrolling met performance optimalisatie
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const offset = 80; // navbar height
            const targetPosition = target.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Sluit mobile menu
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    });
});

// Intersection Observer voor scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop met observeren na animatie voor betere performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observeer elementen wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.about-content, .project-card, .skill-category, .contact-content, .education-card');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// Navbar scroll effect met throttling
let scrolling = false;
const navbar = document.querySelector('.navbar');

function handleScroll() {
    if (!scrolling) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(10, 0, 20, 0.95)';
                navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            } else {
                navbar.style.background = 'rgba(10, 0, 20, 0.9)';
                navbar.style.boxShadow = 'none';
            }
            scrolling = false;
        });
        scrolling = true;
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// Typing Effect (alleen voor hero title)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.minHeight = '1.2em'; // Voorkom layout shift
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing na korte delay
    setTimeout(typeWriter, 500);
}

// Lazy parallax effect voor shapes (alleen desktop)
if (hasMouse && !hasTouch) {
    let parallaxScrolling = false;
    const shapes = document.querySelectorAll('.shape');
    
    function parallaxScroll() {
        if (!parallaxScrolling) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                shapes.forEach((shape, index) => {
                    const speed = 0.5 + (index * 0.2);
                    shape.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
                });
                parallaxScrolling = false;
            });
            parallaxScrolling = true;
        }
    }
    
    window.addEventListener('scroll', parallaxScroll, { passive: true });
}

// Active Navigation Link met throttling
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
let navScrolling = false;

function updateActiveLink() {
    if (!navScrolling) {
        window.requestAnimationFrame(() => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
            navScrolling = false;
        });
        navScrolling = true;
    }
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// Project Cards 3D effect (alleen desktop)
if (hasMouse && !hasTouch) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
            
            card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Performance: cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});