/**
 * @fileoverview Route Processor for Amazon DSP logistics page
 * Analyzes and reports on routes that are behind schedule
 * @version 1.1.0
 */

(async function () {
  /** @type {Object.<string, Function[]>} Store for cleanup functions */
  const cleanupRegistry = {
    eventListeners: [],
    animations: [],
    observers: [],
    timers: []
  };

  /**
   * Registers a cleanup function for later execution
   * @param {string} type - Type of cleanup ('eventListeners', 'animations', 'observers', 'timers')
   * @param {Function} fn - Cleanup function to register
   */
  const registerCleanup = (type, fn) => {
    if (cleanupRegistry[type]) {
      cleanupRegistry[type].push(fn);
    }
  };

  /**
   * Executes all registered cleanup functions
   */
  const executeCleanup = () => {
    Object.values(cleanupRegistry).forEach(fns => {
      fns.forEach(fn => {
        try {
          fn();
        } catch (error) {
          console.error('Cleanup function failed:', error);
        }
      });
    });
    // Clear all registries after cleanup
    Object.keys(cleanupRegistry).forEach(key => {
      cleanupRegistry[key] = [];
    });
  };

  /**
   * Cached DOM elements to prevent repeated queries
   * @type {Object.<string, Element>}
   */
  const domCache = new Map();

  /**
   * Gets a DOM element, using cache if available
   * @param {string} selector - CSS selector
   * @param {Element} [context=document] - Context element for query
   * @returns {Element} Found element or null
   */
  const getElement = (selector, context = document) => {
    const cacheKey = `${context === document ? 'doc' : context.id || 'ctx'}-${selector}`;
    if (!domCache.has(cacheKey)) {
      domCache.set(cacheKey, context.querySelector(selector));
    }
    return domCache.get(cacheKey);
  };

  /**
   * Gets multiple DOM elements, using cache if available
   * @param {string} selector - CSS selector
   * @param {Element} [context=document] - Context element for query
   * @returns {Element[]} Array of found elements
   */
  const getElements = (selector, context = document) => {
    const cacheKey = `${context === document ? 'doc' : context.id || 'ctx'}-${selector}-all`;
    if (!domCache.has(cacheKey)) {
      domCache.set(cacheKey, [...context.querySelectorAll(selector)]);
    }
    return domCache.get(cacheKey);
  };

  /**
   * Safely executes a function with error boundary
   * @param {Function} fn - Function to execute
   * @param {*} fallbackValue - Value to return if execution fails
   * @param {string} [errorMessage] - Optional error message to log
   * @returns {*} Function result or fallback value
   */
  const withErrorBoundary = async (fn, fallbackValue, errorMessage) => {
    try {
      return await fn();
    } catch (error) {
      console.error(errorMessage || 'Operation failed:', error);
      updateProgress(`Error: ${errorMessage || error.message}`, true);
      return fallbackValue;
    }
  };

  /**
   * Creates and returns the main modal element
   * @returns {HTMLElement} The created modal element
   */
  const createModal = () => {
    const modal = document.createElement("div");
    modal.id = "custom-modal";
    
    // Apply base styles with responsive design
    Object.assign(modal.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) translateZ(0)",
      webkitTransform: "translate(-50%, -50%) translateZ(0)",
      backfaceVisibility: "hidden",
      webkitBackfaceVisibility: "hidden",
      perspective: "1000",
      webkitPerspective: "1000",
      width: "min(90vw, 500px)",  // Responsive width
      minWidth: "320px",          // Minimum width for usability
      minHeight: "400px",         // Minimum height for usability
      maxHeight: "90vh",          // Maximum height constraint
      background: "white",
      border: "none",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.1)",
      padding: "clamp(15px, 3vw, 25px)",  // Responsive padding
      borderRadius: "16px",
      zIndex: "10000",
      textAlign: "center",
      overflowY: "auto",
      willChange: "transform",
      isolation: "isolate",
      cursor: "move",
      resize: "both",             // Make resizable
      overflow: "auto"            // Enable resize overflow
    });

    // Initialize drag and resize state
    let isDragging = false;
    let isResizing = false;
    let currentHandle = null;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;
    let initialWidth = 0;
    let initialHeight = 0;

    const dragStart = (e) => {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

      if (e.target === modal || e.target.closest('[style*="cursor: move"]')) {
        isDragging = true;
      }
    };

    const drag = (e) => {
      if (isDragging) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        requestAnimationFrame(() => {
          const bounds = {
            top: 20,
            bottom: window.innerHeight - modal.offsetHeight - 20,
            left: 20,
            right: window.innerWidth - modal.offsetWidth - 20
          };

          const newY = Math.min(Math.max(currentY, bounds.top - window.innerHeight/2), bounds.bottom - window.innerHeight/2);
          const newX = Math.min(Math.max(currentX, bounds.left - window.innerWidth/2), bounds.right - window.innerWidth/2);

          modal.style.transform = `translate(calc(-50% + ${newX}px), calc(-50% + ${newY}px)) translateZ(0)`;
        });
      }
    };

    const dragEnd = () => {
      isDragging = false;
    };

    // Add resize handles
    const handles = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map(dir => {
      const handle = document.createElement('div');
      handle.className = `resize-handle resize-${dir}`;
      Object.assign(handle.style, {
        position: 'absolute',
        width: dir.includes('e') || dir.includes('w') ? '10px' : '100%',
        height: dir.includes('n') || dir.includes('s') ? '10px' : '100%',
        [dir.includes('n') ? 'top' : dir.includes('s') ? 'bottom' : '']: '0',
        [dir.includes('e') ? 'right' : dir.includes('w') ? 'left' : '']: '0',
        cursor: `${dir}-resize`,
        zIndex: '10001'
      });
      return handle;
    });

    const startResize = (e, handle) => {
      if (e.target !== handle) return;
      isResizing = true;
      currentHandle = handle;
      initialWidth = modal.offsetWidth;
      initialHeight = modal.offsetHeight;
      initialX = e.clientX;
      initialY = e.clientY;
      e.preventDefault();
    };

    const resize = (e) => {
      if (!isResizing) return;
      e.preventDefault();

      requestAnimationFrame(() => {
        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;
        const dir = currentHandle.className.split('-')[2];

        let newWidth = initialWidth;
        let newHeight = initialHeight;
        let newX = xOffset;
        let newY = yOffset;

        if (dir.includes('e')) newWidth = initialWidth + deltaX;
        if (dir.includes('w')) {
          newWidth = initialWidth - deltaX;
          newX += deltaX / 2;
        }
        if (dir.includes('s')) newHeight = initialHeight + deltaY;
        if (dir.includes('n')) {
          newHeight = initialHeight - deltaY;
          newY += deltaY / 2;
        }

        // Apply size constraints
        newWidth = Math.min(Math.max(newWidth, 320), window.innerWidth * 0.9);
        newHeight = Math.min(Math.max(newHeight, 400), window.innerHeight * 0.9);

        modal.style.width = `${newWidth}px`;
        modal.style.height = `${newHeight}px`;
        modal.style.transform = `translate(calc(-50% + ${newX}px), calc(-50% + ${newY}px)) translateZ(0)`;

        // Update inner content layout
        updateInnerLayout();
      });
    };

    const stopResize = () => {
      isResizing = false;
      currentHandle = null;
    };

    // Add drag event listeners
    modal.addEventListener("touchstart", dragStart, { passive: false });
    modal.addEventListener("touchend", dragEnd, { passive: false });
    modal.addEventListener("touchmove", drag, { passive: false });
    modal.addEventListener("mousedown", dragStart);
    modal.addEventListener("mouseup", dragEnd);
    modal.addEventListener("mousemove", drag);

    // Add resize event listeners
    handles.forEach(handle => {
      modal.appendChild(handle);
      handle.addEventListener('mousedown', (e) => startResize(e, handle));
    });

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);

    // Register cleanup for all event listeners
    registerCleanup('eventListeners', () => {
      modal.removeEventListener("touchstart", dragStart);
      modal.removeEventListener("touchend", dragEnd);
      modal.removeEventListener("touchmove", drag);
      modal.removeEventListener("mousedown", dragStart);
      modal.removeEventListener("mouseup", dragEnd);
      modal.removeEventListener("mousemove", drag);
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      handles.forEach(handle => {
        handle.removeEventListener('mousedown', startResize);
      });
    });

    // Function to update inner layout
    const updateInnerLayout = () => {
      const width = modal.offsetWidth;
      const height = modal.offsetHeight;

      // Update grid layout for DSP progress section
      const progressGrid = modal.querySelector('#dsp-progress-section > div:nth-child(2)');
      if (progressGrid) {
        progressGrid.style.gridTemplateColumns = width < 400 ? '1fr' : 'repeat(2, 1fr)';
      }

      // Update route details max height
      const routeDetails = modal.querySelector('#route-details');
      if (routeDetails) {
        routeDetails.style.maxHeight = `${height * 0.6}px`;
      }

      // Update DA dropdowns max height
      const daDropdowns = modal.querySelector('#da-dropdowns');
      if (daDropdowns) {
        daDropdowns.style.maxHeight = `${height * 0.6}px`;
      }
    };

    // Create entrance animation
    const fadeIn = modal.animate([
      { opacity: 0, transform: 'translate(-50%, -60%) translateZ(0)' },
      { opacity: 1, transform: 'translate(-50%, -50%) translateZ(0)' }
    ], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    });

    registerCleanup('animations', () => fadeIn.cancel());

    modal.innerHTML = `
      <button id="close-btn" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 18px; cursor: pointer; color: #666; transition: color 0.2s ease;">✖</button>
      <div style="margin-bottom: 25px; cursor: move;">
        <img src="https://crdrdispatch.github.io/GembaScript/Logo.svg" alt="Logo" style="height: 90px; display: block; margin: 0 auto; -webkit-transform: translateZ(0); transform: translateZ(0); pointer-events: none;">
      </div>
      <h2 style="font-family: Arial, sans-serif; margin-bottom: 25px; border-bottom: 2px solid #eee; padding-bottom: 15px; color: #2c3e50; font-size: 24px;">Gimme That GEMBA</h2>
      <div id="progress-section" style="margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin: 0; font-weight: 600;">Progress</h3>
            <span id="progress-status" style="display: none; font-size: 12px; padding: 3px 10px; border-radius: 20px; background-color: #4CAF50; color: white; font-weight: 500; box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);">Complete</span>
          </div>
          <button id="toggle-progress" style="background: none; border: none; color: #666; cursor: pointer; font-size: 14px; padding: 5px 10px; border-radius: 5px; transition: background-color 0.2s ease;">Hide</button>
        </div>
        <div id="progress-details" style="font-family: Arial, sans-serif; text-align: left; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 12px; border: 1px solid #edf2f7;">
          <p>Initializing...</p>
        </div>
      </div>
      <div id="da-selection-section" style="display: none; margin-bottom: 30px;">
        <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin-bottom: 12px; font-weight: 600;">These routes have multiple DAs. Please select the DA assigned to the route.</h3>
        <div id="da-dropdowns" style="max-height: 400px; overflow-y: auto; padding: 15px; background: #f8f9fa; border-radius: 12px; border: 1px solid #edf2f7;">
        </div>
        <div style="margin-top: 20px; text-align: right;">
          <button id="da-next-btn" style="padding: 12px 30px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Next</button>
        </div>
      </div>
      <div id="preview-section" style="display: none; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <button id="back-btn" style="padding: 8px 16px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2); transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 18px;">←</span> Back
          </button>
          <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin: 0; font-weight: 600;">Route Details</h3>
          <div style="width: 80px;"></div>
        </div>
        <div id="route-details" style="max-height: 400px; overflow-y: auto; padding: 15px; background: #f8f9fa; border-radius: 12px; border: 1px solid #edf2f7; scrollbar-width: thin; scrollbar-color: #cbd5e0 #f8f9fa;">
        </div>
        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
          <button id="preview-next-btn" style="padding: 12px 30px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Next</button>
        </div>
      </div>
      <div id="dsp-progress-section" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <button id="progress-back-btn" style="padding: 8px 16px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2); transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 18px;">←</span> Back
          </button>
          <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin: 0; font-weight: 600;">DSP Total Progress</h3>
          <div style="width: 80px;"></div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
          <div class="input-group">
            <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">In Progress:</label>
            <input type="number" id="in-progress-input" class="progress-input" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;" min="0">
          </div>
          <div class="input-group">
            <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">At Risk:</label>
            <input type="number" id="at-risk-input" class="progress-input" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;" min="0">
          </div>
          <div class="input-group">
            <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">Behind:</label>
            <input type="number" id="behind-input" class="progress-input" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;" min="0">
          </div>
          <div class="input-group">
            <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">Package Progress:</label>
            <input type="number" id="package-progress-input" class="progress-input" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;" min="0" max="100">
          </div>
        </div>
        <div style="text-align: center;">
          <button id="download-btn" style="padding: 12px 30px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px;">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196667 15.0217 0.001333 14.5507 0 14V11H2V14H14V11H16V14C16 14.55 15.8043 15.021 15.413 15.413C15.0217 15.805 14.5507 16 14 16H2Z" fill="white"/>
            </svg>
            Download File
          </button>
        </div>
      </div>
    `;

    // Add hover effects and event listeners
    const closeBtn = getElement("#close-btn", modal);
    const modalToggleBtn = getElement("#toggle-progress", modal);
    const progressDetails = getElement("#progress-details", modal);
    const nextButtons = getElements("#da-next-btn, #preview-next-btn", modal);

    // Register hover effects with cleanup
    const addHoverEffect = (element, enterStyles, leaveStyles) => {
      const mouseenter = () => Object.assign(element.style, enterStyles);
      const mouseleave = () => Object.assign(element.style, leaveStyles);
      
      element.addEventListener("mouseenter", mouseenter);
      element.addEventListener("mouseleave", mouseleave);
      
      registerCleanup('eventListeners', () => {
        element.removeEventListener("mouseenter", mouseenter);
        element.removeEventListener("mouseleave", mouseleave);
      });
    };

    // Add hover effects
    addHoverEffect(closeBtn, 
      { color: "#ff4444" }, 
      { color: "#666" }
    );

    addHoverEffect(modalToggleBtn,
      { backgroundColor: "#f0f0f0" },
      { backgroundColor: "transparent" }
    );

    nextButtons.forEach(btn => {
      addHoverEffect(btn,
        { 
          backgroundColor: "#45a049",
          boxShadow: "0 6px 8px rgba(76, 175, 80, 0.3)"
        },
        {
          backgroundColor: "#4CAF50",
          boxShadow: "0 4px 6px rgba(76, 175, 80, 0.2)"
        }
      );
    });

    // Add download button hover effect
    const downloadBtn = getElement("#download-btn", modal);
    addHoverEffect(downloadBtn,
      { 
        backgroundColor: "#45a049",
        boxShadow: "0 6px 8px rgba(76, 175, 80, 0.3)"
      },
      {
        backgroundColor: "#4CAF50",
        boxShadow: "0 4px 6px rgba(76, 175, 80, 0.2)"
      }
    );

    // Add toggle functionality
    modalToggleBtn.addEventListener("click", () => {
      if (progressDetails.style.display === "none") {
        progressDetails.style.display = "block";
        modalToggleBtn.textContent = "Hide";
      } else {
        progressDetails.style.display = "none";
        modalToggleBtn.textContent = "Show";
      }
    });

    registerCleanup('eventListeners', () => {
      modalToggleBtn.removeEventListener("click", toggleProgress);
    });

    // Navigation handlers
    const backBtn = getElement("#back-btn", modal);
    const progressBackBtn = getElement("#progress-back-btn", modal);
    const daSelectionSection = getElement("#da-selection-section", modal);
    const previewSection = getElement("#preview-section", modal);
    const dspProgressSection = getElement("#dsp-progress-section", modal);

    backBtn?.addEventListener("click", () => {
      previewSection.style.display = "none";
      daSelectionSection.style.display = "block";
    });

    progressBackBtn?.addEventListener("click", () => {
      dspProgressSection.style.display = "none";
      previewSection.style.display = "block";
    });

    registerCleanup('eventListeners', () => {
      backBtn?.removeEventListener("click", () => {});
      progressBackBtn?.removeEventListener("click", () => {});
    });

    // Add input validation for DSP progress
    const progressInputs = modal.querySelectorAll('.progress-input');
    progressInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        const min = parseInt(e.target.min);
        const max = parseInt(e.target.max) || Infinity;
        
        if (isNaN(value)) {
          e.target.value = min;
        } else {
          e.target.value = Math.min(Math.max(value, min), max);
        }
      });

      // Register cleanup
      registerCleanup('eventListeners', () => {
        input.removeEventListener('input', null);
      });
    });

    // Enhanced download functionality with proper format and time rounding
    downloadBtn.onclick = () => {
      try {
        updateProgress("Preparing download...", true);
        
        // Round current time to nearest hour
        const now = new Date('2024-12-08T14:05:46-08:00'); // Using provided time
        const minutes = now.getMinutes();
        if (minutes >= 30) {
          now.setHours(now.getHours() + 1);
        }
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        // Format date and time
        const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear().toString().substr(-2)}`;
        const hour = now.getHours();
        const roundedHour = hour >= 12 ? `${hour === 12 ? 12 : hour - 12}PM` : `${hour === 0 ? 12 : hour}AM`;

        // Get values from input fields with fallbacks
        const inProgress = getElement("#in-progress-input").value || '0';
        const atRisk = getElement("#at-risk-input").value || '0';
        const behind = getElement("#behind-input").value || '0';
        const packageProgress = getElement("#package-progress-input").value || '0';

        // Create header in markdown format
        const header = `/md\n@\n## CRDR UPDATE - ${formattedDate} ${roundedHour}\n\n` +
                      `**IN PROGRESS: ${inProgress.toString().padStart(2, '0')}**\n` +
                      `**AT RISK: ${atRisk.toString().padStart(2, '0')}**\n` +
                      `**BEHIND: ${behind.toString().padStart(2, '0')}**\n` +
                      `**PACKAGE PROGRESS: ${packageProgress}%**\n\n` +
                      `---\n\n`;

        // Get route details in the correct format
        const routeContent = Array.from(getElements("#route-details > div")).map(container => {
          const routeHeader = container.querySelector("h4");
          const routeInfo = routeHeader.querySelector("span").textContent.split(":");
          const routeCode = routeInfo[0].trim();
          const associateInfo = routeInfo[1].trim();
          const progress = routeHeader.lastElementChild.textContent;
          
          // Get selected root causes
          const checkedBoxes = container.querySelectorAll('input[type="checkbox"]:checked');
          const rootCauses = Array.from(checkedBoxes)
            .map(checkbox => {
              if (checkbox.classList.contains('other-checkbox') && checkbox.checked) {
                const otherInput = container.querySelector('.other-input');
                return otherInput && otherInput.value.trim() || 'Other (unspecified)';
              }
              return checkbox.value;
            })
            .filter(Boolean);
          
          const rc = rootCauses.length > 0 ? rootCauses.join(', ') : 'N/A';
          
          // Get point of action
          const poaSelect = container.querySelector('.poa-select');
          let poa = poaSelect ? poaSelect.value : 'N/A';
          if (poa === 'Other') {
            const poaOtherInput = container.querySelector('.poa-other-input');
            poa = poaOtherInput && poaOtherInput.value.trim() || 'Other (unspecified)';
          }
          poa = poa || 'N/A';
          
          return `**${routeCode}** | ${associateInfo} | **${progress}**\nRC: ${rc}\nPOA: ${poa}\n`;
        }).join('\n');

        const fileContent = header + routeContent;

        // Create and download file
        const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.setAttribute("href", url);
        link.setAttribute("download", "behind_routes.txt");
        document.body.appendChild(link);
        
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        updateProgress("Download complete!", true, true);
      } catch (error) {
        console.error("Download failed:", error);
        updateProgress(`Download failed: ${error.message}`, true);
      }
    };

    // Register cleanup for download button
    registerCleanup('eventListeners', () => {
      downloadBtn.removeEventListener("click", null);
    });

    // Close button handler with animation
    const closeModal = async () => {
      const fadeOut = modal.animate([
        { opacity: 1, transform: 'translate(-50%, -50%) translateZ(0)' },
        { opacity: 0, transform: 'translate(-50%, -40%) translateZ(0)' }
      ], {
        duration: 200,
        easing: 'ease-in',
        fill: 'forwards'
      });

      await fadeOut.finished;
      executeCleanup();
      modal.remove();
    };

    document.body.appendChild(modal);

    // Close button handler
    modal.querySelector("#close-btn").addEventListener("click", closeModal);

    return modal;
  };

  /**
   * Updates the progress display in the modal
   * @param {string} message - Message to display
   * @param {boolean} append - Whether to append or replace existing message
   * @param {boolean} complete - Whether the process is complete
   */
  const updateProgress = (message, append = true, complete = false) => {
    return withErrorBoundary(() => {
      const progressDetails = getElement("#progress-details");
      const progressStatus = getElement("#progress-status");
      const toggleBtn = getElement("#toggle-progress");

      if (progressDetails) {
        if (append) {
          progressDetails.innerHTML += `<p>${message}</p>`;
        } else {
          progressDetails.innerHTML = `<p>${message}</p>`;
        }
      }

      if (complete && progressStatus && toggleBtn) {
        progressStatus.style.display = "inline-block";
        progressDetails.style.display = "none";
        toggleBtn.textContent = "Show";
      }

      console.log(message);
    }, null, "Failed to update progress");
  };

  /**
   * Extracts the "BEHIND" count from progress text
   * @param {string} progressText - Progress text to parse
   * @returns {string|null} Extracted "X BEHIND" text or null
   */
  const extractBehindProgress = (progressText) => {
    return withErrorBoundary(() => {
      console.log("Extracting progress from text:", progressText);
      const match = progressText?.match(/(\d+)\s*BEHIND/i);
      const result = match ? `${match[1]} BEHIND` : null;
      console.log("Extracted progress:", result);
      return result;
    }, null, "Failed to extract behind progress");
  };

  /**
   * Cleans associate names by removing company information
   * @param {string} names - Names to clean
   * @returns {string} Cleaned names
   */
  const cleanAssociateNames = (names) => {
    return withErrorBoundary(() => {
      console.log("Cleaning associate names:", names);
      const cleanedNames = names.replace(/\(Cornerstone Delivery Service\)/g, "").trim();
      console.log("Cleaned associate names:", cleanedNames);
      return cleanedNames;
    }, names, "Failed to clean associate names");
  };

  /**
   * Extracts associate information from a route container
   * @param {Element} container - Container element
   * @param {boolean} isV1 - Whether using V1 interface
   * @returns {string} Extracted associate information
   */
  const extractAssociates = (container, isV1) => {
    return withErrorBoundary(() => {
      console.log("Extracting associates. Version:", isV1 ? "V1" : "V2");
      if (isV1) {
        const associateContainer = getElement(".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space", container);
        const tooltip = associateContainer?.nextElementSibling?.classList.contains("af-tooltip")
          ? Array.from(associateContainer.nextElementSibling.querySelectorAll("div")).map((el) =>
              cleanAssociateNames(el.textContent.trim())
            )
          : null;

        if (tooltip) {
          console.log("Extracted associates from tooltip (V1):", tooltip.join(", "));
          return tooltip.join(", ");
        }

        const associateInfo = cleanAssociateNames(
          getElement(".text-truncate", associateContainer)?.textContent.trim() || "No associate info"
        );
        console.log("Extracted associates (V1):", associateInfo);
        return associateInfo;
      } else {
        const associates = Array.from(getElements(".css-1kttr4w", container))
          .map((el) => cleanAssociateNames(el.textContent.trim()))
          .join(", ");
        console.log("Extracted associates (V2):", associates);
        return associates || "No associate info";
      }
    }, "No associate info", "Failed to extract associates");
  };

  /**
   * Collects route information from the page with improved performance and error handling
   * @param {string} selector - CSS selector for route elements
   * @param {Array} routes - Array to store collected routes
   * @param {number} maxScrolls - Maximum number of scroll iterations
   * @param {number} scrollDelay - Delay between scrolls in ms
   * @param {boolean} isV1 - Whether using V1 or V2 interface
   * @returns {Promise<void>}
   */
  const collectRoutes = async (selector, routes, maxScrolls = 20, scrollDelay = 100, isV1 = false) => {
    // Create intersection observer for smooth scrolling
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          registerCleanup('observers', () => observer.disconnect());
          processRouteElement(entry.target, routes, isV1);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    /**
     * Processes a single route element
     * @param {Element} el - Route element to process
     * @param {Array} routes - Array to store route data
     * @param {boolean} isV1 - Interface version flag
     */
    const processRouteElement = (el, routes, isV1) => {
      return withErrorBoundary(async () => {
        const routeCodeElem = isV1
          ? getElement('.left-column.text-sm', el)?.firstElementChild
          : getElement('.css-1nqzkik', el);
        
        const progressElem = isV1
          ? getElement('.complete.h-100.d-flex.justify-content-center.align-items-center.progressStatusBar', el)
          : getElement('.css-1xac89n.font-weight-bold', el);

        const routeCode = routeCodeElem?.textContent?.trim() || routeCodeElem?.getAttribute('title');
        if (!routeCode) {
          console.warn('Skipping route due to missing code');
          return;
        }

        const associateInfo = await withErrorBoundary(
          () => extractAssociates(el, isV1),
          'No associate info',
          'Failed to extract associate information'
        );

        const progressRaw = progressElem?.textContent?.trim();
        const progress = extractBehindProgress(progressRaw);

        // Avoid duplicates
        const existingRouteIndex = routes.findIndex(route => route.routeCode === routeCode);
        if (existingRouteIndex === -1) {
          routes.push({ routeCode, associateInfo, progress });
          console.log('Added route:', { routeCode, associateInfo, progress });
        }
      }, null, `Failed to process route element`);
    };

    let scrollCount = 0;
    const processNextBatch = async () => {
      if (scrollCount >= maxScrolls) {
        return;
      }

      const elements = getElements(selector);
      console.log(`Found ${elements.length} route elements in batch ${scrollCount + 1}`);

      // Observe all elements
      elements.forEach(el => observer.observe(el));

      // Smooth scroll to last element
      const lastElement = elements[elements.length - 1];
      if (lastElement) {
        await new Promise((resolve) => {
          lastElement.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
          // Use requestAnimationFrame for smoother scrolling
          requestAnimationFrame(() => {
            setTimeout(resolve, scrollDelay);
          });
        });
      }

      scrollCount++;
      await processNextBatch();
    };

    try {
      await processNextBatch();
      updateProgress(`Collected ${routes.length} unique routes.`);
    } catch (error) {
      console.error('Error during route collection:', error);
      updateProgress(`Error during route collection: ${error.message}`);
    } finally {
      observer.disconnect();
    }
  };

  const modal = createModal();
  const downloadBtn = modal.querySelector("#download-btn");

  try {
    console.log("Script started");
    updateProgress("Script started...");

    const isV1 = document.querySelector(".css-hkr77h")?.checked;
    updateProgress(`Detected Cortex Version: ${isV1 ? "V1" : "V2"}`);
    console.log(`Cortex Version: ${isV1 ? "V1" : "V2"}`);

    const routeSelector = isV1
      ? '[class^="af-link routes-list-item p-2 d-flex align-items-center w-100 route-"]'
      : ".css-1muusaa";
    const routes = [];

    updateProgress("Scrolling to collect routes...");
    await collectRoutes(routeSelector, routes, 20, 100, isV1);

    updateProgress("Scrolling back to the top...");
    window.scrollTo({ top: 0, behavior: "smooth" });
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for everything to load again

    updateProgress("Rechecking routes...");
    await collectRoutes(routeSelector, routes, 20, 100, isV1);

    updateProgress(`Final collection complete. Found ${routes.length} total routes.`);
    console.log("Final routes collected:", routes);

    const behindRoutes = routes.filter(route => {
      const progressText = extractBehindProgress(route.progress);
      // Only include routes if they have a non-zero BEHIND count
      return progressText && !progressText.startsWith('0 BEHIND');
    });
    console.log("Behind Routes:", behindRoutes);

    updateProgress(`Found ${behindRoutes.length} routes that are behind schedule.`, true, true);

    if (behindRoutes.length > 0) {
      const daSelectionSection = modal.querySelector("#da-selection-section");
      const daDropdowns = modal.querySelector("#da-dropdowns");
      
      // Show the DA selection section
      daSelectionSection.style.display = "block";

      // Create dropdowns for routes with multiple DAs
      behindRoutes.forEach((route) => {
        const das = route.associateInfo.split(", ");
        if (das.length > 1) {
          const container = document.createElement("div");
          container.style.marginBottom = "15px";
          container.style.padding = "15px";
          container.style.background = "white";
          container.style.borderRadius = "8px";
          container.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
          container.style.border = "1px solid #edf2f7";
          
          const label = document.createElement("label");
          label.textContent = `${route.routeCode} (${route.progress}):`;
          label.style.display = "block";
          label.style.marginBottom = "8px";
          label.style.fontWeight = "600";
          label.style.color = "#2c3e50";
          
          const select = document.createElement("select");
          select.style.width = "100%";
          select.style.padding = "8px 12px";
          select.style.borderRadius = "6px";
          select.style.border = "1px solid #ddd";
          select.style.backgroundColor = "#f8f9fa";
          select.style.cursor = "pointer";
          select.style.color = "#2c3e50";
          select.style.fontSize = "14px";
          select.dataset.routeCode = route.routeCode;
          
          das.forEach((da) => {
            const option = document.createElement("option");
            option.value = da;
            option.textContent = da;
            select.appendChild(option);
          });
          
          container.appendChild(label);
          container.appendChild(select);
          daDropdowns.appendChild(container);
        }
      });

      // Add Next button functionality
      const nextBtn = modal.querySelector("#da-next-btn");
      const previewSection = modal.querySelector("#preview-section");
      const routeDetails = modal.querySelector("#route-details");

      nextBtn.addEventListener("click", () => {
        daSelectionSection.style.display = "none";
        previewSection.style.display = "block";

        // Create route detail inputs
        behindRoutes.forEach((route) => {
          const select = daDropdowns.querySelector(`select[data-route-code="${route.routeCode}"]`);
          const associateInfo = select ? select.value : route.associateInfo;

          const container = document.createElement("div");
          container.style.marginBottom = "20px";
          container.style.padding = "15px";
          container.style.background = "white";
          container.style.borderRadius = "12px";
          container.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
          container.style.border = "1px solid #edf2f7";
          container.style.overflow = "hidden";
          container.dataset.routeCode = route.routeCode;

          container.innerHTML = `
            <div style="padding: 15px; border-bottom: 1px solid #edf2f7; background: #f8fafc;">
              <h4 style="margin: 0; color: #2c3e50; font-size: 16px; display: flex; justify-content: space-between; align-items: center;">
                <span>${route.routeCode}: ${associateInfo}</span>
                <span style="font-size: 14px; padding: 4px 8px; background: #ebf5ff; color: #3182ce; border-radius: 6px;">${route.progress}</span>
              </h4>
            </div>
            <div style="padding: 15px;">
              <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">Root Cause:</label>
                <div class="rc-checkboxes" style="display: flex; flex-direction: column; gap: 10px;">
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: background-color 0.2s; hover:background-color: #f7fafc;">
                    <input type="checkbox" class="rc-checkbox" value="Route is spread out" style="cursor: pointer; width: 16px; height: 16px;">
                    <span style="color: #2c3e50; font-size: 14px;">Route is spread out</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: background-color 0.2s; hover:background-color: #f7fafc;">
                    <input type="checkbox" class="rc-checkbox" value="DA is working at a slow pace" style="cursor: pointer; width: 16px; height: 16px;">
                    <span style="color: #2c3e50; font-size: 14px;">DA is working at a slow pace</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: background-color 0.2s; hover:background-color: #f7fafc;">
                    <input type="checkbox" class="rc-checkbox" value="DA is having connection issues" style="cursor: pointer; width: 16px; height: 16px;">
                    <span style="color: #2c3e50; font-size: 14px;">DA is having connection issues</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: background-color 0.2s; hover:background-color: #f7fafc;">
                    <input type="checkbox" class="rc-checkbox" value="High Package Count" style="cursor: pointer; width: 16px; height: 16px;">
                    <span style="color: #2c3e50; font-size: 14px;">High Package Count</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: background-color 0.2s; hover:background-color: #f7fafc;">
                    <input type="checkbox" class="rc-checkbox" value="High Stop Count" style="cursor: pointer; width: 16px; height: 16px;">
                    <span style="color: #2c3e50; font-size: 14px;">High Stop Count</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: background-color 0.2s; hover:background-color: #f7fafc;">
                    <input type="checkbox" class="rc-checkbox other-checkbox" value="Other" style="cursor: pointer; width: 16px; height: 16px;">
                    <span style="color: #2c3e50; font-size: 14px;">Other</span>
                  </label>
                  <div class="other-input-container" style="display: none; margin-left: 32px;">
                    <input type="text" class="other-input" style="width: calc(100% - 16px); padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background: #f8fafc;" placeholder="Enter other root cause...">
                  </div>
                </div>
              </div>
              <div>
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">Point of Action:</label>
                <select class="poa-select" style="width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background-color: white; cursor: pointer; color: #2c3e50; appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%232c3e50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;">
                  <option value="">Select a point of action...</option>
                  <option value="Rescue Planned">Rescue Planned</option>
                  <option value="Rescue Sent">Rescue Sent</option>
                  <option value="Rescue on the way">Rescue on the way</option>
                  <option value="We're monitoring progress and will send a rescue if needed">We're monitoring progress and will send a rescue if needed</option>
                  <option value="Route Complete">Route Complete</option>
                  <option value="Other">Other</option>
                </select>
                <div class="poa-other-container" style="display: none; margin-top: 8px;">
                  <input type="text" class="poa-other-input" style="width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background: #f8fafc;" placeholder="Enter other point of action...">
                </div>
              </div>
            </div>
          `;

          // Add event listener for Other checkbox
          const otherCheckbox = container.querySelector('.other-checkbox');
          const otherInputContainer = container.querySelector('.other-input-container');
          
          otherCheckbox.addEventListener('change', (e) => {
            otherInputContainer.style.display = e.target.checked ? 'block' : 'none';
          });

          // Add event listener for POA select
          const poaSelect = container.querySelector('.poa-select');
          const poaOtherContainer = container.querySelector('.poa-other-container');
          
          poaSelect.addEventListener('change', (e) => {
            poaOtherContainer.style.display = e.target.value === 'Other' ? 'block' : 'none';
          });

          routeDetails.appendChild(container);
        });

        // Add change event listeners to all DA dropdowns
        const allDropdowns = daDropdowns.querySelectorAll('select');
        allDropdowns.forEach(select => {
          select.addEventListener('change', (e) => {
            const routeCode = e.target.dataset.routeCode;
            const container = routeDetails.querySelector(`div[data-route-code="${routeCode}"]`);
            if (container) {
              const h4 = container.querySelector('h4');
              const progress = h4.textContent.match(/\((.*?)\)/)[0]; // Get the progress part
              h4.textContent = `${routeCode}: ${e.target.value} ${progress}`;
            }
          });
        });
      });

      // Update download functionality to include RC and POA
      downloadBtn.onclick = () => {
        // Get current date and time
        const now = new Date();
        const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear().toString().substr(-2)}`;
        const hour = now.getHours();
        const roundedHour = hour >= 12 ? `${hour === 12 ? 12 : hour - 12}PM` : `${hour === 0 ? 12 : hour}AM`;
        
        // Get values from input fields
        const inProgress = document.getElementById('in-progress-input').value || '0';
        const atRisk = document.getElementById('at-risk-input').value || '0';
        const behind = document.getElementById('behind-input').value || '0';
        const packageProgress = document.getElementById('package-progress-input').value || '0';

        // Create header
        const header = `/md\n@\n## CRDR UPDATE - ${formattedDate} ${roundedHour}\n\n` +
                      `**IN PROGRESS: ${inProgress.toString().padStart(2, '0')}**\n` +
                      `**AT RISK: ${atRisk.toString().padStart(2, '0')}**\n` +
                      `**BEHIND: ${behind.toString().padStart(2, '0')}**\n` +
                      `**PACKAGE PROGRESS: ${packageProgress}%**\n\n` +
                      `---\n\n`;

        const routeContent = behindRoutes.map((route) => {
          const select = daDropdowns.querySelector(`select[data-route-code="${route.routeCode}"]`);
          const associateInfo = select ? select.value : route.associateInfo;
          
          // Find the container by iterating through all containers and matching the route code
          const containers = document.querySelectorAll('#route-details > div');
          const container = Array.from(containers).find(div => {
            const h4 = div.querySelector('h4 span');
            return h4 && h4.textContent.includes(route.routeCode);
          });
          
          if (!container) return `${route.routeCode}: ${associateInfo} (${route.progress})\n`;
          
          // Get all checked root causes
          const checkedBoxes = container.querySelectorAll('input[type="checkbox"]:checked');
          const rootCauses = Array.from(checkedBoxes).map(checkbox => {
            if (checkbox.classList.contains('other-checkbox') && checkbox.checked) {
              const otherInput = container.querySelector('.other-input');
              return otherInput && otherInput.value.trim() || 'Other (unspecified)';
            }
            return checkbox.value;
          }).filter(Boolean); // Remove any empty values
          
          const rc = rootCauses.length > 0 ? rootCauses.join(', ') : 'N/A';
          
          // Get POA value
          const poaSelect = container.querySelector('.poa-select');
          let poa = poaSelect ? poaSelect.value : 'N/A';
          if (poa === 'Other') {
            const poaOtherInput = container.querySelector('.poa-other-input');
            poa = poaOtherInput && poaOtherInput.value.trim() || 'Other (unspecified)';
          }
          poa = poa || 'N/A';
          
          return `**${route.routeCode}** | ${associateInfo} | **${route.progress}**\nRC: ${rc}\nPOA: ${poa}\n`;
        }).join('\n');

        const fileContent = header + routeContent;

        const blob = new Blob([fileContent], { type: "text/plain" });
        const blobURL = URL.createObjectURL(blob);

        const link = document.createElement("a");
        
        link.setAttribute("href", blobURL);
        link.setAttribute("download", "behind_routes.txt");
        document.body.appendChild(link);
        
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobURL);
      };
    }
  } catch (error) {
    console.error("Error during route data processing:", error);
    updateProgress(`Error: ${error.message}`);
  }

  // Add back button functionality
  const backBtn = modal.querySelector("#back-btn");
  backBtn.addEventListener("click", () => {
    const previewSection = modal.querySelector("#preview-section");
    const daSelectionSection = modal.querySelector("#da-selection-section");
    previewSection.style.display = "none";
    daSelectionSection.style.display = "block";
  });

  backBtn.addEventListener("mouseover", () => {
    backBtn.style.backgroundColor = "#5a6268";
    backBtn.style.boxShadow = "0 4px 6px rgba(108, 117, 125, 0.3)";
  });
  backBtn.addEventListener("mouseout", () => {
    backBtn.style.backgroundColor = "#6c757d";
    backBtn.style.boxShadow = "0 2px 4px rgba(108, 117, 125, 0.2)";
  });

  // Add next button to preview section
  const previewNextBtn = modal.querySelector("#preview-next-btn");
  previewNextBtn.addEventListener("click", () => {
    modal.querySelector("#preview-section").style.display = "none";
    modal.querySelector("#dsp-progress-section").style.display = "block";
  });

  // Add event listeners for the progress back button
  const progressBackBtn = modal.querySelector("#progress-back-btn");
  progressBackBtn.addEventListener("click", () => {
    modal.querySelector("#dsp-progress-section").style.display = "none";
    modal.querySelector("#preview-section").style.display = "block";
  });

  progressBackBtn.addEventListener("mouseover", () => {
    progressBackBtn.style.backgroundColor = "#5a6268";
    progressBackBtn.style.boxShadow = "0 4px 6px rgba(108, 117, 125, 0.3)";
  });

  progressBackBtn.addEventListener("mouseout", () => {
    progressBackBtn.style.backgroundColor = "#6c757d";
    progressBackBtn.style.boxShadow = "0 2px 4px rgba(108, 117, 125, 0.2)";
  });
})();
