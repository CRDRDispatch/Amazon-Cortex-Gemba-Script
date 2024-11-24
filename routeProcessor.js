(() => {
  // Global state
  let behindRoutes = [];
  
  const createModal = () => {
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      max-width: 800px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      cursor: move;
    `;

    modal.innerHTML = `
      <div style="position: relative;">
        <button id="close-btn" style="position: absolute; top: 0; right: 0; background: none; border: none; color: #666; cursor: pointer; font-size: 24px; padding: 5px;">×</button>
        
        <h2 style="font-family: Arial, sans-serif; color: #2c3e50; margin-bottom: 20px; font-size: 20px; text-align: center;">Amazon DSP Route Processor</h2>
        
        <div id="initial-section">
          <div style="margin-bottom: 20px; text-align: center;">
            <button id="scan-btn" style="padding: 12px 25px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Scan Routes</button>
          </div>
          <div id="progress-container" style="font-family: Arial, sans-serif; text-align: left; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 12px; border: 1px solid #edf2f7;">
            <p id="progress-text" style="margin: 0; color: #2c3e50;">Initializing...</p>
          </div>
        </div>

        <div id="da-selection-section" style="display: none;">
          <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin-bottom: 12px; font-weight: 600;">These routes have multiple DAs. Please select the DA assigned to the route.</h3>
          <div id="da-dropdowns"></div>
          <div style="text-align: right; margin-top: 15px;">
            <button id="da-next-btn" style="padding: 8px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: Arial, sans-serif;">Next</button>
          </div>
        </div>

        <div id="route-details-section" style="display: none;">
          <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin-bottom: 12px; font-weight: 600;">Route Details</h3>
          <div id="route-details"></div>
          <div style="text-align: right; margin-top: 15px;">
            <button id="details-next-btn" style="padding: 8px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: Arial, sans-serif;">Next</button>
          </div>
        </div>

        <div id="dsp-progress-section" style="display: none;">
          <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin-bottom: 12px; font-weight: 600;">DSP Total Progress</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
            <div>
              <label style="display: block; margin-bottom: 5px; color: #2c3e50;">In Progress:</label>
              <input type="number" id="in-progress-input" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" min="0">
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #2c3e50;">At Risk:</label>
              <input type="number" id="at-risk-input" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" min="0">
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #2c3e50;">Behind:</label>
              <input type="number" id="behind-input" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" min="0">
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #2c3e50;">Package Progress %:</label>
              <input type="number" id="package-progress-input" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" min="0" max="100">
            </div>
          </div>
          <div style="text-align: right;">
            <button id="download-btn" style="padding: 8px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: Arial, sans-serif;">Download Report</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Get section elements
    const initialSection = modal.querySelector("#initial-section");
    const daSelectionSection = modal.querySelector("#da-selection-section");
    const routeDetailsSection = modal.querySelector("#route-details-section");
    const dspProgressSection = modal.querySelector("#dsp-progress-section");
    const daDropdowns = modal.querySelector("#da-dropdowns");
    const routeDetails = modal.querySelector("#route-details");

    // Add hover effects for buttons
    const buttons = modal.querySelectorAll("button");
    buttons.forEach(button => {
      if (button.id !== "close-btn") {
        button.addEventListener("mouseover", () => {
          button.style.backgroundColor = "#45a049";
          button.style.boxShadow = "0 6px 8px rgba(76, 175, 80, 0.3)";
        });
        button.addEventListener("mouseout", () => {
          button.style.backgroundColor = "#4CAF50";
          button.style.boxShadow = "0 4px 6px rgba(76, 175, 80, 0.2)";
        });
      }
    });

    // Close button handler
    const closeBtn = modal.querySelector("#close-btn");
    closeBtn.addEventListener("mouseover", () => closeBtn.style.color = "#ff4444");
    closeBtn.addEventListener("mouseout", () => closeBtn.style.color = "#666");
    closeBtn.addEventListener("click", () => {
      modal.remove();
    });

    // Make modal draggable
    let isDragging = false;
    let startX;
    let startY;
    let modalRect;

    const dragStart = (e) => {
      if (e.target.closest('button') || e.target.closest('select') || e.target.closest('input')) return;

      isDragging = true;
      modalRect = modal.getBoundingClientRect();
      
      if (e.type === "touchstart") {
        startX = e.touches[0].clientX - modalRect.left;
        startY = e.touches[0].clientY - modalRect.top;
      } else {
        startX = e.clientX - modalRect.left;
        startY = e.clientY - modalRect.top;
      }
      
      modal.style.cursor = 'grabbing';
    };

    const dragEnd = () => {
      isDragging = false;
      modal.style.cursor = 'move';
    };

    const drag = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      let x, y;
      if (e.type === "touchmove") {
        x = e.touches[0].clientX - startX;
        y = e.touches[0].clientY - startY;
      } else {
        x = e.clientX - startX;
        y = e.clientY - startY;
      }

      const maxX = window.innerWidth - modal.offsetWidth;
      const maxY = window.innerHeight - modal.offsetHeight;
      
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      modal.style.left = x + 'px';
      modal.style.top = y + 'px';
      modal.style.transform = 'none';
    };

    modal.addEventListener('mousedown', dragStart);
    modal.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    // Clean up event listeners when modal is closed
    closeBtn.addEventListener("click", () => {
      document.removeEventListener("mousemove", drag);
      document.removeEventListener("touchmove", drag);
      document.removeEventListener("mouseup", dragEnd);
      document.removeEventListener("touchend", dragEnd);
      modal.remove();
    });

    // Add scan button handler
    const scanBtn = modal.querySelector("#scan-btn");
    scanBtn.addEventListener("click", async () => {
      try {
        scanBtn.disabled = true;
        scanBtn.style.opacity = "0.7";
        scanBtn.style.cursor = "not-allowed";

        updateProgress("Starting route scan...");

        const isV1 = document.querySelector(".css-hkr77h")?.checked;
        const routeSelector = isV1
          ? ".d-flex.flex-column.border-bottom.border-light-gray"
          : '[role="row"]';

        const routes = [];
        await collectRoutes(routeSelector, routes, 20, 100, isV1);
        console.log("Route collection complete");
        
        if (routes.length === 0) {
          throw new Error("No routes found");
        }

        behindRoutes = routes.filter(route => route.progress?.toLowerCase().includes("behind"));
        console.log("Behind routes:", behindRoutes);

        if (behindRoutes.length === 0) {
          updateProgress("No behind routes found", true);
          return;
        }

        const hasMultipleDAs = behindRoutes.some(route => route.das.length > 1);
        if (hasMultipleDAs) {
          setupDADropdowns(behindRoutes);
          daSelectionSection.style.display = "block";
        } else {
          setupRouteDetails(behindRoutes);
          routeDetailsSection.style.display = "block";
        }

        initialSection.style.display = "none";
        dspProgressSection.style.display = "block";

      } catch (error) {
        console.error("Error during route scanning:", error);
        updateProgress(`Error during scan: ${error.message}`, true, true);
      } finally {
        scanBtn.disabled = false;
        scanBtn.style.opacity = "1";
        scanBtn.style.cursor = "pointer";
      }
    });

    // Add download functionality
    const downloadBtn = modal.querySelector("#download-btn");
    downloadBtn.onclick = () => {
      const now = new Date();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const year = now.getFullYear().toString().slice(-2);
      const hour = now.getHours();
      const formattedHour = hour > 12 ? `${hour-12}PM` : `${hour}AM`;
      
      const inProgress = document.getElementById('in-progress-input').value.padStart(2, '0') || '00';
      const atRisk = document.getElementById('at-risk-input').value.padStart(2, '0') || '00';
      const behind = document.getElementById('behind-input').value.padStart(2, '0') || '00';
      const packageProgress = document.getElementById('package-progress-input').value || '0';

      const header = `@\n## CRDR UPDATE - ${month}/${day}/${year} ${formattedHour}\n\n` +
                    `**IN PROGRESS: ${inProgress}**\n` +
                    `**AT RISK: ${atRisk}**\n` +
                    `**BEHIND: ${behind}**\n` +
                    `**PACKAGE PROGRESS: ${packageProgress}%**\n\n` +
                    `---\n\n`;

      const routeContent = behindRoutes.map((route) => {
        const select = daDropdowns.querySelector(`select[data-route-id="${route.id}"]`);
        const associateInfo = select ? select.value : route.das.join(', ');
        
        const containers = routeDetails.querySelectorAll('div');
        const container = Array.from(containers).find(div => {
          const h4 = div.querySelector('h4');
          return h4 && h4.textContent.startsWith(route.id);
        });
        
        if (!container) return `${route.id}: ${associateInfo} (${route.progress})\n`;
        
        const checkedBoxes = container.querySelectorAll('.rc-checkbox:checked');
        const rootCauses = Array.from(checkedBoxes).map(checkbox => {
          if (checkbox.value === 'Other') {
            const otherInput = container.querySelector('.other-input');
            return otherInput.value.trim() || 'Other (unspecified)';
          }
          return checkbox.value;
        });
        
        const rc = rootCauses.length > 0 ? rootCauses.join(', ') : 'N/A';
        
        const poaSelect = container.querySelector('.poa-select');
        let poa = poaSelect.value;
        if (poa === 'Other') {
          const poaOtherInput = container.querySelector('.poa-other-input');
          poa = poaOtherInput.value.trim() || 'Other (unspecified)';
        }
        poa = poa || 'N/A';
        
        return `${route.id}: ${associateInfo} (${route.progress})\nRoot Cause: ${rc}\nPoint of Action: ${poa}\n`;
      }).join('\n');

      const fileContent = header + routeContent;

      const blob = new Blob([fileContent], { type: "text/plain" });
      const blobURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobURL;
      link.download = "behind_routes.txt";
      link.click();
      URL.revokeObjectURL(blobURL);
    };

    // Add navigation button handlers
    const daNextBtn = modal.querySelector("#da-next-btn");
    daNextBtn.addEventListener("click", () => {
      daSelectionSection.style.display = "none";
      setupRouteDetails(behindRoutes);
      routeDetailsSection.style.display = "block";
    });

    const detailsNextBtn = modal.querySelector("#details-next-btn");
    detailsNextBtn.addEventListener("click", () => {
      routeDetailsSection.style.display = "none";
      dspProgressSection.style.display = "block";
    });

    // Setup functions
    const setupDADropdowns = (routes) => {
      daDropdowns.innerHTML = routes
        .filter(route => route.das.length > 1)
        .map((route) => {
          return `
            <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #edf2f7;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">
                ${route.id} (${route.progress}):
              </label>
              <select data-route-id="${route.id}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                ${route.das.map(da => `<option value="${da}">${da}</option>`).join("")}
              </select>
            </div>
          `;
        })
        .join("");
    };

    const setupRouteDetails = (routes) => {
      try {
        routeDetails.innerHTML = routes.map((route) => {
          const select = daDropdowns.querySelector(`select[data-route-id="${route.id}"]`);
          const associateInfo = select ? select.value : route.das.join(', ');
          
          return `
            <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #edf2f7;">
              <h4 style="margin: 0 0 10px; font-size: 16px; color: #2c3e50;">${route.id}: ${associateInfo}</h4>
              <div style="margin-bottom: 15px;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #2c3e50;">Root Cause:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px;">
                  <label class="rc-label">
                    <input type="checkbox" class="rc-checkbox" value="Late Start"> Late Start
                  </label>
                  <label class="rc-label">
                    <input type="checkbox" class="rc-checkbox" value="Lunch Break"> Lunch Break
                  </label>
                  <label class="rc-label">
                    <input type="checkbox" class="rc-checkbox" value="System Issues"> System Issues
                  </label>
                  <label class="rc-label">
                    <input type="checkbox" class="rc-checkbox" value="Traffic"> Traffic
                  </label>
                  <label class="rc-label">
                    <input type="checkbox" class="rc-checkbox" value="Weather"> Weather
                  </label>
                  <label class="rc-label">
                    <input type="checkbox" class="rc-checkbox" value="Other"> Other
                  </label>
                </div>
                <input type="text" class="other-input" style="display: none; width: 100%; margin-top: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Please specify other root cause...">
              </div>
              <div style="margin-bottom: 15px;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #2c3e50;">Point of Action:</p>
                <select class="poa-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                  <option value="">Select Point of Action...</option>
                  <option value="Called DA">Called DA</option>
                  <option value="Texted DA">Texted DA</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Other">Other</option>
                </select>
                <input type="text" class="poa-other-input" style="display: none; width: 100%; margin-top: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Please specify other point of action...">
              </div>
            </div>
          `;
        }).join('');

        // Add event listeners for Other inputs
        routeDetails.querySelectorAll('.rc-checkbox[value="Other"]').forEach(checkbox => {
          const otherInput = checkbox.closest('div').nextElementSibling;
          checkbox.addEventListener('change', () => {
            otherInput.style.display = checkbox.checked ? 'block' : 'none';
          });
        });

        routeDetails.querySelectorAll('.poa-select').forEach(select => {
          const otherInput = select.nextElementSibling;
          select.addEventListener('change', e => {
            otherInput.style.display = e.target.value === 'Other' ? 'block' : 'none';
          });
        });
      } catch (error) {
        console.error('Error setting up route details:', error);
        updateProgress('Error setting up route details: ' + error.message, true, true);
      }
    };

    // Update progress with improved error handling
    const updateProgress = (message, isComplete = false, isError = false) => {
      const progressText = document.querySelector("#progress-text");
      if (!progressText) {
        console.error("Progress text element not found");
        return;
      }

      try {
        progressText.textContent = message;
        progressText.style.color = isError ? "#dc3545" : (isComplete ? "#28a745" : "#2c3e50");
        console.log(`Progress Update [${isError ? "ERROR" : (isComplete ? "COMPLETE" : "INFO")}]:`, message);
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    };

    // Collect routes function with improved error handling and progress tracking
    const collectRoutes = async (routeSelector, routes, maxIterations = 20, delay = 100, isV1 = false) => {
      let iteration = 0;
      let lastHeight = 0;
      let sameHeightCount = 0;
      const maxSameHeight = 3;

      while (iteration < maxIterations) {
        try {
          // Get all route elements
          const routeElements = document.querySelectorAll(routeSelector);
          updateProgress(`Scanning routes... Found ${routeElements.length} elements on iteration ${iteration + 1}`);

          // Process each route element
          routeElements.forEach(routeElement => {
            const routeInfo = extractRouteInfo(routeElement, isV1);
            if (routeInfo && !routes.some(r => r.id === routeInfo.id)) {
              routes.push(routeInfo);
            }
          });

          // Scroll and check for end of content
          const container = isV1 ? document.querySelector('.ReactVirtualized__Grid__innerScrollContainer') 
                                : document.querySelector('[data-testid="virtual-table-body"]');
          if (!container) {
            console.error('Scroll container not found');
            break;
          }

          const currentHeight = container.scrollHeight;
          if (currentHeight === lastHeight) {
            sameHeightCount++;
            if (sameHeightCount >= maxSameHeight) {
              updateProgress('Reached end of content', true);
              break;
            }
          } else {
            sameHeightCount = 0;
          }

          lastHeight = currentHeight;
          container.scrollBy(0, window.innerHeight);
          
          // Wait for content to load
          await new Promise(resolve => setTimeout(resolve, delay));
          iteration++;
        } catch (error) {
          console.error('Error during route collection:', error);
          updateProgress(`Error during collection: ${error.message}`, true);
          break;
        }
      }
    };

    // Extract route information with improved error handling
    const extractRouteInfo = (element, isV1) => {
      try {
        const route = {
          id: '',
          name: '',
          progress: '',
          das: []
        };

        if (isV1) {
          const cells = element.querySelectorAll('div[role="gridcell"]');
          cells.forEach((cell, index) => {
            const text = cell.textContent.trim();
            switch (index) {
              case 0:
                route.id = text;
                break;
              case 1:
                route.name = text;
                break;
              case 4:
                route.progress = text.toLowerCase();
                break;
              case 2:
                if (text) {
                  const names = text.split(',')
                    .map(name => name.trim())
                    .filter(name => name)
                    .map(name => name.replace('(Cornerstone Delivery Service)', '').trim());
                  route.das = names;
                }
                break;
            }
          });
        } else {
          const cells = element.querySelectorAll('td');
          cells.forEach(cell => {
            const columnName = cell.getAttribute('data-column-id');
            const text = cell.textContent.trim();
            
            switch (columnName) {
              case 'routeId':
                route.id = text;
                break;
              case 'routeName':
                route.name = text;
                break;
              case 'progress':
                route.progress = text.toLowerCase();
                break;
              case 'driverName':
                if (text) {
                  const names = text.split(',')
                    .map(name => name.trim())
                    .filter(name => name)
                    .map(name => name.replace('(Cornerstone Delivery Service)', '').trim());
                  route.das = names;
                }
                break;
            }
          });
        }

        return route.id ? route : null;
      } catch (error) {
        console.error('Error extracting route info:', error);
        return null;
      }
    };

    // Add error boundary wrapper for async operations
    const withErrorHandling = async (operation, errorMessage) => {
      try {
        return await operation();
      } catch (error) {
        console.error(`${errorMessage}:`, error);
        updateProgress(`${errorMessage}: ${error.message}`, true, true);
        throw error;
      }
    };

    // Main execution
    try {
      console.log("Script started");
      updateProgress("Script started...");

      const isV1 = document.querySelector(".css-hkr77h")?.checked;
      console.log("Interface version:", isV1 ? "V1" : "V2");

      const routeSelector = isV1
        ? ".d-flex.flex-column.border-bottom.border-light-gray"
        : '[role="row"]';

      await withErrorHandling(async () => {
        const routes = [];
        await collectRoutes(routeSelector, routes, 20, 100, isV1);
        console.log("Route collection complete");
        
        if (routes.length === 0) {
          throw new Error("No routes found");
        }

        behindRoutes = routes.filter(route => route.progress?.toLowerCase().includes("behind"));
        console.log("Behind routes:", behindRoutes);

        if (behindRoutes.length === 0) {
          updateProgress("No behind routes found", true);
          return;
        }

        setupRouteDetails(behindRoutes);
        routeDetailsSection.style.display = "block";
        dspProgressSection.style.display = "block";
      }, "Error processing routes");

    } catch (error) {
      console.error("Fatal error:", error);
      updateProgress(`Fatal error: ${error.message}`, true, true);
    }
  };

  createModal();
})();
