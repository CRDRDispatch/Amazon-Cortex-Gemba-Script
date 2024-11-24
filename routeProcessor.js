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

    // Make modal draggable
    let isDragging = false;
    let startX;
    let startY;
    let modalRect;

    const dragStart = (e) => {
      if (e.target.closest('button') || e.target.closest('select')) return;  // Don't drag when clicking buttons or dropdowns

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

      // Keep modal within viewport bounds
      const modalWidth = modalRect.width;
      const modalHeight = modalRect.height;
      const maxX = window.innerWidth - modalWidth;
      const maxY = window.innerHeight - modalHeight;

      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      modal.style.left = x + 'px';
      modal.style.top = y + 'px';
      modal.style.transform = 'none';
      modal.style.webkitTransform = 'none';
    };

    // Add passive event listeners for better performance
    modal.addEventListener("touchstart", dragStart, { passive: false });
    modal.addEventListener("touchend", dragEnd);
    modal.addEventListener("touchmove", drag, { passive: false });
    document.addEventListener("mousedown", (e) => {
      if (modal.contains(e.target)) dragStart(e);
    });
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);

    // Clean up event listeners when modal is closed
    modal.querySelector("#close-btn").addEventListener("click", () => {
      document.removeEventListener("mousedown", dragStart);
      document.removeEventListener("mouseup", dragEnd);
      document.removeEventListener("mousemove", drag);
      modal.remove();
    });

    // Initialize sections
    const initialSection = modal.querySelector("#initial-section");
    const daSelectionSection = modal.querySelector("#da-selection-section");
    const routeDetailsSection = modal.querySelector("#route-details-section");
    const dspProgressSection = modal.querySelector("#dsp-progress-section");

    // Set initial visibility
    initialSection.style.display = "block";
    daSelectionSection.style.display = "none";
    routeDetailsSection.style.display = "none";
    dspProgressSection.style.display = "none";

    // Navigation event handlers
    const scanBtn = modal.querySelector("#scan-btn");
    scanBtn.addEventListener("click", async () => {
      initialSection.style.display = "none";
      daSelectionSection.style.display = "block";
    });

    nextBtn.addEventListener("click", () => {
      daSelectionSection.style.display = "none";
      routeDetailsSection.style.display = "block";
      
      // Update route details content
      if (behindRoutes && behindRoutes.length) {
        const routeDetails = modal.querySelector("#route-details");
        routeDetails.innerHTML = behindRoutes.map((route) => {
          const select = daDropdowns.querySelector(`select[data-route-code="${route.routeCode}"]`);
          const associateInfo = select ? select.value : route.associateInfo;
          
          return `
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h4 style="margin: 0 0 15px 0; color: #2c3e50; font-family: Arial, sans-serif; font-size: 16px; display: flex; justify-content: space-between;">
                <span>${route.routeCode}: ${associateInfo}</span>
                <span style="color: #e74c3c;">${route.progress}</span>
              </h4>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; font-weight: 600; color: #2c3e50;">Root Cause:</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                  <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" class="rc-checkbox" value="Route is spread out" style="width: 16px; height: 16px;">
                    Route is spread out
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" class="rc-checkbox" value="DA is working at a slow pace" style="width: 16px; height: 16px;">
                    DA is working at a slow pace
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" class="rc-checkbox" value="DA is having connection issues" style="width: 16px; height: 16px;">
                    DA is having connection issues
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" class="rc-checkbox" value="High Package Count" style="width: 16px; height: 16px;">
                    High Package Count
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" class="rc-checkbox" value="High Stop Count" style="width: 16px; height: 16px;">
                    High Stop Count
                  </label>
                  <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" class="rc-checkbox" value="Other" style="width: 16px; height: 16px;">
                    Other
                  </label>
                </div>
                <input type="text" class="other-input" placeholder="Specify other root cause..." style="margin-top: 10px; width: calc(100% - 24px); padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; display: none;">
              </div>
              
              <div>
                <p style="margin: 0 0 10px 0; font-weight: 600; color: #2c3e50;">Point of Action:</p>
                <select class="poa-select" style="width: 100%; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; margin-bottom: 10px;">
                  <option value="">Select point of action...</option>
                  <option value="Rescue Planned">Rescue Planned</option>
                  <option value="Rescue Sent">Rescue Sent</option>
                  <option value="Rescue on the way">Rescue on the way</option>
                  <option value="Monitoring progress">Monitoring progress</option>
                  <option value="Route Complete">Route Complete</option>
                  <option value="Other">Other</option>
                </select>
                <input type="text" class="poa-other-input" placeholder="Specify other point of action..." style="width: calc(100% - 24px); padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; display: none;">
              </div>
            </div>
          `;
        }).join('');

        // Add event listeners for "Other" options
        routeDetails.querySelectorAll('.rc-checkbox[value="Other"]').forEach(checkbox => {
          const otherInput = checkbox.closest('div').nextElementSibling;
          checkbox.addEventListener('change', () => {
            otherInput.style.display = checkbox.checked ? 'block' : 'none';
          });
        });

        routeDetails.querySelectorAll('.poa-select').forEach(select => {
          const otherInput = select.nextElementSibling;
          select.addEventListener('change', () => {
            otherInput.style.display = select.value === 'Other' ? 'block' : 'none';
          });
        });
      }
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
  };

  createModal();
})();
