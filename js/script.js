// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile hamburger toggle for nav
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('#primary-navigation');
    console.log('Nav elements found:', { navToggle, navLinks });

    if (navToggle && navLinks) {
        // Toggle menu when hamburger is clicked
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Hamburger clicked');
            const isOpen = navLinks.classList.toggle('show');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            });
        });

        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Gallery lightbox functionality
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // FAQ functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                
                // Close all other FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    if (item !== faqItem && item.classList.contains('active')) {
                        item.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ item
                faqItem.classList.toggle('active');
            });
        });
    }

    // Filter Functionality
    // dropdown id may be `categoryFilter` (HTML) or `category-filter` (older code); support both
    const categoryFilter = document.getElementById('categoryFilter') || document.getElementById('category-filter');
    const cards = document.querySelectorAll('.card');

    function applyCategoryFilter(value) {
        const selectedCategory = value || 'all';
        cards.forEach(card => {
            const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
            const sel = (selectedCategory || '').toLowerCase();
            if (sel === 'all' || cardCat === sel) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // If the select exists, wire change event
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => applyCategoryFilter(categoryFilter.value));
    }

    // Expose a global function for inline onchange attributes like `onchange="filterGridByDropdown()"`
    window.filterGridByDropdown = function() {
        const el = document.getElementById('categoryFilter') || document.getElementById('category-filter');
        const val = el ? el.value : 'all';
        applyCategoryFilter(val);
    };
});