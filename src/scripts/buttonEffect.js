// Button hover effect
export const initButtonEffect = () => {
  console.log('Button effect initialization started');

  // Function to update button effect based on mouse position
  const updateButtonEffect = (event) => {
    const { clientX, clientY, target } = event;

    // Find the closest button or button-like element
    const button = target.closest('button, .lumon-button, .btn, .button');
    if (!button) return;

    const bounds = button.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    button.style.setProperty('--x', x);
    button.style.setProperty('--y', y);

    // Debug
    // console.log(`Mouse position on button: ${x}, ${y}`);
  };

  // Add the back element to all buttons
  const addBackElementToButtons = () => {
    const buttons = document.querySelectorAll('button, .lumon-button, .btn, .button');
    console.log(`Found ${buttons.length} buttons to enhance`);

    let enhancedCount = 0;

    buttons.forEach(button => {
      // Skip if already processed
      if (button.querySelector('.back')) return;

      // Skip buttons inside certain components that might cause issues
      if (button.closest('.cmdk-item') ||
          button.closest('[role="dialog"]') ||
          button.closest('[role="menu"]')) {
        return;
      }

      try {
        // Create the back element
        const back = document.createElement('div');
        back.className = 'back';

        // Create the span inside back
        const span = document.createElement('span');
        back.appendChild(span);

        // Add the back element to the button
        button.appendChild(back);

        // Add event listener
        button.addEventListener('pointermove', updateButtonEffect);

        // Add a data attribute to mark as enhanced
        button.setAttribute('data-button-enhanced', 'true');

        enhancedCount++;
      } catch (error) {
        console.error('Error enhancing button:', error);
      }
    });

    console.log(`Enhanced ${enhancedCount} buttons with hover effect`);
  };

  // Initial setup
  addBackElementToButtons();

  // Also add a global event listener to catch all pointer movements
  document.addEventListener('pointermove', (event) => {
    const target = event.target;
    if (target.closest('[data-button-enhanced="true"]')) {
      updateButtonEffect(event);
    }
  });

  // Set up a MutationObserver to handle dynamically added buttons
  const observer = new MutationObserver(mutations => {
    let shouldUpdate = false;

    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) {
      addBackElementToButtons();
    }
  });

  // Start observing the document body for DOM changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Button effect initialization completed');

  // Clean up function
  return () => {
    observer.disconnect();
    document.removeEventListener('pointermove', updateButtonEffect);

    const buttons = document.querySelectorAll('[data-button-enhanced="true"]');
    buttons.forEach(button => {
      button.removeEventListener('pointermove', updateButtonEffect);
    });

    console.log('Button effect cleaned up');
  };
};
