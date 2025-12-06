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

    // Clopay API Gallery: fetch products and display
    const clopayGallery = document.getElementById('clopay-gallery');
    const galleryLoading = document.getElementById('clopay-gallery-loading');

    if (clopayGallery) {
        fetch('https://www.clopaydoor.com/api/v2/GetProductsList/GetProducts?productType=Residential')
            .then(res => res.json())
            .then(products => {
                galleryLoading.style.display = 'none';
                if (!Array.isArray(products) || products.length === 0) {
                    clopayGallery.innerHTML = '<div class="gallery-error">Unable to load products.</div>';
                    return;
                }

                // Render product cards
                clopayGallery.innerHTML = products.map(product => `
                    <div class="clopay-gallery-item">
                        <img src="${product.ShowcaseImage}" alt="${product.Title}" loading="lazy" />
                        <div class="clopay-gallery-item-content">
                            <h3>${product.Title.replace(/<[^>]*>/g, '')}</h3>
                            <p>${product.ShortDescription}</p>
                            <a href="${product.CanonicalUrl}" target="_blank">View Details →</a>
                        </div>
                    </div>
                `).join('');
            })
            .catch(err => {
                console.error('Gallery fetch error:', err);
                galleryLoading.innerHTML = '<div class="gallery-error">Failed to load gallery. Please try again later.</div>';
            });
    }

    // Anti-bot protection for forms (honeypot + time-check + JS-enabled submit)
    (function() {
        const minSeconds = 5; // minimum seconds required before submit
        const forms = document.querySelectorAll('form.protected-form');
        if (!forms || forms.length === 0) return;

        forms.forEach(form => {
            const hp = form.querySelector('input.honeypot[name="website"]') || form.querySelector('input[name="website"]');
            const formStart = form.querySelector('input[name="formStart"]');
            const submitButtons = form.querySelectorAll('button[type="submit"]');

            // Set start timestamp
            if (formStart) formStart.value = Date.now().toString();

            // Enable submit buttons (they are disabled by default in HTML)
            submitButtons.forEach(btn => btn.disabled = false);

            // On submit: check honeypot and elapsed time
            form.addEventListener('submit', (e) => {
                try {
                    const now = Date.now();
                    const start = formStart ? parseInt(formStart.value, 10) || now : now;
                    const elapsed = (now - start) / 1000;
                    const hpValue = hp ? (hp.value || '').trim() : '';

                    // If honeypot has value or submission is too fast, block
                    if (hpValue !== '' || elapsed < minSeconds) {
                        e.preventDefault();
                        // Friendly message — keep it generic to avoid revealing checks
                        alert('Please complete the form before submitting.');
                        return false;
                    }

                    // Add marker that JS was enabled
                    let jsEnabled = form.querySelector('input[name="jsEnabled"]');
                    if (!jsEnabled) {
                        jsEnabled = document.createElement('input');
                        jsEnabled.type = 'hidden';
                        jsEnabled.name = 'jsEnabled';
                        form.appendChild(jsEnabled);
                    }
                    jsEnabled.value = '1';

                    // If a Turnstile widget exists in the form, require its token
                    const hasTurnstile = !!form.querySelector('.cf-turnstile');
                    if (hasTurnstile) {
                        const tokenField = form.querySelector('textarea[name="cf-turnstile-response"], input[name="cf-turnstile-response"]');
                        const tokenVal = tokenField ? (tokenField.value || '').trim() : '';
                        if (!tokenVal) {
                            e.preventDefault();
                            alert('Please complete the CAPTCHA before submitting.');
                            return false;
                        }
                    }
                } catch (err) {
                    // In case of error, allow submit (fail open) but log
                    console.error('Form protection error:', err);
                }
            });
        });
    })();
});
