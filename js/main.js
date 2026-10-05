'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Header Scroll Effect
    // ==========================================
    const header = document.querySelector('.header');
    
    const headerSentinel = document.createElement('div');
    headerSentinel.className = 'header-scroll-sentinel';
    headerSentinel.setAttribute('aria-hidden', 'true');
    document.body.prepend(headerSentinel);

    const headerObserver = new IntersectionObserver(([entry]) => {
        header?.classList.toggle('scrolled', !entry.isIntersecting);
    });
    headerObserver.observe(headerSentinel);

    // ==========================================
    // 2. Hamburger Menu
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;

    const toggleMenu = () => {
        const isActive = hamburger?.classList.toggle('active');
        mobileMenu?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (isActive) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    const closeMenu = () => {
        hamburger?.classList.remove('active');
        mobileMenu?.classList.remove('active');
        body.style.overflow = '';
    };

    hamburger?.addEventListener('click', toggleMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
            // Allow smooth scroll to handle the navigation
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu?.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !hamburger?.contains(e.target)) {
            closeMenu();
        }
    });

    // ==========================================
    // 3. Smooth Scrolling & 6. Active Navigation Highlighting
    // ==========================================
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const headerOffset = 80;

    // Smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for highlighting active section in nav
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNavOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const highlightNavCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const navObserver = new IntersectionObserver(highlightNavCallback, highlightNavOptions);
    sections.forEach(section => navObserver.observe(section));

    // ==========================================
    // 4. Menu Tab Navigation (Speisekarte)
    // ==========================================
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuNavWrapper = document.querySelector('.menu-nav-wrapper');

    const loadCategoryImages = (category) => {
        category?.querySelectorAll('img[data-src]').forEach(image => {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        });
    };

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetCategory = tab.getAttribute('data-category');

            // Remove active class from all tabs and categories
            menuTabs.forEach(t => t.classList.remove('active'));
            menuCategories.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding category
            tab.classList.add('active');
            const activeCategory = document.getElementById(targetCategory);
            activeCategory?.classList.add('active');
            loadCategoryImages(activeCategory);

            // Scroll tab into view within wrapper
            if (menuNavWrapper) {
                const scrollLeft = tab.offsetLeft - (menuNavWrapper.offsetWidth / 2) + (tab.offsetWidth / 2);
                menuNavWrapper.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Default to first tab (vorspeisen) if exists
    if (menuTabs.length > 0) {
        // Ensure default is selected on load
        menuTabs[0].click();
    }

    const menuImages = {
        appetizers: { src: 'assets/images/sen-vorspeisen.jpg', alt: 'Auswahl vietnamesischer Vorspeisen', position: '50% 58%' },
        edamame: { src: 'assets/images/menu-edamame.jpg', alt: 'Edamame mit Meersalz', position: '50% 50%' },
        fries: { src: 'assets/images/menu-pommes-premium.webp', alt: 'Knusprige Pommes frites mit Chili-Mayonnaise', position: '50% 48%' },
        summerRolls: { src: 'assets/images/menu-goi-cuon.jpg', alt: 'Vietnamesische Sommerrollen mit frischen Kräutern', position: '50% 50%' },
        gyoza: { src: 'assets/images/menu-gyoza-premium.webp', alt: 'Fünf goldbraun gebratene Gyoza mit Dip' },
        haCao: { src: 'assets/images/menu-ha-cao-premium.webp', alt: 'Fünf gedämpfte Ha Cao mit Garnelenfüllung' },
        nemRan: { src: 'assets/images/menu-nem-ran-premium.webp', alt: 'Drei knusprige vietnamesische Nem Rán mit Kräutern' },
        chicken: { src: 'assets/images/sen-lemongrass-chicken.jpg', alt: 'Gegrillte Hähnchenbrust mit asiatischen Kräutern', position: '50% 54%' },
        crispyPrawns: { src: 'assets/images/menu-tom-chien-com-premium.webp', alt: 'Knusprige Riesengarnelen im grünen Reismantel' },
        calamari: { src: 'assets/images/menu-muc-chien-premium.webp', alt: 'Knusprige Tintenfischringe mit Dip' },
        seafood: { src: 'assets/images/sen-meeresfruechte.jpg', alt: 'Gegrillte asiatische Meeresfrüchte', position: '50% 54%' },
        salad: { src: 'assets/images/menu-mango-avocado-salad.webp', alt: 'Mango-Avocado-Salat mit Kräutern und Erdnüssen' },
        coconutSoup: { src: 'assets/images/menu-kokos-suppe.webp', alt: 'Cremige Kokos-Suppe mit Pilzen und frischen Kräutern' },
        misoSoup: { src: 'assets/images/menu-miso-suppe-premium.webp', alt: 'Miso-Suppe mit Tofu, Wakame und Frühlingszwiebeln' },
        pho: { src: 'assets/images/sen-pho.jpg', alt: 'Aromatische vietnamesische Phở-Suppe', position: '56% 55%' },
        phoBeef: { src: 'assets/images/menu-pho-rind.jpg', alt: 'Vietnamesische Phở-Suppe mit Rindfleisch und Kräutern', position: '50% 50%' },
        sushi: { src: 'assets/images/sen-sushi-sashimi.jpg', alt: 'Auswahl an Sushi, Nigiri und Sashimi', position: '50% 52%' },
        sushiRoll: { src: 'assets/images/menu-salmon-crunchy.jpg', alt: 'Knusprige Sushi-Rolle mit Lachs und Avocado', position: '50% 50%' },
        sushiMenu: { src: 'assets/images/menu-lachsmenue.jpg', alt: 'Sushi-Menü mit Nigiri, Maki und Inside-Out-Rollen', position: '50% 50%' },
        nigiri: { src: 'assets/images/menu-nigiri-premium.webp', alt: 'Edle Nigiri-Auswahl mit Lachs, Thunfisch, Garnele und Weißfisch' },
        gunkan: { src: 'assets/images/menu-gunkan-premium.webp', alt: 'Gunkan-Sushi mit Lachsrogen, Thunfisch und Lachs' },
        maki: { src: 'assets/images/menu-maki-premium.webp', alt: 'Klassische Maki mit Lachs, Thunfisch, Gurke und Avocado' },
        uramaki: { src: 'assets/images/menu-uramaki-premium.webp', alt: 'Inside-Out Uramaki mit Lachs, Avocado und Gurke' },
        tempuraRoll: { src: 'assets/images/menu-tempura-roll-premium.webp', alt: 'Knusprige Tempura-Rolle mit Garnele und Avocado' },
        tatakiSashimi: { src: 'assets/images/menu-tataki-sashimi-premium.webp', alt: 'Thunfisch-Tataki und frisches Lachs-Sashimi' },
        dessert: { src: 'assets/images/menu-kokos-panna-cotta.jpg', alt: 'Kokos-Panna-Cotta mit Mango und Passionsfrucht', position: '50% 50%' },
        friedBanana: { src: 'assets/images/menu-chuoi-chien.webp', alt: 'Knusprig gebackene Banane mit Kokoseis' },
        cocktails: { src: 'assets/images/sen-cocktails.jpg', alt: 'Auswahl frisch gemixter Cocktails', position: '53% 48%' },
        icedTea: { src: 'assets/images/sen-eistee.jpg', alt: 'Hausgemachte Eistees und alkoholfreie Drinks', position: '52% 48%' },
        beer: { src: 'assets/images/menu-asian-beer.webp', alt: 'Gekühltes asiatisches Bier mit einem Glas Lager' }
    };

    const categoryImages = new Map([
        ['vorspeisen', [menuImages.edamame, menuImages.fries, menuImages.gyoza, menuImages.haCao, menuImages.nemRan, menuImages.summerRolls, menuImages.chicken, menuImages.crispyPrawns, menuImages.calamari, menuImages.seafood, menuImages.appetizers]],
        ['salate', [menuImages.salad]],
        ['suppen', [menuImages.coconutSoup, menuImages.misoSoup]],
        ['pho', [menuImages.pho, menuImages.phoBeef]],
        ['nigiri', [menuImages.nigiri]],
        ['gunkan', [menuImages.gunkan]],
        ['maki', [menuImages.maki]],
        ['inside-out', [menuImages.uramaki]],
        ['uramaki', [menuImages.uramaki]],
        ['tataki-sashimi', [menuImages.tatakiSashimi]],
        ['tempura-rolls', [menuImages.tempuraRoll]],
        ['sushi-menus', [menuImages.sushiMenu, menuImages.sushi]],
        ['nachspeisen', [menuImages.dessert, menuImages.friedBanana]],
        ['cocktails', [menuImages.cocktails]],
        ['alkoholfrei', [menuImages.icedTea, menuImages.cocktails]],
        ['eistees', [menuImages.icedTea]],
        ['bier', [menuImages.beer]]
    ]);

    const dishImages = new Map([
        ['Edamame', menuImages.edamame],
        ['Pommes frites', menuImages.fries],
        ['Gyoza - 5 St.', menuImages.gyoza],
        ['Ha Cao - 5 St.', menuImages.haCao],
        ['Nem Rán - 3 St.', menuImages.nemRan],
        ['Mini-Frühlingsrollen - 8 St.', menuImages.nemRan],
        ['Gỏi Cuốn - 4 St.', menuImages.summerRolls],
        ['Gà Xiên Lá Chanh - 2 St.', menuImages.chicken],
        ['Tôm Chiên Cốm - 3 St.', menuImages.crispyPrawns],
        ['Mực Chiên Giòn - 6 St.', menuImages.calamari],
        ['Gegrillte Meeresfrüchte - 3 St.', menuImages.seafood],
        ['Variante aus Vietnam', menuImages.appetizers],
        ['Mango-Salat', menuImages.salad],
        ['Avocado-Salat', menuImages.salad],
        ['Kokos-Suppe', menuImages.coconutSoup],
        ['Miso-Suppe', menuImages.misoSoup],
        ['Phở Hühnerfleisch', menuImages.pho],
        ['Phở Rindfleisch', menuImages.phoBeef],
        ['Kokos-Panna-Cotta', menuImages.dessert],
        ['Chuối Chiên', menuImages.friedBanana],
        ['Strawberry Colada', menuImages.cocktails],
        ['Guava Passion', menuImages.icedTea],
        ['Lychee Rose Eistee', menuImages.icedTea],
        ['Saigon Bier 0,33 L', menuImages.beer]
    ]);

    document.querySelectorAll('.menu-category').forEach(category => {
        const categoryGallery = categoryImages.get(category.id) || [menuImages.appetizers];

        category.querySelectorAll('.menu-item').forEach((menuItem, itemIndex) => {
            const dishName = menuItem.querySelector('.menu-item-name')?.textContent.trim();
            const dishImage = dishImages.get(dishName) || categoryGallery[itemIndex % categoryGallery.length];

            const media = document.createElement('figure');
            media.className = 'menu-item-media';
            media.style.setProperty('--dish-position', dishImage.position || '50% 50%');

            const image = document.createElement('img');
            image.dataset.src = dishImage.src;
            image.alt = dishImage.alt;
            image.width = 720;
            image.height = 720;
            image.loading = 'lazy';
            image.decoding = 'async';

            media.appendChild(image);
            menuItem.prepend(media);
            menuItem.classList.add('has-dish-image');
            menuItem.style.setProperty('--item-index', itemIndex);
        });
    });

    loadCategoryImages(document.querySelector('.menu-category.active'));

    // ==========================================
    // 5. Scroll Animations (Intersection Observer)
    // ==========================================
    const revealGroups = [
        ['.section-header', 'reveal-section'],
        ['.hours-card, .map-container, .reservation-form', 'reveal-panel'],
        ['.hours-info, .reservation-info, .contact-card', 'reveal-line']
    ];

    revealGroups.forEach(([selector, className]) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add(className);
            element.style.setProperty('--reveal-delay', `${Math.min(index % 3, 2) * 80}ms`);
        });
    });

    const animatedElements = document.querySelectorAll(
        '.fade-in, .fade-in-left, .fade-in-right, .reveal-section, .reveal-panel, .reveal-line'
    );
    
    const animationOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animationCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    };

    const animationObserver = new IntersectionObserver(animationCallback, animationOptions);
    animatedElements.forEach(el => animationObserver.observe(el));

    // ==========================================
    // 7. Reservation Form
    // ==========================================
    const reservationForm = document.getElementById('reservation-form');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = reservationForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
                
                if (field.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                    }
                }
            });

            if (isValid) {
                // Show success message without claiming it was fully submitted
                let successMsg = reservationForm.querySelector('.form-success');
                if (!successMsg) {
                    successMsg = document.createElement('div');
                    successMsg.className = 'form-success';
                    successMsg.style.marginTop = '20px';
                    successMsg.style.padding = '15px';
                    successMsg.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                    // We assume CSS variables exist or standard colors
                    successMsg.style.color = '#4CAF50'; 
                    successMsg.style.border = '1px solid #4CAF50';
                    successMsg.style.borderRadius = '4px';
                    successMsg.style.textAlign = 'center';
                    reservationForm.appendChild(successMsg);
                }
                
                successMsg.textContent = 'Vielen Dank! Ihre Reservierungsanfrage wurde vorbereitet. Bitte kontaktieren Sie uns telefonisch zur Bestätigung.';
                reservationForm.reset();
                
                // Hide message after 8 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 8000);
            }
        });
    }

    // ==========================================
    // 8. Gallery Lightbox
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item img, .gallery-img');
    
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                
                // Lightbox styling
                Object.assign(lightbox.style, {
                    position: 'fixed',
                    inset: '0',
                    zIndex: '2000',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                });

                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt;
                
                // Image styling
                Object.assign(img.style, {
                    maxWidth: '90%',
                    maxHeight: '90vh',
                    objectFit: 'contain'
                });

                const closeBtn = document.createElement('span');
                closeBtn.innerHTML = '&times;';
                
                // Close button styling
                Object.assign(closeBtn.style, {
                    position: 'absolute',
                    top: '20px',
                    right: '30px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '3rem',
                    lineHeight: '1'
                });

                lightbox.appendChild(img);
                lightbox.appendChild(closeBtn);
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';

                const closeLightbox = () => {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                };

                lightbox.addEventListener('click', (e) => {
                    if (e.target !== img) {
                        closeLightbox();
                    }
                });

                // Escape key to close
                document.addEventListener('keydown', function escListener(e) {
                    if (e.key === 'Escape') {
                        closeLightbox();
                        document.removeEventListener('keydown', escListener);
                    }
                });
            });
        });
    }

    // ==========================================
    // 10. Current Year in Footer
    // ==========================================
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================
    // 11. Warenkorb & WhatsApp-Bestellung
    // ==========================================
    const WHATSAPP_NUMBER = '491735467301';
    const CART_STORAGE_KEY = 'sen-restaurant-cart-v1';
    const cartDrawer = document.getElementById('cartDrawer');
    const cartBackdrop = document.getElementById('cartBackdrop');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartCheckout = document.getElementById('cartCheckout');
    const cartTotal = document.getElementById('cartTotal');
    const whatsappOrder = document.getElementById('whatsappOrder');
    const cartToast = document.getElementById('cartToast');
    const cartTriggers = document.querySelectorAll('.cart-trigger');
    const cartClose = document.querySelector('.cart-close');
    const cartBrowse = document.querySelector('.cart-browse');
    const currencyFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    });
    let lastFocusedElement = null;
    let toastTimer = null;

    const readStoredCart = () => {
        try {
            const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
            if (!Array.isArray(storedCart)) return [];

            return storedCart.filter(item => (
                item &&
                typeof item.id === 'string' &&
                typeof item.name === 'string' &&
                Number.isFinite(item.price) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            ));
        } catch (error) {
            localStorage.removeItem(CART_STORAGE_KEY);
            return [];
        }
    };

    let cart = readStoredCart();

    const saveCart = () => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (error) {
            // The cart still works for the current page if storage is unavailable.
        }
    };

    const parsePrice = (value) => {
        if (!value) return null;
        const match = value.match(/(\d+(?:[.,]\d{2}))\s*€/);
        if (!match) return null;
        const parsedPrice = Number.parseFloat(match[1].replace(',', '.'));
        return Number.isFinite(parsedPrice) ? parsedPrice : null;
    };

    const showCartToast = (message) => {
        if (!cartToast) return;
        window.clearTimeout(toastTimer);
        cartToast.textContent = message;
        cartToast.classList.add('is-visible');
        toastTimer = window.setTimeout(() => {
            cartToast.classList.remove('is-visible');
        }, 2200);
    };

    const createQuantityButton = (label, action, itemId, text) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quantity-button';
        button.dataset.cartAction = action;
        button.dataset.itemId = itemId;
        button.setAttribute('aria-label', label);
        button.textContent = text;
        return button;
    };

    const renderCart = () => {
        if (!cartItemsContainer || !cartEmpty || !cartTotal || !whatsappOrder) return;

        cartItemsContainer.replaceChildren();
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        document.querySelectorAll('.cart-count').forEach(count => {
            count.textContent = String(itemCount);
            count.setAttribute('aria-label', `${itemCount} ${itemCount === 1 ? 'Artikel' : 'Artikel'}`);
        });

        cartTotal.textContent = currencyFormatter.format(total);
        cartEmpty.hidden = cart.length > 0;
        whatsappOrder.disabled = cart.length === 0;

        cart.forEach(item => {
            const row = document.createElement('article');
            row.className = 'cart-item';

            const copy = document.createElement('div');
            copy.className = 'cart-item-copy';

            if (item.code) {
                const code = document.createElement('span');
                code.className = 'cart-item-code';
                code.textContent = item.code;
                copy.appendChild(code);
            }

            const name = document.createElement('h3');
            name.className = 'cart-item-name';
            name.textContent = item.name;
            copy.appendChild(name);

            const price = document.createElement('strong');
            price.className = 'cart-item-price';
            price.textContent = currencyFormatter.format(item.price * item.quantity);

            const actions = document.createElement('div');
            actions.className = 'cart-item-actions';

            const quantity = document.createElement('div');
            quantity.className = 'quantity-control';
            quantity.appendChild(createQuantityButton(`${item.name} Menge verringern`, 'decrease', item.id, '−'));

            const quantityValue = document.createElement('span');
            quantityValue.className = 'quantity-value';
            quantityValue.textContent = String(item.quantity);
            quantityValue.setAttribute('aria-label', `Menge ${item.quantity}`);
            quantity.appendChild(quantityValue);
            quantity.appendChild(createQuantityButton(`${item.name} Menge erhöhen`, 'increase', item.id, '+'));

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'cart-remove';
            removeButton.dataset.cartAction = 'remove';
            removeButton.dataset.itemId = item.id;
            removeButton.setAttribute('aria-label', `${item.name} entfernen`);
            removeButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5M14 11v5"/></svg>';

            actions.append(quantity, removeButton);
            row.append(copy, price, actions);
            cartItemsContainer.appendChild(row);
        });

        saveCart();
    };

    const addToCart = (product, button) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = Math.min(existingItem.quantity + 1, 99);
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        renderCart();
        showCartToast(`${product.name} wurde hinzugefügt`);

        document.querySelectorAll('.cart-count').forEach(count => {
            count.classList.remove('is-bumping');
            void count.offsetWidth;
            count.classList.add('is-bumping');
            window.setTimeout(() => count.classList.remove('is-bumping'), 440);
        });

        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Hinzugefügt';
            button.classList.add('added');
            window.setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('added');
            }, 900);
        }
    };

    const createAddButton = (product) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'add-to-cart';
        button.textContent = 'Hinzufügen';
        button.setAttribute('aria-label', `${product.name} für ${currencyFormatter.format(product.price)} hinzufügen`);
        button.addEventListener('click', () => addToCart(product, button));
        return button;
    };

    document.querySelectorAll('.menu-category').forEach(category => {
        const categoryName = category.querySelector('.menu-category-title')?.textContent.trim() || 'Speisekarte';
        const categoryDescription = Array.from(category.children)
            .find(element => element.classList?.contains('menu-category-desc'));
        const sharedPrice = parsePrice(categoryDescription?.textContent || '');

        category.querySelectorAll('.menu-item').forEach((menuItem, itemIndex) => {
            const baseName = menuItem.querySelector('.menu-item-name')?.textContent.trim();
            const itemCode = menuItem.querySelector('.menu-item-number')?.textContent.trim().replace(/\.$/, '') || '';
            if (!baseName) return;

            const variants = menuItem.querySelectorAll('.menu-variant');
            if (variants.length > 0) {
                variants.forEach((variant, variantIndex) => {
                    const variantName = variant.querySelector('.menu-variant-name')?.textContent.trim();
                    const variantPrice = parsePrice(variant.querySelector('.menu-variant-price')?.textContent || '');
                    if (!variantName || variantPrice === null) return;

                    const product = {
                        id: `${category.id}|${itemCode || itemIndex}|${variantIndex}|${variantName}`,
                        code: itemCode ? `${categoryName} · ${itemCode}` : categoryName,
                        name: `${baseName} - ${variantName}`,
                        price: variantPrice
                    };
                    variant.appendChild(createAddButton(product));
                });
                return;
            }

            const itemPrice = parsePrice(menuItem.querySelector('.menu-item-price')?.textContent || '') ?? sharedPrice;
            if (itemPrice === null) return;

            const product = {
                id: `${category.id}|${itemCode || itemIndex}|${baseName}`,
                code: itemCode ? `${categoryName} · ${itemCode}` : categoryName,
                name: baseName,
                price: itemPrice
            };
            const addRow = document.createElement('div');
            addRow.className = 'menu-add-row';
            addRow.appendChild(createAddButton(product));
            menuItem.appendChild(addRow);
        });
    });

    const openCart = () => {
        if (!cartDrawer || !cartBackdrop) return;
        closeMenu();
        lastFocusedElement = document.activeElement;
        cartBackdrop.hidden = false;
        window.requestAnimationFrame(() => {
            cartDrawer.classList.add('is-open');
            cartBackdrop.classList.add('is-open');
        });
        cartDrawer.setAttribute('aria-hidden', 'false');
        cartTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'true'));
        body.classList.add('cart-open');
        window.setTimeout(() => cartClose?.focus(), 100);
    };

    const closeCart = () => {
        if (!cartDrawer || !cartBackdrop) return;
        cartDrawer.classList.remove('is-open');
        cartBackdrop.classList.remove('is-open');
        cartDrawer.setAttribute('aria-hidden', 'true');
        cartTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
        body.classList.remove('cart-open');
        window.setTimeout(() => {
            cartBackdrop.hidden = true;
        }, 350);
        if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
    };

    cartTriggers.forEach(trigger => trigger.addEventListener('click', openCart));
    cartClose?.addEventListener('click', closeCart);
    cartBackdrop?.addEventListener('click', closeCart);
    cartBrowse?.addEventListener('click', () => {
        closeCart();
        window.setTimeout(() => {
            document.getElementById('speisekarte')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    });

    cartItemsContainer?.addEventListener('click', event => {
        const actionButton = event.target.closest('[data-cart-action]');
        if (!actionButton) return;

        const itemIndex = cart.findIndex(item => item.id === actionButton.dataset.itemId);
        if (itemIndex < 0) return;

        const action = actionButton.dataset.cartAction;
        if (action === 'increase') cart[itemIndex].quantity = Math.min(cart[itemIndex].quantity + 1, 99);
        if (action === 'decrease') cart[itemIndex].quantity -= 1;
        if (action === 'remove' || cart[itemIndex].quantity <= 0) cart.splice(itemIndex, 1);
        renderCart();
    });

    document.addEventListener('keydown', event => {
        if (!cartDrawer?.classList.contains('is-open')) return;

        if (event.key === 'Escape') {
            closeCart();
            return;
        }

        if (event.key === 'Tab') {
            const focusableElements = Array.from(cartDrawer.querySelectorAll(
                'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
            )).filter(element => element.offsetParent !== null);
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });

    cartCheckout?.addEventListener('submit', event => {
        event.preventDefault();
        if (cart.length === 0) return;
        if (!cartCheckout.reportValidity()) return;

        const orderName = document.getElementById('orderName')?.value.trim() || '';
        const pickupTime = document.getElementById('pickupTime')?.value || '';
        const orderNote = document.getElementById('orderNote')?.value.trim() || '';
        const now = new Date();
        const pad = value => String(value).padStart(2, '0');
        const orderNumber = `SEN-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderLines = cart.map(item => (
            `${item.quantity}× ${item.code ? `[${item.code}] ` : ''}${item.name} - ${currencyFormatter.format(item.price * item.quantity)}`
        ));
        const messageLines = [
            'NEUE BESTELLUNG - SEN RESTAURANT',
            `Bestellnummer: ${orderNumber}`,
            `Name: ${orderName}`,
            `Abholung: ${pickupTime ? `${pickupTime} Uhr` : 'So schnell wie möglich'}`,
            '',
            ...orderLines,
            '',
            `GESAMTSUMME: ${currencyFormatter.format(total)}`,
            ...(orderNote ? ['', `Hinweis: ${orderNote}`] : []),
            '',
            'Abholung: Lange Straße 51, 77652 Offenburg',
            'Bitte bestätigen Sie die Bestellung und die Abholzeit. Vielen Dank!'
        ];
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageLines.join('\n'))}`;
        const whatsappWindow = window.open(whatsappUrl, '_blank');
        if (whatsappWindow) {
            whatsappWindow.opener = null;
        } else {
            window.location.href = whatsappUrl;
        }
    });

    renderCart();

});
