// Import the TextSplitter class for handling text splitting.
import { TextSplitter } from './textSplitter.js';

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

// Defines a class to create hover effects on text.
export class TextAnimator {
  constructor(textElement) {
    // Check if the provided element is valid.
    if (!textElement || !(textElement instanceof HTMLElement)) {
      throw new Error('Invalid text element provided.');
    }

    this.textElement = textElement;
    this.originalChars = []; // Store the original characters
    this.splitText();
  }

  splitText() {
    // Split text for animation and store the reference.
    this.splitter = new TextSplitter(this.textElement, {
      splitTypeTypes: 'words, chars'
    });

    // Save the initial state of each character
    this.originalChars = this.splitter.getChars().map(char => char.innerHTML);
  }

  animate() {
    console.log('Animating text:', this.textElement.textContent);

    // Reset any ongoing animations
    this.reset();

    // Query all individual characters in the line for animation.
    const chars = this.splitter.getChars();
    console.log(`Found ${chars.length} characters to animate`);

    if (chars.length === 0) {
      console.warn('No characters found for animation');
      return;
    }

    chars.forEach((char, position) => {
      let initialHTML = char.innerHTML;
      console.log(`Animating char ${position + 1}:`, initialHTML);

      try {
        window.gsap.fromTo(char, {
          opacity: 0
        },
        {
          duration: 0.03,
          onComplete: () => window.gsap.set(char, { innerHTML: initialHTML, delay: 0.1 }),
          repeat: 2,
          repeatRefresh: true,
          repeatDelay: 0.05, // delay between repeats
          delay: (position + 1) * 0.06, // delay between chars
          innerHTML: () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)],
          opacity: 1
        });
      } catch (error) {
        console.error('Error animating character:', error);
      }
    });

    try {
      console.log('Animating background');
      window.gsap.fromTo(this.textElement, {
        '--anim': 0
      },
      {
        duration: 1,
        ease: 'expo',
        '--anim': 1
      });
    } catch (error) {
      console.error('Error animating background:', error);
    }

    console.log('Animation started');
  }

  animateBack() {
    console.log('Animating back:', this.textElement.textContent);

    try {
      window.gsap.killTweensOf(this.textElement); // Ensure no ongoing animations
      window.gsap.to(this.textElement, {
        duration: .6,
        ease: 'power4',
        '--anim': 0
      });
      console.log('Animate back started');
    } catch (error) {
      console.error('Error in animateBack:', error);
    }
  }

  reset() {
    console.log('Resetting animation');

    try {
      // Reset the text to its original state
      const chars = this.splitter.getChars();
      console.log(`Resetting ${chars.length} characters`);

      chars.forEach((char, index) => {
        try {
          window.gsap.killTweensOf(char); // Ensure no ongoing animations
          char.innerHTML = this.originalChars[index];
        } catch (charError) {
          console.error(`Error resetting char ${index}:`, charError);
        }
      });

      window.gsap.killTweensOf(this.textElement);
      window.gsap.set(this.textElement, {'--anim': 0});
      console.log('Reset complete');
    } catch (error) {
      console.error('Error in reset:', error);
    }
  }
}
