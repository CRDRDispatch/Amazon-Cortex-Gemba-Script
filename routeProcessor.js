(async function () {
  const createModal = () => {
    const modal = document.createElement("div");
    modal.id = "custom-modal";
    Object.assign(modal.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%) translateZ(0)",
      width: "400px",
      background: "white",
      border: "none",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2), 0 2px 10px rgba(0, 0, 0, 0.1)",
      padding: "25px",
      borderRadius: "16px",
      zIndex: "10000",
      textAlign: "center",
      maxHeight: "90vh",
      overflowY: "auto",
      willChange: "transform",
      isolation: "isolate",
      cursor: "move"
    });

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.id = "close-btn";
    Object.assign(closeBtn.style, {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "none",
      border: "none",
      fontSize: "18px",
      cursor: "pointer",
      color: "#666",
      transition: "color 0.2s ease"
    });
    closeBtn.textContent = "✖";
    modal.appendChild(closeBtn);

    // Create logo container
    const logoContainer = document.createElement("div");
    logoContainer.style.marginBottom = "25px";
    logoContainer.style.cursor = "move";
  
    const logoImg = document.createElement("img");
    logoImg.src = "https://crdrdispatch.github.io/GembaScript/Logo.svg";
    logoImg.alt = "Logo";
    Object.assign(logoImg.style, {
      height: "90px",
      display: "block",
      margin: "0 auto",
      transform: "translateZ(0)",
      pointerEvents: "none"
    });
    logoContainer.appendChild(logoImg);
    modal.appendChild(logoContainer);

    // Create title
    const title = document.createElement("h2");
    Object.assign(title.style, {
      fontFamily: "Arial, sans-serif",
      marginBottom: "25px",
      borderBottom: "2px solid #eee",
      paddingBottom: "15px",
      color: "#2c3e50",
      fontSize: "24px"
    });
    title.textContent = "Gimme That GEMBA";
    modal.appendChild(title);

    // Create sections
    const createSection = (id, style = {}) => {
      const section = document.createElement("div");
      section.id = id;
      Object.assign(section.style, {
        marginBottom: "30px",
        display: "none",
        ...style
      });
      return section;
    };

    // Progress section
    const progressSection = createSection("progress-section", { display: "block" });
    const progressHeader = document.createElement("div");
    Object.assign(progressHeader.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px"
    });

    const progressTitle = document.createElement("div");
    progressTitle.style.display = "flex";
    progressTitle.style.alignItems = "center";
    progressTitle.style.gap = "10px";

    const progressH3 = document.createElement("h3");
    Object.assign(progressH3.style, {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      color: "#2c3e50",
      margin: "0",
      fontWeight: "600"
    });
    progressH3.textContent = "Progress";
    progressTitle.appendChild(progressH3);

    const progressStatus = document.createElement("span");
    progressStatus.id = "progress-status";
    Object.assign(progressStatus.style, {
      display: "none",
      fontSize: "12px",
      padding: "3px 10px",
      borderRadius: "20px",
      backgroundColor: "#4CAF50",
      color: "white",
      fontWeight: "500",
      boxShadow: "0 2px 4px rgba(76, 175, 80, 0.2)"
    });
    progressStatus.textContent = "Complete";
    progressTitle.appendChild(progressStatus);

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "toggle-progress";
    Object.assign(toggleBtn.style, {
      background: "none",
      border: "none",
      color: "#666",
      cursor: "pointer",
      fontSize: "14px",
      padding: "5px 10px",
      borderRadius: "5px",
      transition: "background-color 0.2s ease"
    });
    toggleBtn.textContent = "Hide";

    progressHeader.appendChild(progressTitle);
    progressHeader.appendChild(toggleBtn);
    progressSection.appendChild(progressHeader);

    const progressDetails = document.createElement("div");
    progressDetails.id = "progress-details";
    Object.assign(progressDetails.style, {
      fontFamily: "Arial, sans-serif",
      textAlign: "left",
      marginBottom: "20px",
      padding: "15px",
      background: "#f8f9fa",
      borderRadius: "12px",
      border: "1px solid #edf2f7"
    });
  
    const initText = document.createElement("p");
    initText.textContent = "Initializing...";
    progressDetails.appendChild(initText);
    progressSection.appendChild(progressDetails);

    modal.appendChild(progressSection);

    // Add remaining sections (DA Selection, Preview, DSP Progress)
    const daSelectionSection = createSection("da-selection-section");
    const previewSection = createSection("preview-section");
    const dspProgressSection = createSection("dsp-progress-section");
  
    modal.appendChild(daSelectionSection);
    modal.appendChild(previewSection);
    modal.appendChild(dspProgressSection);

    // Add event listeners
    closeBtn.addEventListener("mouseover", () => closeBtn.style.color = "#ff4444");
    closeBtn.addEventListener("mouseout", () => closeBtn.style.color = "#666");

    toggleBtn.addEventListener("mouseover", () => {
      toggleBtn.style.backgroundColor = "#f0f0f0";
    });
    toggleBtn.addEventListener("mouseout", () => {
      toggleBtn.style.backgroundColor = "transparent";
    });

    toggleBtn.addEventListener("click", () => {
      if (progressDetails.style.display === "none") {
        progressDetails.style.display = "block";
        toggleBtn.textContent = "Hide";
      } else {
        progressDetails.style.display = "none";
        toggleBtn.textContent = "Show";
      }
    });

    // Add the modal to the document body
    document.body.appendChild(modal);

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
    console.log("Extracting progress from text:", progressText);
    const match = progressText?.match(/(\d+)\s*BEHIND/i);
    const result = match ? `${match[1]} BEHIND` : null;
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

  async function collectRoutes(selector, routes, maxScrolls = 20, scrollDelay = 100, isV1 = false) {
    const container = document.querySelector(selector);
    if (!container) {
      throw new Error(`Container not found with selector: ${selector}`);
    }

    let lastHeight = container.scrollHeight;
    let scrollCount = 0;
    let noNewContentCount = 0;

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      while (scrollCount < maxScrolls) {
        // Extract current visible routes
        const routeElements = container.querySelectorAll(isV1 ? '[data-testid="route-card"]' : '.css-175xrm9');
        for (const element of routeElements) {
          const routeCode = isV1
            ? element.querySelector('[data-testid="route-code"]')?.textContent?.trim()
            : element.querySelector('.css-1qmjxm9')?.textContent?.trim();

          if (!routeCode || routes.some(r => r.routeCode === routeCode)) continue;

          const progressElement = element.querySelector(isV1 ? '[data-testid="route-progress"]' : '.css-1j1ehm7');
          if (!progressElement) continue;

          const progress = progressElement.textContent.trim();
          if (!progress.includes('behind')) continue;

          const associateInfo = await extractAssociates(element, isV1);
          routes.push({ routeCode, progress, associateInfo });
        }

        // Scroll and wait
        container.scrollTop = container.scrollHeight;
        await wait(scrollDelay);

        // Check if we've reached the bottom
        if (container.scrollHeight === lastHeight) {
          noNewContentCount++;
          if (noNewContentCount >= 3) break; // Break if no new content after 3 attempts
        } else {
          noNewContentCount = 0;
          lastHeight = container.scrollHeight;
        }

        scrollCount++;
      }

      return routes;
    } catch (error) {
      console.error('Error in collectRoutes:', error);
      throw error;
    }
  }

  try {
    console.log("Script started");
    const modal = createModal();
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
      const downloadBtn = modal.querySelector("#download-btn");
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
              return otherInput.value.trim() || 'Other (unspecified)';
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
})();
