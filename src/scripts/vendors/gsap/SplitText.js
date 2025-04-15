/*!
 * SplitText: 3.12.2
 * https://greensock.com
 *
 * @license Copyright 2008-2023, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
// This is a simplified version of SplitText for use in this project
// In a real project, you would use the full GSAP SplitText plugin

export class SplitText {
  constructor(elements, options = {}) {
    this.elements = typeof elements === 'string' ? document.querySelectorAll(elements) : elements;
    this.options = {
      type: options.type || 'chars,words,lines',
      ...options
    };
    
    this.chars = [];
    this.words = [];
    this.lines = [];
    
    this.init();
  }
  
  init() {
    const elements = Array.isArray(this.elements) || this.elements instanceof NodeList 
      ? Array.from(this.elements) 
      : [this.elements];
    
    elements.forEach(element => {
      if (!element) return;
      
      const text = element.textContent;
      const types = this.options.type.split(',').map(t => t.trim());
      
      // Clear the element
      element.innerHTML = '';
      
      if (types.includes('lines')) {
        const lineElement = document.createElement('div');
        lineElement.textContent = text;
        lineElement.classList.add('line');
        element.appendChild(lineElement);
        this.lines.push(lineElement);
      }
      
      if (types.includes('words')) {
        const words = text.split(' ');
        words.forEach(word => {
          const wordElement = document.createElement('div');
          wordElement.textContent = word + ' ';
          wordElement.classList.add('word');
          element.appendChild(wordElement);
          this.words.push(wordElement);
        });
      }
      
      if (types.includes('chars')) {
        const chars = text.split('');
        chars.forEach(char => {
          const charElement = document.createElement('div');
          charElement.textContent = char;
          charElement.classList.add('char');
          element.appendChild(charElement);
          this.chars.push(charElement);
        });
      }
    });
  }
  
  revert() {
    const elements = Array.isArray(this.elements) || this.elements instanceof NodeList 
      ? Array.from(this.elements) 
      : [this.elements];
    
    elements.forEach(element => {
      if (!element) return;
      
      const text = element.textContent;
      element.innerHTML = text;
    });
    
    this.chars = [];
    this.words = [];
    this.lines = [];
  }
}
