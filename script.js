import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, limit, startAfter } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOLNZXBDX-wEdZg2wHmOouchY-eBJYUf8",
    authDomain: "charcoal-portfolio.firebaseapp.com",
    projectId: "charcoal-portfolio",
    storageBucket: "charcoal-portfolio.firebasestorage.app",
    messagingSenderId: "536049832564",
    appId: "1:536049832564:web:0ffefe5e36423adcbab721",
    measurementId: "G-HJEM5H4WGG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('section[id], main[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Hero Scroll Parallax Effect ---
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.4}px) scale(1.05)`;
        if (heroContent) heroContent.style.opacity = 1 - (scrolled * 0.003);
    });

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');

    const openLightbox = (imgSrc, captionText) => {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = captionText;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImg.src = '';
            }
        }, 800);
    };

    // --- Dynamic Gallery Render ---
    const masonryGrid = document.getElementById('masonryGrid');

    const createMasonryItem = (id, title, imageUrl) => {
        const item = document.createElement('div');
        item.className = 'masonry-item';
        item.innerHTML = `
            <img src="${imageUrl}" alt="${title}" class="gallery-img">
            <div class="item-overlay">
                <span class="item-title">${title}</span>
            </div>
        `;
        item.addEventListener('click', () => {
            openLightbox(imageUrl, title);
        });
        return item;
    };

    let lastVisible = null;
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const ITEMS_PER_PAGE = 6;

    const loadGallery = async (isLoadMore = false) => {
        try {
            if (!isLoadMore) {
                masonryGrid.innerHTML = '';
            }

            let q;
            if (isLoadMore && lastVisible) {
                q = query(collection(db, "artworks"), orderBy("createdAt", "desc"), startAfter(lastVisible), limit(ITEMS_PER_PAGE));
            } else {
                q = query(collection(db, "artworks"), orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));
            }

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const item = createMasonryItem(doc.id, data.title, data.imageUrl);

                    // Fade-in inline styling
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

                    masonryGrid.appendChild(item);

                    // Trigger reflow for transition
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                });

                if (querySnapshot.docs.length < ITEMS_PER_PAGE) {
                    loadMoreBtn.textContent = 'End of Sanctuary';
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.classList.remove('hidden');
                } else {
                    loadMoreBtn.classList.remove('hidden');
                }
            } else {
                if (isLoadMore) {
                    loadMoreBtn.textContent = 'End of Sanctuary';
                    loadMoreBtn.disabled = true;
                } else {
                    loadMoreBtn.classList.add('hidden');
                }
            }
        } catch (error) {
            console.error("Error loading gallery:", error);
        }
    };

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadGallery(true);
        });
    }

    loadGallery();

    // --- Admin Panel Toggle (Ghost Route #admin) ---
    const adminPanel = document.getElementById('adminPanel');

    const toggleAdminView = () => {
        const isRouteAdmin = window.location.hash === '#admin';
        console.log(`[Router] toggleAdminView called. isRouteAdmin: ${isRouteAdmin}`);

        if (isRouteAdmin) {
            adminPanel.classList.remove('hidden');
            document.body.classList.add('site-blur');
            adminPanel.scrollIntoView({ behavior: 'smooth' });
        } else {
            adminPanel.classList.add('hidden');
            document.body.classList.remove('site-blur');
        }
    };

    // Check on navigation
    window.addEventListener('hashchange', toggleAdminView);
    // Check on initial load
    window.addEventListener('load', toggleAdminView);
    // Fallback: check immediately in case load event already passed
    toggleAdminView();

    // --- Upload Logic ---
    const uploadForm = document.getElementById('uploadForm');
    const uploadOverlay = document.getElementById('uploadOverlay');
    const uploadBtn = document.getElementById('uploadBtn');

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const titleInput = document.getElementById('artTitle').value;
            const fileInput = document.getElementById('artFile').files[0];

            if (!titleInput || !fileInput) return;

            // Show uploading state
            uploadOverlay.classList.add('active');
            uploadBtn.disabled = true;

            try {
                // Upload to storage
                const uniqueFilename = `${Date.now()}_${fileInput.name}`;
                const storageRef = ref(storage, `artworks/${uniqueFilename}`);
                const snapshot = await uploadBytes(storageRef, fileInput);
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Save metadata to Firestore
                const docRef = await addDoc(collection(db, "artworks"), {
                    title: titleInput,
                    imageUrl: downloadURL,
                    createdAt: serverTimestamp()
                });

                // Update UI dynamically
                const newItem = createMasonryItem(docRef.id, titleInput, downloadURL);
                newItem.style.opacity = '0';
                newItem.style.transform = 'translateY(20px)';
                newItem.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                masonryGrid.prepend(newItem);

                requestAnimationFrame(() => {
                    newItem.style.opacity = '1';
                    newItem.style.transform = 'translateY(0)';
                });

                // Reset form
                uploadForm.reset();

            } catch (error) {
                console.error("Error uploading artwork:", error);
                alert("Upload failed. Please check your Firebase rules and internet connection.");
            } finally {
                // Hide uploading state
                uploadOverlay.classList.remove('active');
                uploadBtn.disabled = false;
            }
        });
    }
    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contactForm');
    const contactFeedback = document.getElementById('contactFeedback');
    const contactBtn = document.getElementById('contactBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contactName').value.trim();
            const emailInput = document.getElementById('contactEmail').value.trim();
            const messageInput = document.getElementById('contactMessage').value.trim();

            if (!nameInput || !emailInput || !messageInput) return;

            contactBtn.disabled = true;
            contactBtn.textContent = 'Sending...';

            try {
                await addDoc(collection(db, "inquiries"), {
                    name: nameInput,
                    email: emailInput,
                    message: messageInput,
                    createdAt: serverTimestamp()
                });

                contactForm.reset();
                contactFeedback.classList.remove('hidden');

                // Hide message after a few seconds
                setTimeout(() => {
                    contactFeedback.classList.add('hidden');
                }, 4000);

            } catch (error) {
                console.error("Error sending message:", error);
                alert("Failed to reach the sanctuary. Please try again.");
            } finally {
                contactBtn.disabled = false;
                contactBtn.textContent = 'Send';
            }
        });
    }

    // Close Lightbox Events
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
