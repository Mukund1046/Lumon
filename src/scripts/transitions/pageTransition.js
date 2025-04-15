import { Overlay } from './overlay';

// Class to handle page transitions
export class PageTransition {
    constructor() {
        // Create overlay element
        this.overlayEl = document.createElement('div');
        this.overlayEl.className = 'page-transition-overlay';
        document.body.appendChild(this.overlayEl);
        
        // Initialize overlay
        this.overlay = new Overlay(this.overlayEl, {
            rows: 10,
            columns: 16
        });
        
        // Flag to prevent multiple transitions
        this.isAnimating = false;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Add event listeners to all navigation links
        document.querySelectorAll('a[href^="/"]').forEach(link => {
            // Skip links with data-no-transition attribute
            if (link.hasAttribute('data-no-transition')) return;
            
            link.addEventListener('click', this.handleLinkClick.bind(this));
        });
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }
    
    handleLinkClick(e) {
        // Skip if already animating
        if (this.isAnimating) {
            e.preventDefault();
            return;
        }
        
        // Get the target URL
        const href = e.currentTarget.getAttribute('href');
        
        // Skip if it's an external link or has a hash
        if (href.startsWith('http') || href.includes('#')) return;
        
        // Prevent default navigation
        e.preventDefault();
        
        // Start transition
        this.transitionToPage(href);
    }
    
    handlePopState(e) {
        // Handle browser back/forward buttons
        if (this.isAnimating) return;
        
        // Start transition
        this.transitionToPage(window.location.pathname, false);
    }
    
    transitionToPage(url, updateHistory = true) {
        this.isAnimating = true;
        
        // Show overlay with animation
        this.overlay.show({
            transformOrigin: '50% 0%',
            duration: 0.4,
            ease: 'power3.inOut',
            stagger: index => 0.03 * (this.overlay.cells.flat()[index].row + gsap.utils.random(0, 5))
        })
        .then(() => {
            // Update browser history if needed
            if (updateHistory) {
                window.history.pushState({}, '', url);
            }
            
            // Fetch the new page content
            fetch(url)
                .then(response => response.text())
                .then(html => {
                    // Parse the HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // Get the main content
                    const newContent = doc.querySelector('main');
                    const currentContent = document.querySelector('main');
                    
                    // Update the page title
                    document.title = doc.title;
                    
                    // Replace the content
                    if (newContent && currentContent) {
                        currentContent.innerHTML = newContent.innerHTML;
                    }
                    
                    // Hide the overlay
                    this.overlay.hide({
                        transformOrigin: '50% 100%',
                        duration: 0.4,
                        ease: 'power2',
                        stagger: index => 0.03 * (this.overlay.cells.flat()[index].row + gsap.utils.random(0, 5))
                    })
                    .then(() => {
                        // Animation complete
                        this.isAnimating = false;
                        
                        // Dispatch a custom event for page change
                        window.dispatchEvent(new CustomEvent('pageTransitionComplete', {
                            detail: { url }
                        }));
                    });
                })
                .catch(error => {
                    console.error('Error fetching page:', error);
                    // Hide the overlay in case of error
                    this.overlay.hide({
                        transformOrigin: '50% 100%',
                        duration: 0.4,
                        ease: 'power2',
                        stagger: index => 0.03 * (this.overlay.cells.flat()[index].row + gsap.utils.random(0, 5))
                    })
                    .then(() => {
                        this.isAnimating = false;
                        // Navigate normally in case of error
                        window.location.href = url;
                    });
                });
        });
    }
}
