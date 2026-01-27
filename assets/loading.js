import { onDocumentLoaded } from '@theme/utilities';

class ComponentLoader extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;
    this.init();
  }

  connectedCallback() {
    this.init();
  }

  init() {
    onDocumentLoaded(() => {
      console.log('Document loaded');
      // Start the animation by adding the active class
      this.addLoadingClass();
    });
  }

  addLoadingClass() {
    // Add the active class to trigger the animation
    this.classList.add('hero-loading--active');
  }

  removeLoadingClass() {
    // Remove the active class to hide the element
    this.classList.remove('hero-loading--active');
  }

  // Start loading animation manually
  start() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.addLoadingClass();

    // Auto complete when animation ends
    setTimeout(() => {
      this.complete();
    }, 2000);
  }

  // Complete loading
  complete() {
    if (!this.isLoading) return;
    this.isLoading = false;
    this.removeLoadingClass();
  }

  // Manual control
  hide() {
    this.complete();
  }
}

// Register the custom element
customElements.define('component-loader', ComponentLoader);

// Create global instance for manual control
const componentLoader = new ComponentLoader();

// Export
if (typeof window !== 'undefined') {
  window.componentLoader = componentLoader;
}