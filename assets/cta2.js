/* eslint-disable */
// @ts-nocheck
/**
 * CTA2 - Hover Links with Image Following Cursor
 * Direct conversion from Next.js with GSAP
 */

class Cta2HoverEffect {
    constructor(sectionId) {
        this.section = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (!this.section) return;

        this.linksContainer = this.section.querySelector('[data-cta2-links]');
        this.links = this.section.querySelectorAll('[data-cta2-link]');

        this.activeLink = null;
        this.activeImage = null;

        this.init();
    }

    init() {
        if (!this.linksContainer || this.links.length === 0) return;

        this.linksContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.linksContainer.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

        this.links.forEach((link) => {
            link.addEventListener('mouseenter', (e) => this.handleLinkEnter(link, e));
        });
    }

    handleLinkEnter(link, event) {
        // Get the image inside this specific link
        const image = link.querySelector('[data-cta2-image]');
        if (!image) return;

        // Hide previously active image if it exists and is different
        if (this.activeImage && this.activeImage !== image) {
            const previousImage = this.activeImage;
            gsap.killTweensOf(previousImage);
            gsap.to(previousImage, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                    // Only hide if it's not the currently active image
                    if (this.activeImage !== previousImage) {
                        gsap.set(previousImage, { visibility: 'hidden' });
                    }
                }
            });
        }

        // Store active elements
        this.activeLink = link;
        this.activeImage = image;

        // Dim other links
        this.links.forEach((l) => {
            gsap.to(l, {
                opacity: l === link ? 1 : 0.5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        // Kill any ongoing animations on the new image and show it
        gsap.killTweensOf(image);
        gsap.set(image, {
            x: 0,
            y: 0,
            visibility: 'visible'
        });

        gsap.to(image, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    handleMouseMove(event) {
        if (!this.activeImage) return;

        const container = event.currentTarget;
        if (!container) return;

        // Calculate cursor position relative to container center
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;

        // Get offset from center (-1 to 1 range)
        const offsetX = (event.clientX - centerX) / (containerRect.width / 2);
        const offsetY = (event.clientY - centerY) / (containerRect.height / 2);

        // Apply subtle parallax movement (max 30px in any direction)
        const maxMove = 30;
        const moveX = offsetX * maxMove;
        const moveY = offsetY * maxMove;

        gsap.to(this.activeImage, {
            x: moveX,
            y: moveY,
            duration: 0.6,
            ease: 'power2.out'
        });
    }

    handleMouseLeave() {
        // Hide active image if exists
        if (this.activeImage) {
            gsap.to(this.activeImage, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.set(this.activeImage, { visibility: 'hidden' });
                }
            });
        }

        // Fade all links back to full opacity
        gsap.to(this.links, { opacity: 1, duration: 0.3, ease: 'power2.out' });

        // Clear active references
        this.activeLink = null;
        this.activeImage = null;
    }

    destroy() {
        const allImages = this.section.querySelectorAll('[data-cta2-image]');
        gsap.killTweensOf([...this.links, ...allImages]);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCta2);
} else {
    initCta2();
}

function initCta2() {
    const sections = document.querySelectorAll('[data-section-id]');
    sections.forEach(section => {
        const sectionId = section.getAttribute('data-section-id');
        if (section.classList.contains('section-cta2') || section.id.includes('cta2')) {
            new Cta2HoverEffect(sectionId);
        }
    });
}

// Shopify theme editor support
if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (event) {
        const sectionId = event.detail.sectionId;
        new Cta2HoverEffect(sectionId);
    });
}
