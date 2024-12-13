(async function () {
  const createModal = () => {
    // Remove existing modal if it exists
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Remove existing FAB if it exists
    const existingFab = document.getElementById('gemba-fab');
    if (existingFab) {
        existingFab.remove();
    }

    const modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "min(40vw, 500px)";
    modal.style.minWidth = "400px";
    modal.style.maxWidth = "90vw";
    modal.style.height = "auto";
    modal.style.minHeight = "200px";
    modal.style.maxHeight = "80vh";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.background = "linear-gradient(to bottom, #ffffff, #fafafa)";
    modal.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)";
    modal.style.border = "1px solid rgba(0, 0, 0, 0.1)";
    modal.style.padding = "25px";
    modal.style.borderRadius = "16px";
    modal.style.zIndex = "10000";
    modal.style.overflow = "hidden";
    modal.style.resize = "both";
    modal.style.cursor = "move";
    modal.style.userSelect = "none";
    modal.style.webkitUserSelect = "none";
    modal.style.msUserSelect = "none";

    modal.innerHTML = `
      <button id="close-btn" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 20px; cursor: pointer; color: #666; transition: all 0.2s ease; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background-color: rgba(248,249,250,0.8); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.08); z-index: 10002; user-select: none;">✖</button>
      <div id="modal-content" style="flex: 1; overflow-y: auto; padding: 0 15px 0 0; margin-right: -15px; scrollbar-width: thin; scrollbar-color: #cbd5e0 #f8f9fa; user-select: none;">
        <div style="margin-bottom: 25px; cursor: move; display: flex; justify-content: center; align-items: center;">
          <img src="https://crdrdispatch.github.io/GembaScript/Logo.svg" alt="Logo" style="height: 120px; transform: translateZ(0); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); user-select: none; pointer-events: none;">
        </div>
        <p style="text-align: center; color: #374151; margin-bottom: 25px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.5;">Please make sure you're on the full "Route" view before running. Do not interact with the page until progress is complete. Once complete you may move the modal window around and resize it as needed. Thank you.</p>
        <div id="start-section" style="text-align: center; margin-bottom: 30px;">
          <button id="start-btn" style="padding: 12px 40px; background: linear-gradient(135deg, #2F855A, #276749); color: white; border: none; border-radius: 12px; cursor: pointer; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; font-size: 16px; box-shadow: 0 4px 6px rgba(47, 133, 90, 0.2); transition: all 0.2s ease;">Start Process</button>
        </div>
        <div id="progress-section" style="display: none; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <h3 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; font-size: 16px; color: #1a202c; margin: 0; font-weight: 600;">Progress</h3>
              <span id="progress-status" style="display: none; font-size: 12px; padding: 3px 10px; border-radius: 20px; background-color: #4CAF50; color: white; font-weight: 500; box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);">Complete</span>
            </div>
            <button id="toggle-progress" style="background: none; border: none; color: #666; cursor: pointer; font-size: 14px; padding: 5px 10px; border-radius: 5px; transition: background-color 0.2s ease;">Hide</button>
          </div>
          <div id="progress-details" style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: left; margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 12px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <p>Initializing...</p>
          </div>
        </div>
        <div id="da-selection-section" style="display: none; margin-bottom: 30px;">
          <h3 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; font-size: 16px; color: #1a202c; margin-bottom: 12px; font-weight: 600;">These routes have multiple DAs. Please select the DA originally assigned to the route as to avoid selecting a rescuer for the progress output.</h3>
          <div id="da-dropdowns" style="height: calc(100vh - 450px); min-height: 200px; max-height: calc(90vh - 250px); overflow-y: auto; padding: 15px; background: rgba(248,249,250,0.8); border-radius: 12px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          </div>
          <div style="margin-top: 20px; text-align: right;">
            <button id="da-next-btn" style="padding: 12px 30px; background: linear-gradient(135deg, #4CAF50, #43a047); color: white; border: none; border-radius: 12px; cursor: pointer; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Next</button>
          </div>
        </div>
        <div id="preview-section" style="display: none; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <button id="back-btn" style="padding: 8px 16px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2); transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 18px;">←</span> Back
            </button>
            <h3 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; font-size: 16px; color: #1a202c; margin: 0; font-weight: 600;">Route Details</h3>
            <div style="width: 80px;"></div>
          </div>
          <div id="route-details" style="height: calc(100vh - 450px); min-height: 200px; max-height: calc(90vh - 250px); overflow-y: auto; padding: 15px; background: rgba(255,255,255,0.8); border-radius: 12px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 1px 3px rgba(0,0,0,0.02); scrollbar-width: thin; scrollbar-color: #cbd5e0 #f8f9fa;">
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
            <button id="preview-next-btn" style="padding: 12px 30px; background: linear-gradient(135deg, #4CAF50, #43a047); color: white; border: none; border-radius: 12px; cursor: pointer; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Next</button>
          </div>
        </div>
        <div id="dsp-progress-section" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <button id="progress-back-btn" style="padding: 8px 16px; background-color: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; font-size: 14px; box-shadow: 0 2px 4px rgba(108, 117, 125, 0.2); transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 18px;">←</span> Back
            </button>
            <h3 style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; font-size: 16px; color: #1a202c; margin: 0; font-weight: 600;">DSP Total Progress</h3>
            <div style="width: 80px;"></div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
            <div class="input-group">
              <label style="display: block; margin-bottom: 8px; color: #1a202c; font-weight: 600; font-size: 14px;">In Progress:</label>
              <input type="number" id="in-progress-input" class="progress-input" style="width: 100%; padding: 10px; border: 1px solid rgba(0,0,0,0.06); border-radius: 6px; font-size: 14px;" min="0">
            </div>
            <div class="input-group">
              <label style="display: block; margin-bottom: 8px; color: #1a202c; font-weight: 600; font-size: 14px;">At Risk:</label>
              <input type="number" id="at-risk-input" class="progress-input" style="width: 100%; padding: 10px; border: 1px solid rgba(0,0,0,0.06); border-radius: 6px; font-size: 14px;" min="0">
            </div>
            <div class="input-group">
              <label style="display: block; margin-bottom: 8px; color: #1a202c; font-weight: 600; font-size: 14px;">Behind:</label>
              <input type="number" id="behind-input" class="progress-input" style="width: 100%; padding: 10px; border: 1px solid rgba(0,0,0,0.06); border-radius: 6px; font-size: 14px;" min="0">
            </div>
            <div class="input-group">
              <label style="display: block; margin-bottom: 8px; color: #1a202c; font-weight: 600; font-size: 14px;">Package Progress:</label>
              <input type="number" id="package-progress-input" class="progress-input" style="width: 100%; padding: 10px; border: 1px solid rgba(0,0,0,0.06); border-radius: 6px; font-size: 14px;" min="0" max="100">
            </div>
          </div>
          <div style="text-align: center;">
            <button id="download-btn" style="padding: 12px 30px; background: linear-gradient(135deg, #4CAF50, #43a047); color: white; border: none; border-radius: 12px; cursor: pointer; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Download File</button>
          </div>
        </div>
      </div>
    `;

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const isInResizeArea = (e) => {
      const rect = modal.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return x > rect.width - 20 && y > rect.height - 20;
    };

    const dragStart = (e) => {
      if (e.target.closest('#close-btn') || isInResizeArea(e)) {
        return;
      }
      
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      isDragging = true;
      modal.style.cursor = 'grabbing';
    };

    const dragEnd = () => {
      isDragging = false;
      modal.style.cursor = 'move';
      initialX = currentX;
      initialY = currentY;
    };

    const drag = (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        modal.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
      }
    };

    modal.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    const closeBtn = modal.querySelector("#close-btn");
    closeBtn.addEventListener("click", () => {
      modal.remove();
      createFloatingButton();
    });

    // Add hover effects
    closeBtn.addEventListener("mouseover", () => {
        closeBtn.style.backgroundColor = 'rgba(254,226,226,0.8)';
        closeBtn.style.color = '#ef4444';
        closeBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });
    closeBtn.addEventListener("mouseout", () => {
        closeBtn.style.backgroundColor = 'rgba(248,249,250,0.8)';
        closeBtn.style.color = '#666';
        closeBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
    });

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

    const nextButtons = modal.querySelectorAll("#da-next-btn, #preview-next-btn");
    nextButtons.forEach(btn => {
      btn.addEventListener("mouseover", () => {
        btn.style.backgroundColor = "#45a049";
        btn.style.boxShadow = "0 6px 8px rgba(76, 175, 80, 0.3)";
      });
      
      btn.addEventListener("mouseout", () => {
        btn.style.backgroundColor = "#4CAF50";
        btn.style.boxShadow = "0 4px 6px rgba(76, 175, 80, 0.2)";
      });
    });

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

    // Add resize observer to handle content changes
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const modalContent = entry.target;
        const modal = modalContent.parentElement;
        if (modal) {
          // Get viewport dimensions
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          // Calculate maximum dimensions
          const maxWidth = viewportWidth * 0.9;  
          const maxHeight = viewportHeight * 0.8; 
          
          // Get current dimensions
          const modalWidth = modal.offsetWidth;
          const modalHeight = modal.offsetHeight;
          
          // Apply constraints while preserving user's resize intent
          if (modalWidth > maxWidth) {
            modal.style.width = maxWidth + 'px';
          }
          if (modalHeight > maxHeight) {
            modal.style.height = maxHeight + 'px';
          }
          
          // Ensure minimum dimensions
          if (modalWidth < 400) {
            modal.style.width = '400px';
          }
          if (modalHeight < 200) {
            modal.style.height = '200px';
          }
        }
      }
    });

    const modalContent = modal.querySelector('#modal-content');
    resizeObserver.observe(modalContent);

    return modal;
  };

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
    const match = progressText?.match(/(\d+)\s*BEHIND/i);
    const result = match ? `${match[1]} BEHIND` : null;
    return result;
  };

  const cleanAssociateNames = (names) => {
    const cleanedNames = names.replace(/\(Cornerstone Delivery Service\)/g, "").trim();
    return cleanedNames;
  };

  const extractAssociates = (container, isV1) => {
    if (isV1) {
      const associateContainer = container.querySelector(".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space");
      const tooltip = associateContainer?.nextElementSibling?.classList.contains("af-tooltip")
        ? Array.from(associateContainer.nextElementSibling.querySelectorAll("div")).map((el) =>
            cleanAssociateNames(el.textContent.trim())
          )
        : null;

      if (tooltip) {
        return tooltip.join(", ");
      }

      const associateInfo = cleanAssociateNames(associateContainer?.querySelector(".text-truncate")?.textContent.trim() || "No associate info");
      return associateInfo;
    } else {
      const associates = Array.from(container.querySelectorAll(".css-1kttr4w"))
        .map((el) => cleanAssociateNames(el.textContent.trim()))
        .join(", ");
      return associates;
    }
  };

  const collectRoutes = async (selector, routes, maxScrolls = 20, scrollDelay = 100, isV1 = false) => {
    for (let i = 0; i < maxScrolls; i++) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
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

        if (routeCode) {
          const existingRouteIndex = routes.findIndex(route => route.routeCode === routeCode);
          if (existingRouteIndex === -1) {
            routes.push({ routeCode, associateInfo, progress });
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

  const modal = createModal();
  const downloadBtn = modal.querySelector("#download-btn");
  const startBtn = modal.querySelector("#start-btn");
  const progressSection = modal.querySelector("#progress-section");

  async function processRoutes() {
    try {
      updateProgress("Script started...");

      const isV1 = document.querySelector(".css-hkr77h")?.checked;
      
      // Click specific elements based on version
      if (isV1) {
        updateProgress("Processing V1 interface...");
        const containerV1 = document.querySelector('.css-1bovypj');
        if (containerV1) {
          // Get the values container divs
          const firstChildDiv = containerV1.children[0];
          const secondChildDiv = containerV1.children[1];
          const valuesV1 = firstChildDiv.querySelectorAll('.cortex-summary-bar-data-value');
          
          // Extract progress counts
          let inProgressCount = 0;
          let atRiskCount = 0;
          let behindCount = 0;
          let packageProgress = 0;
          let inProgressElement = null;
          
          if (valuesV1.length >= 5) {
            // Get In Progress count (3rd value)
            inProgressElement = valuesV1[2];
            inProgressCount = parseInt(inProgressElement.querySelector('div span')?.textContent || '0');
            
            // Get At Risk count (4th value)
            atRiskCount = parseInt(valuesV1[3].querySelector('div span')?.textContent || '0');
            
            // Get Behind count (5th value)
            behindCount = parseInt(valuesV1[4].querySelector('div span')?.textContent || '0');
          }
          
          // Get Package Progress
          const packageProgressDiv = secondChildDiv.querySelectorAll('.mr-4.my-1')[1]?.querySelector('.cortex-summary-bar-data-value');
          if (packageProgressDiv) {
            const progressText = packageProgressDiv.textContent || '0%';
            packageProgress = Math.round(parseFloat(progressText.replace('%', '')));
          }
          
          // Store the values for later use
          window.dspProgress = {
            inProgress: inProgressCount,
            atRisk: atRiskCount,
            behind: behindCount,
            packageProgress: packageProgress
          };
          
          // Click the In Progress element to show routes
          if (inProgressElement) {
            const clickTarget = inProgressElement.querySelector('div[role="button"]') || 
                              inProgressElement.querySelector('.cortex-summary-bar-data-value') ||
                              inProgressElement.firstElementChild;
            
            if (clickTarget) {
              clickTarget.click();
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        }
      } else {
        updateProgress("Processing V2 interface...");
        
        // Get all containers with class css-11ofut8
        const containersV2 = document.querySelectorAll('.css-11ofut8');
        if (containersV2.length >= 4) {
          // Extract progress counts
          let inProgressCount = 0;
          let atRiskCount = 0;
          let behindCount = 0;
          let packageProgress = 0;
          
          // Get In Progress count from first container
          const inProgressDiv = containersV2[0].querySelectorAll('.css-11ibtj8')[1];
          if (inProgressDiv) {
            inProgressCount = parseInt(inProgressDiv.querySelector('p')?.textContent || '0');
          }
          
          // Get At Risk and Behind counts from third container
          const riskBehindDivs = containersV2[2].querySelectorAll('.css-11ibtj8');
          if (riskBehindDivs.length >= 3) {
            // At Risk is second div
            atRiskCount = parseInt(riskBehindDivs[1].querySelector('p')?.textContent || '0');
            // Behind is third div
            behindCount = parseInt(riskBehindDivs[2].querySelector('p')?.textContent || '0');
          }
          
          // Get Package Progress from fourth container - Following exact path
          if (containersV2[3]) {  
            const thirdChild = Array.from(containersV2[3].children).find((child, index) => 
              index === 2 && child.classList.contains('css-1avovsw')
            );
            
            if (thirdChild) {
              const firstChild = thirdChild.firstElementChild;
              if (firstChild) {
                const ql9057Div = firstChild.querySelector('.css-ql9057');
                if (ql9057Div) {
                  const progressDiv = ql9057Div.querySelector('div');
                  if (progressDiv) {
                    const progressText = progressDiv.querySelector('p')?.textContent || '0%';
                    packageProgress = parseInt(progressText.replace('%', '') || '0');
                  }
                }
              }
            }
          }
          
          // Store the values for later use
          window.dspProgress = {
            inProgress: inProgressCount,
            atRisk: atRiskCount,
            behind: behindCount,
            packageProgress: packageProgress
          };
          
          // Click the required element (2nd css-11ibtj8 in first container)
          const clickTarget = containersV2[0].querySelectorAll('.css-11ibtj8')[1];
          if (clickTarget) {
            clickTarget.click();
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }

      updateProgress("Collecting route information...");

      const routeSelector = isV1
        ? '[class^="af-link routes-list-item p-2 d-flex align-items-center w-100 route-"]'
        : ".css-1muusaa";
      const routes = [];

      await collectRoutes(routeSelector, routes, 20, 100, isV1);

      updateProgress("Scrolling back to the top...");
      window.scrollTo({ top: 0, behavior: "smooth" });
      await new Promise((resolve) => setTimeout(resolve, 2000)); 

      updateProgress("Rechecking routes...");
      await collectRoutes(routeSelector, routes, 20, 100, isV1);

      updateProgress(`Final collection complete. Found ${routes.length} total routes.`);
      console.log("Final routes collected:", routes);

      const behindRoutes = routes.filter(route => {
        const progressText = extractBehindProgress(route.progress);
        return progressText && !progressText.startsWith('0 BEHIND');
      });
      console.log("Behind Routes:", behindRoutes);

      updateProgress(`Found ${behindRoutes.length} routes that are behind schedule.`, true, true);

      if (behindRoutes.length > 0) {
        const daSelectionSection = modal.querySelector("#da-selection-section");
        const daDropdowns = modal.querySelector("#da-dropdowns");
        
        daSelectionSection.style.display = "block";

        behindRoutes.forEach((route) => {
          const das = route.associateInfo.split(", ");
          if (das.length > 1) {
            const container = document.createElement("div");
            container.style.marginBottom = "15px";
            container.style.padding = "15px";
            container.style.background = "white";
            container.style.borderRadius = "8px";
            container.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
            container.style.border = "1px solid rgba(0,0,0,0.06)";
            
            const label = document.createElement("label");
            label.textContent = `${route.routeCode} (${route.progress}):`;
            label.style.display = "block";
            label.style.marginBottom = "8px";
            label.style.fontWeight = "600";
            label.style.color = "#1a202c";
            label.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif";
            
            const select = document.createElement("select");
            select.style.width = "100%";
            select.style.padding = "8px 12px";
            select.style.borderRadius = "6px";
            select.style.border = "1px solid rgba(0,0,0,0.06)";
            select.style.backgroundColor = "white";
            select.style.cursor = "pointer";
            select.style.color = "#1a202c";
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

        const nextBtn = modal.querySelector("#da-next-btn");
        const previewSection = modal.querySelector("#preview-section");
        const routeDetails = modal.querySelector("#route-details");

        nextBtn.addEventListener("click", () => {
          daSelectionSection.style.display = "none";
          previewSection.style.display = "block";

          behindRoutes.forEach((route) => {
            const select = daDropdowns.querySelector(`select[data-route-code="${route.routeCode}"]`);
            const associateInfo = select ? select.value : route.associateInfo;

            const container = document.createElement("div");
            container.style.marginBottom = "20px";
            container.style.padding = "15px";
            container.style.background = "white";
            container.style.borderRadius = "12px";
            container.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
            container.style.border = "1px solid rgba(0,0,0,0.06)";
            container.style.overflow = "hidden";
            container.dataset.routeCode = route.routeCode;

            container.innerHTML = `
              <div style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.16); background: rgba(248,250,252,0.8);">
                <h4 style="margin: 0; color: #1a202c; font-size: 16px; display: flex; justify-content: space-between; align-items: center;">
                  <span>${route.routeCode}: ${associateInfo}</span>
                  <span style="font-size: 14px; padding: 4px 8px; background: #ebf5ff; color: #1e40af; border-radius: 6px;">${route.progress}</span>
                </h4>
              </div>
              <div style="padding: 15px;">
                <div style="margin-bottom: 15px;">
                  <label style="display: block; margin-bottom: 8px; color: #1a202c; font-weight: 600; font-size: 14px;">Root Cause:</label>
                  <div class="rc-checkboxes" style="display: flex; flex-direction: column; gap: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: all 0.2s ease;" title="Route covers a large geographical area" onmouseover="this.style.backgroundColor='rgba(248,250,252,0.8)'" onmouseout="this.style.backgroundColor='transparent'">
                      <input type="checkbox" class="rc-checkbox" value="Route is spread out" style="cursor: pointer; width: 16px; height: 16px; border: 2px solid #64748b; border-radius: 4px; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#2F855A'" onmouseout="this.style.borderColor='#64748b'">
                      <span style="color: #374151; font-size: 14px;">Route is spread out</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: all 0.2s ease;" title="Delivery Associate's current pace is below expected rate" onmouseover="this.style.backgroundColor='rgba(248,250,252,0.8)'" onmouseout="this.style.backgroundColor='transparent'">
                      <input type="checkbox" class="rc-checkbox" value="DA is working at a slow pace" style="cursor: pointer; width: 16px; height: 16px; border: 2px solid #64748b; border-radius: 4px; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#2F855A'" onmouseout="this.style.borderColor='#64748b'">
                      <span style="color: #374151; font-size: 14px;">DA is working at a slow pace</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: all 0.2s ease;" title="Delivery Associate is experiencing technical difficulties" onmouseover="this.style.backgroundColor='rgba(248,250,252,0.8)'" onmouseout="this.style.backgroundColor='transparent'">
                      <input type="checkbox" class="rc-checkbox" value="DA is having connection issues" style="cursor: pointer; width: 16px; height: 16px; border: 2px solid #64748b; border-radius: 4px; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#2F855A'" onmouseout="this.style.borderColor='#64748b'">
                      <span style="color: #374151; font-size: 14px;">DA is having connection issues</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: all 0.2s ease;" title="Route has more packages than usual" onmouseover="this.style.backgroundColor='rgba(248,250,252,0.8)'" onmouseout="this.style.backgroundColor='transparent'">
                      <input type="checkbox" class="rc-checkbox" value="High Package Count" style="cursor: pointer; width: 16px; height: 16px; border: 2px solid #64748b; border-radius: 4px; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#2F855A'" onmouseout="this.style.borderColor='#64748b'">
                      <span style="color: #374151; font-size: 14px;">High Package Count</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: all 0.2s ease;" title="Route has more stops than usual" onmouseover="this.style.backgroundColor='rgba(248,250,252,0.8)'" onmouseout="this.style.backgroundColor='transparent'">
                      <input type="checkbox" class="rc-checkbox" value="High Stop Count" style="cursor: pointer; width: 16px; height: 16px; border: 2px solid #64748b; border-radius: 4px; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#2F855A'" onmouseout="this.style.borderColor='#64748b'">
                      <span style="color: #374151; font-size: 14px;">High Stop Count</span>
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: all 0.2s ease;" title="Specify a different root cause" onmouseover="this.style.backgroundColor='rgba(248,250,252,0.8)'" onmouseout="this.style.backgroundColor='transparent'">
                      <input type="checkbox" class="rc-checkbox other-checkbox" value="Other" style="cursor: pointer; width: 16px; height: 16px; border: 2px solid #64748b; border-radius: 4px; transition: all 0.2s ease;" onmouseover="this.style.borderColor='#2F855A'" onmouseout="this.style.borderColor='#64748b'">
                      <span style="color: #374151; font-size: 14px;">Other</span>
                    </label>
                    <div class="other-input-container" style="display: none; margin-left: 32px;">
                      <input type="text" class="other-input" style="width: calc(100% - 16px); padding: 8px 12px; border: 1px solid rgba(0,0,0,0.06); border-radius: 6px; font-size: 14px; background: rgba(248,250,252,0.8); transition: all 0.2s ease;" placeholder="Enter other root cause..." title="Specify custom root cause">
                    </div>
                  </div>
                </div>
                <div>
                  <label style="display: block; margin-bottom: 8px; color: #1a202c; font-weight: 600; font-size: 14px;">Point of Action:</label>
                  <select class="poa-select" style="width: 100%; padding: 10px 12px; border: 1px solid rgba(0,0,0,0.16); border-radius: 6px; font-size: 14px; background-color: white; cursor: pointer; color: #374151; appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px; transition: all 0.2s ease;" title="Select the current action being taken" onmouseover="this.style.borderColor='#2F855A'; this.style.boxShadow='0 0 0 1px #2F855A'" onmouseout="this.style.borderColor='rgba(0,0,0,0.16)'; this.style.boxShadow='none'">
                    <option value="">Select a point of action...</option>
                    <option value="Rescue Planned" title="A rescue has been scheduled">Rescue Planned</option>
                    <option value="Rescue Sent" title="A rescue has been dispatched">Rescue Sent</option>
                    <option value="Rescue on the way" title="Rescue is en route">Rescue on the way</option>
                    <option value="We're monitoring progress and will send a rescue if needed" title="Situation is being assessed">We're monitoring progress and will send a rescue if needed</option>
                    <option value="Route Complete" title="Route has been finished">Route Complete</option>
                    <option value="Other" title="Specify a different action">Other</option>
                  </select>
                  <div class="poa-other-container" style="display: none; margin-top: 8px;">
                    <input type="text" class="poa-other-input" style="width: 100%; padding: 10px 12px; border: 1px solid rgba(0,0,0,0.16); border-radius: 6px; font-size: 14px; background: rgba(248,250,252,0.8); color: #374151; transition: all 0.2s ease;" placeholder="Enter other point of action..." title="Specify custom action">
                  </div>
                </div>
              </div>
            `;
            const otherCheckbox = container.querySelector('.other-checkbox');
            const otherInputContainer = container.querySelector('.other-input-container');
            
            otherCheckbox.addEventListener('change', (e) => {
              otherInputContainer.style.display = e.target.checked ? 'block' : 'none';
            });

            const poaSelect = container.querySelector('.poa-select');
            const poaOtherContainer = container.querySelector('.poa-other-container');
            
            poaSelect.addEventListener('change', (e) => {
              poaOtherContainer.style.display = e.target.value === 'Other' ? 'block' : 'none';
            });

            routeDetails.appendChild(container);
          });

          const allDropdowns = daDropdowns.querySelectorAll('select');
          allDropdowns.forEach(select => {
            select.addEventListener('change', (e) => {
              const routeCode = e.target.dataset.routeCode;
              const container = routeDetails.querySelector(`div[data-route-code="${routeCode}"]`);
              if (container) {
                const h4 = container.querySelector('h4');
                const progress = h4.textContent.match(/\((.*?)\)/)[0]; 
                h4.textContent = `${routeCode}: ${e.target.value} ${progress}`;
              }
            });
          });
        });

        downloadBtn.onclick = () => {
          const now = new Date();
          const minutes = now.getMinutes();
          if (minutes >= 30) {
            now.setHours(now.getHours() + 1);
          }
          now.setMinutes(0);
          
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const year = now.getFullYear().toString().substr(-2);
          const hour = now.getHours();
          const roundedHour = hour >= 12 ? 
            `${hour === 12 ? 12 : hour - 12}PM` : 
            `${hour === 0 ? 12 : hour}AM`;
          
          const formattedDate = `${month}/${day}/${year}`;
          
          const header = `/md\n@Present\n## CRDR UPDATE - ${formattedDate} ${roundedHour}\n\n` +
                        `**IN PROGRESS: ${window.dspProgress.inProgress.toString().padStart(2, '0')}**\n` +
                        `**AT RISK: ${window.dspProgress.atRisk.toString().padStart(2, '0')}**\n` +
                        `**BEHIND: ${window.dspProgress.behind.toString().padStart(2, '0')}**\n` +
                        `**PACKAGE PROGRESS: ${window.dspProgress.packageProgress.toString().padStart(2, '0')}%**\n\n` +
                        `---\n\n`;

          const routeContent = behindRoutes.map((route) => {
            const select = daDropdowns.querySelector(`select[data-route-code="${route.routeCode}"]`);
            const associateInfo = select ? select.value : route.associateInfo;
            
            const containers = document.querySelectorAll('#route-details > div');
            const container = Array.from(containers).find(div => {
              const h4 = div.querySelector('h4 span');
              return h4 && h4.textContent.includes(route.routeCode);
            });
            
            if (!container) return `${route.routeCode}: ${associateInfo} (${route.progress})\n`;
            
            const checkedBoxes = container.querySelectorAll('input[type="checkbox"]:checked');
            const rootCauses = Array.from(checkedBoxes).map(checkbox => {
              if (checkbox.classList.contains('other-checkbox') && checkbox.checked) {
                const otherInput = container.querySelector('.other-input');
                return otherInput.value.trim() || 'Other (unspecified)';
              }
              return checkbox.value;
            }).filter(Boolean); 
            
            const rc = rootCauses.length > 0 ? rootCauses.join(', ') : 'N/A';
            
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
          link.href = blobURL;
          link.download = "behind_routes.txt";
          link.click();
          URL.revokeObjectURL(blobURL);
        };
      }

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

      const previewNextBtn = modal.querySelector("#preview-next-btn");
      previewNextBtn.addEventListener("click", () => {
        modal.querySelector("#preview-section").style.display = "none";
        modal.querySelector("#dsp-progress-section").style.display = "block";
        
        if (window.dspProgress) {
          const inProgressInput = modal.querySelector('#in-progress-input');
          const atRiskInput = modal.querySelector('#at-risk-input');
          const behindInput = modal.querySelector('#behind-input');
          const packageProgressInput = modal.querySelector('#package-progress-input');
          
          if (inProgressInput) inProgressInput.value = window.dspProgress.inProgress;
          if (atRiskInput) atRiskInput.value = window.dspProgress.atRisk;
          if (behindInput) behindInput.value = window.dspProgress.behind;
          if (packageProgressInput) packageProgressInput.value = window.dspProgress.packageProgress;
        }
      });

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

      startBtn.addEventListener("mouseover", () => {
        startBtn.style.transform = "translateY(-1px)";
        startBtn.style.boxShadow = "0 6px 8px rgba(47, 133, 90, 0.3)";
      });

      startBtn.addEventListener("mouseout", () => {
        startBtn.style.transform = "none";
        startBtn.style.boxShadow = "0 4px 6px rgba(47, 133, 90, 0.2)";
      });
    } catch (error) {
      console.error("Error in processRoutes:", error);
      updateProgress("Error: " + error.message, true, true);
    }
  };

  // Add click handler for start button
  startBtn.addEventListener("click", async () => {
    startBtn.style.display = "none";
    progressSection.style.display = "block";
    await processRoutes();  // Start the main process
  });

  // Add next button to preview section
  const previewNextBtn = modal.querySelector("#preview-next-btn");
  previewNextBtn.addEventListener("click", () => {
    modal.querySelector("#preview-section").style.display = "none";
    modal.querySelector("#dsp-progress-section").style.display = "block";
    
    // Populate DSP progress section with gathered data
    if (window.dspProgress) {
      const inProgressInput = modal.querySelector('#in-progress-input');
      const atRiskInput = modal.querySelector('#at-risk-input');
      const behindInput = modal.querySelector('#behind-input');
      const packageProgressInput = modal.querySelector('#package-progress-input');
      
      if (inProgressInput) inProgressInput.value = window.dspProgress.inProgress;
      if (atRiskInput) atRiskInput.value = window.dspProgress.atRisk;
      if (behindInput) behindInput.value = window.dspProgress.behind;
      if (packageProgressInput) packageProgressInput.value = window.dspProgress.packageProgress;
    }
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

  function createFloatingButton() {
    const fab = document.createElement('button');
    fab.id = 'gemba-fab';
    fab.innerHTML = '<span style="margin-right: 8px;">↻</span>Run AutoGemba';
    fab.title = 'Restart Auto Gemba';
    
    // Style the floating button
    Object.assign(fab.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        height: '48px',
        padding: '0 24px',
        borderRadius: '24px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        fontSize: '16px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        zIndex: '10000',
        userSelect: 'none',
        whiteSpace: 'nowrap'
    });

    // Add hover effect
    fab.onmouseenter = () => {
        fab.style.transform = 'scale(1.05)';
        fab.style.backgroundColor = '#1d4ed8';
        fab.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
    };
    fab.onmouseleave = () => {
        fab.style.transform = 'scale(1)';
        fab.style.backgroundColor = '#2563eb';
        fab.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    };

    // Add click handler to restart the process
    fab.onclick = () => {
        fab.remove();
        startProcess();
    };

    document.body.appendChild(fab);
  }

  function startProcess() {
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    const modal = createModal();
    const downloadBtn = modal.querySelector("#download-btn");
    const startBtn = modal.querySelector("#start-btn");
    const progressSection = modal.querySelector("#progress-section");

    startBtn.addEventListener("click", async () => {
      startBtn.style.display = "none";
      progressSection.style.display = "block";
      await processRoutes();  // Start the main process
    });
  }

  startProcess();
})();
