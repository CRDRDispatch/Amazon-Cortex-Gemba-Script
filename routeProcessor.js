(async function () {
  const createModal = () => {
    const modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%) translateZ(0)";
    modal.style.webkitTransform = "translate(-50%, -50%) translateZ(0)";
    modal.style.backfaceVisibility = "hidden";
    modal.style.webkitBackfaceVisibility = "hidden";
    modal.style.perspective = "1000";
    modal.style.webkitPerspective = "1000";
    modal.style.width = "400px";
    modal.style.background = "white";
    modal.style.border = "none";
    modal.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.1)";
    modal.style.padding = "25px";
    modal.style.borderRadius = "16px";
    modal.style.zIndex = "10000";
    modal.style.textAlign = "center";
    modal.style.maxHeight = "90vh";
    modal.style.overflowY = "auto";
    modal.style.willChange = "transform";
    modal.style.isolation = "isolate";
    modal.style.cursor = "move";  // Indicate draggable

    modal.innerHTML = `
      <div id="modal-content" style="position: relative; width: 90%; max-width: 800px; margin: 50px auto; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <button id="close-btn" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 18px; cursor: pointer; color: #666; transition: color 0.2s ease;">✖</button>
        <div style="margin-bottom: 25px; cursor: move;">
          <img src="https://crdrdispatch.github.io/GembaScript/Logo.svg" alt="Logo" style="height: 90px; display: block; margin: 0 auto; -webkit-transform: translateZ(0); transform: translateZ(0); pointer-events: none;">
        </div>
        
        <div id="initial-section">
          <div style="margin-bottom: 20px; text-align: center;">
            <button id="scan-btn" style="padding: 12px 25px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Scan Routes</button>
          </div>
          <div id="progress-details" style="font-family: Arial, sans-serif; text-align: left; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 12px; border: 1px solid #edf2f7;">
            <p>Initializing...</p>
          </div>
        </div>

        <div id="da-selection-section" style="display: none;">
          <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin-bottom: 12px; font-weight: 600;">These routes have multiple DAs. Please select the DA assigned to the route.</h3>
          <div id="da-dropdowns" style="max-height: 400px; overflow-y: auto; padding: 15px; background: #f8f9fa; border-radius: 12px; border: 1px solid #edf2f7;">
          </div>
          <div style="margin-top: 20px; text-align: right;">
            <button id="next-btn" style="padding: 12px 25px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Next</button>
          </div>
        </div>

        <div id="route-details-section" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <button id="back-btn" style="padding: 8px 16px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2); transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 18px;">←</span> Back
            </button>
            <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin: 0; font-weight: 600;">Route Details</h3>
            <div style="width: 80px;"></div>
          </div>
          <div id="route-details" style="max-height: 400px; overflow-y: auto; padding: 15px; background: #f8f9fa; border-radius: 12px; border: 1px solid #edf2f7; scrollbar-width: thin; scrollbar-color: #cbd5e0 #f8f9fa;">
          </div>
          <div style="margin-top: 20px; text-align: right;">
            <button id="next-to-progress-btn" style="padding: 12px 30px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Next</button>
          </div>
        </div>

        <div id="dsp-progress-section" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <button id="back-to-routes-btn" style="padding: 8px 16px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2); transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 18px;">←</span> Back
            </button>
            <h3 style="font-family: Arial, sans-serif; font-size: 16px; color: #2c3e50; margin: 0; font-weight: 600;">DSP Total Progress</h3>
            <div style="width: 80px;"></div>
          </div>
          <div style="padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #edf2f7;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
              <div>
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">In Progress:</label>
                <input type="number" id="in-progress-input" style="width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background: #f8fafc;" placeholder="Enter number...">
              </div>
              <div>
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">At Risk:</label>
                <input type="number" id="at-risk-input" style="width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background: #f8fafc;" placeholder="Enter number...">
              </div>
              <div>
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">Behind:</label>
                <input type="number" id="behind-input" style="width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background: #f8fafc;" placeholder="Enter number...">
              </div>
              <div>
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 600; font-size: 14px;">Package Progress:</label>
                <input type="number" id="package-progress-input" style="width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; background: #f8fafc;" placeholder="Enter percentage...">
              </div>
            </div>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <button id="download-btn" style="padding: 12px 30px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 4px;">
                <path d="M8 0a8 8 0 0 1 8 8 8 8 0 0 1-8 8A8 8 0 0 1 0 8a8 8 0 0 1 8-8zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
              </svg>
              Download File
            </button>
          </div>
        </div>
      </div>
    `;

    // Add hover effects
    const closeBtn = modal.querySelector("#close-btn");
    closeBtn.addEventListener("mouseover", () => closeBtn.style.color = "#ff4444");
    closeBtn.addEventListener("mouseout", () => closeBtn.style.color = "#666");

    const modalToggleBtn = modal.querySelector("#toggle-progress");
    const progressDetails = modal.querySelector("#progress-details");
    
    modalToggleBtn.addEventListener("mouseover", () => {
      modalToggleBtn.style.backgroundColor = "#f0f0f0";
    });
    modalToggleBtn.addEventListener("mouseout", () => {
      modalToggleBtn.style.backgroundColor = "transparent";
    });
    
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

    const nextBtn = modal.querySelector("#next-btn");
    const downloadBtn = modal.querySelector("#download-btn");
    downloadBtn.addEventListener("mouseover", () => {
      downloadBtn.style.backgroundColor = "#45a049";
      downloadBtn.style.boxShadow = "0 6px 8px rgba(76, 175, 80, 0.3)";
    });
    downloadBtn.addEventListener("mouseout", () => {
      downloadBtn.style.backgroundColor = "#4CAF50";
      downloadBtn.style.boxShadow = "0 4px 6px rgba(76, 175, 80, 0.2)";
    });

    document.body.appendChild(modal);

    // Add section navigation handlers
    const initialSection = modal.querySelector("#initial-section");
    const daSelectionSection = modal.querySelector("#da-selection-section");
    const routeDetailsSection = modal.querySelector("#route-details-section");
    const dspProgressSection = modal.querySelector("#dsp-progress-section");
    const routeDetails = modal.querySelector("#route-details");
    const daDropdowns = modal.querySelector("#da-dropdowns");

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

    // Add close button handler
    closeBtn.addEventListener("click", () => {
      modal.remove();
    });

    // Add scan button handler
    const scanBtn = modal.querySelector("#scan-btn");
    scanBtn.addEventListener("click", async () => {
      try {
        initialSection.style.display = "none";
        
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
        await new Promise((resolve) => setTimeout(resolve, 2000));

        updateProgress("Rechecking routes...");
        await collectRoutes(routeSelector, routes, 20, 100, isV1);

        updateProgress(`Final collection complete. Found ${routes.length} total routes.`);
        console.log("Final routes collected:", routes);

        const behindRoutes = routes.filter((route) => route.progress?.includes("behind"));
        console.log("Behind Routes:", behindRoutes);

        updateProgress(`Found ${behindRoutes.length} routes that are behind schedule.`, true, true);

        if (behindRoutes.length > 0) {
          // Set up DA dropdowns if needed
          const hasMultipleDAs = behindRoutes.some(route => route.associateInfo.includes(","));
          if (hasMultipleDAs) {
            setupDADropdowns(behindRoutes);
            daSelectionSection.style.display = "block";
          } else {
            setupRouteDetails(behindRoutes);
            routeDetailsSection.style.display = "block";
          }
        }
      } catch (error) {
        console.error("Error during route scanning:", error);
        updateProgress(`Error: ${error.message}`);
      }
    });

    // Add navigation button handlers
    const nextBtn = modal.querySelector("#next-btn");
    nextBtn.addEventListener("click", () => {
      daSelectionSection.style.display = "none";
      setupRouteDetails(behindRoutes);
      routeDetailsSection.style.display = "block";
    });

    const backBtn = modal.querySelector("#back-btn");
    backBtn.addEventListener("click", () => {
      routeDetailsSection.style.display = "none";
      daSelectionSection.style.display = "block";
    });

    const nextToProgressBtn = modal.querySelector("#next-to-progress-btn");
    nextToProgressBtn.addEventListener("click", () => {
      routeDetailsSection.style.display = "none";
      dspProgressSection.style.display = "block";
    });

    const backToRoutesBtn = modal.querySelector("#back-to-routes-btn");
    backToRoutesBtn.addEventListener("click", () => {
      dspProgressSection.style.display = "none";
      routeDetailsSection.style.display = "block";
    });

    // Setup functions
    const setupDADropdowns = (routes) => {
      daDropdowns.innerHTML = routes
        .filter(route => route.associateInfo.includes(","))
        .map((route) => {
          const das = route.associateInfo.split(", ");
          return `
            <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #edf2f7;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50;">
                ${route.routeCode} (${route.progress}):
              </label>
              <select data-route-code="${route.routeCode}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                ${das.map(da => `<option value="${da}">${da}</option>`).join("")}
              </select>
            </div>
          `;
        })
        .join("");
    };

    const setupRouteDetails = (routes) => {
      routeDetails.innerHTML = routes.map((route) => {
        const select = daDropdowns.querySelector(`select[data-route-code="${route.routeCode}"]`);
        const associateInfo = select ? select.value : route.associateInfo;
        
        return `
          <div style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #edf2f7;">
            <h4 style="margin: 0 0 10px; font-size: 16px; color: #2c3e50;">${route.routeCode}: ${associateInfo}</h4>
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 8px; font-weight: 600; color: #2c3e50;">Root Cause:</p>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px;">
                <label class="rc-label">
                  <input type="checkbox" class="rc-checkbox" value="Late Start"> Late Start
                </label>
                <label class="rc-label">
                  <input type="checkbox" class="rc-checkbox" value="Long Breaks"> Long Breaks
                </label>
                <label class="rc-label">
                  <input type="checkbox" class="rc-checkbox" value="System Issues"> System Issues
                </label>
                <label class="rc-label">
                  <input type="checkbox" class="rc-checkbox" value="Other"> Other
                </label>
              </div>
              <input type="text" class="other-input" style="display: none; width: 100%; margin-top: 8px; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Specify other root cause...">
            </div>
            <div>
              <p style="margin: 0 0 8px; font-weight: 600; color: #2c3e50;">Point of Action:</p>
              <select class="poa-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px;">
                <option value="">Select POA...</option>
                <option value="Rescue">Rescue</option>
                <option value="RTS">RTS</option>
                <option value="Other">Other</option>
              </select>
              <input type="text" class="poa-other-input" style="display: none; width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Specify other POA...">
            </div>
          </div>
        `;
      }).join("");

      // Add event listeners for Other checkboxes
      routeDetails.querySelectorAll('.rc-checkbox[value="Other"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const otherInput = e.target.closest('div').nextElementSibling;
          otherInput.style.display = e.target.checked ? 'block' : 'none';
        });
      });

      // Add event listeners for POA selects
      routeDetails.querySelectorAll('.poa-select').forEach(select => {
        select.addEventListener('change', (e) => {
          const otherInput = e.target.nextElementSibling;
          otherInput.style.display = e.target.value === 'Other' ? 'block' : 'none';
        });
      });
    };

    // Make modal draggable
    let isDragging = false;
    let startX;
    let startY;
    let modalRect;

    const dragStart = (e) => {
      if (e.target.closest('button') || e.target.closest('select')) return;

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
    modal.addEventListener('touchstart', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

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
        const select = daDropdowns.querySelector(`select[data-route-code="${route.routeCode}"]`);
        const associateInfo = select ? select.value : route.associateInfo;
        
        const containers = routeDetails.querySelectorAll('div');
        const container = Array.from(containers).find(div => {
          const h4 = div.querySelector('h4');
          return h4 && h4.textContent.startsWith(route.routeCode);
        });
        
        if (!container) return `${route.routeCode}: ${associateInfo} (${route.progress})\n`;
        
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
        
        return `${route.routeCode}: ${associateInfo} (${route.progress})\nRoot Cause: ${rc}\nPoint of Action: ${poa}\n`;
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
  };

  createModal();

  const updateProgress = (message, append = true, complete = false) => {
    const progressDetails = document.getElementById("progress-details");
    const progressStatus = document.getElementById("progress-status");
    const toggleBtn = document.getElementById("toggle-progress");

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
  };

  const extractBehindProgress = (progressText) => {
    console.log("Extracting progress from text:", progressText);
    const match = progressText?.match(/(\d+)\s*behind/);
    const result = match ? `${match[1]} behind` : null;
    console.log("Extracted progress:", result);
    return result;
  };

  const cleanAssociateNames = (names) => {
    console.log("Cleaning associate names:", names);
    const cleanedNames = names.replace(/\(Cornerstone Delivery Service\)/g, "").trim();
    console.log("Cleaned associate names:", cleanedNames);
    return cleanedNames;
  };

  const extractAssociates = (container, isV1) => {
    console.log("Extracting associates. Version:", isV1 ? "V1" : "V2");
    if (isV1) {
      const associateContainer = container.querySelector(".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space");
      const tooltip = associateContainer?.nextElementSibling?.classList.contains("af-tooltip")
        ? Array.from(associateContainer.nextElementSibling.querySelectorAll("div")).map((el) =>
            cleanAssociateNames(el.textContent.trim())
          )
        : null;

      if (tooltip) {
        console.log("Extracted associates from tooltip (V1):", tooltip.join(", "));
        return tooltip.join(", ");
      }

      const associateInfo = cleanAssociateNames(associateContainer?.querySelector(".text-truncate")?.textContent.trim() || "No associate info");
      console.log("Extracted associates (V1):", associateInfo);
      return associateInfo;
    } else {
      const associates = Array.from(container.querySelectorAll(".css-1kttr4w"))
        .map((el) => cleanAssociateNames(el.textContent.trim()))
        .join(", ");
      console.log("Extracted associates (V2):", associates);
      return associates;
    }
  };

  const collectRoutes = async (selector, routes, maxScrolls = 20, scrollDelay = 100, isV1 = false) => {
    console.log("Starting route collection. Selector:", selector);
    for (let i = 0; i < maxScrolls; i++) {
      console.log(`Scroll iteration ${i + 1} of ${maxScrolls}`);
      const elements = document.querySelectorAll(selector);
      console.log(`Found ${elements.length} route elements`);

      elements.forEach((el, index) => {
        console.log(`Processing element ${index + 1} of ${elements.length}`);
        const routeCodeElem = isV1
          ? el.querySelector(".left-column.text-sm")?.firstElementChild
          : el.querySelector(".css-1nqzkik");
        const progressElem = isV1
          ? el.querySelector(".complete.h-100.d-flex.justify-content-center.align-items-center.progressStatusBar")
          : el.querySelector(".css-1xac89n.font-weight-bold");

        const routeCode = routeCodeElem?.textContent.trim() || routeCodeElem?.getAttribute("title");
        const associateInfo = extractAssociates(el, isV1);
        const progressRaw = progressElem?.textContent.trim();
        const progress = extractBehindProgress(progressRaw); // Extract only "X behind"

        console.log("Route Code:", routeCode);
        console.log("Associate Info:", associateInfo);
        console.log("Progress:", progress);

        if (routeCode) {
          const existingRouteIndex = routes.findIndex(route => route.routeCode === routeCode);
          if (existingRouteIndex === -1) {
            routes.push({ routeCode, associateInfo, progress });
            console.log("Added route:", { routeCode, associateInfo, progress });
          } else {
            console.log("Skipped duplicate route with code:", routeCode);
          }
        } else {
          console.log("Skipped route due to missing code.");
        }
      });

      elements[elements.length - 1]?.scrollIntoView({ behavior: "smooth", block: "end" });
      await new Promise((resolve) => setTimeout(resolve, scrollDelay));
    }

    updateProgress(`Collected ${routes.length} unique routes so far.`);
    console.log("Completed route collection. Total routes:", routes.length);
  };

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

    const behindRoutes = routes.filter((route) => route.progress?.includes("behind"));
    console.log("Behind Routes:", behindRoutes);

    updateProgress(`Found ${behindRoutes.length} routes that are behind schedule.`, true, true);

    if (behindRoutes.length > 0) {
      const daDropdowns = modal.querySelector("#da-dropdowns");
      
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
          select.style.padding = "8px";
          select.style.borderRadius = "4px";
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

      // Update download functionality to include header
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
          const select = daDropdowns.querySelector(`select[data-route-code="${route.routeCode}"]`);
          const associateInfo = select ? select.value : route.associateInfo;
          
          const containers = routeDetails.querySelectorAll('div');
          const container = Array.from(containers).find(div => {
            const h4 = div.querySelector('h4');
            return h4 && h4.textContent.startsWith(route.routeCode);
          });
          
          if (!container) return `${route.routeCode}: ${associateInfo} (${route.progress})\n`;
          
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
          
          return `${route.routeCode}: ${associateInfo} (${route.progress})\nRoot Cause: ${rc}\nPoint of Action: ${poa}\n`;
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
    }
  } catch (error) {
    console.error("Error during route data processing:", error);
    updateProgress(`Error: ${error.message}`);
  }
})();
