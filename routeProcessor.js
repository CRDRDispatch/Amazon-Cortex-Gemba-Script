(async function () {
  const createModal = () => {
    const overlay = document.createElement("div");
    overlay.id = "custom-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9999";
    document.body.appendChild(overlay);

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

    modal.innerHTML = `
      <button id="close-btn" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 18px; cursor: pointer; color: #666; transition: color 0.2s ease;">✖</button>
      <div style="margin-bottom: 25px;">
        <img src="https://crdrdispatch.github.io/GembaScript/Logo.svg" alt="Logo" style="height: 90px; display: block; margin: 0 auto; -webkit-transform: translateZ(0); transform: translateZ(0);">
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
      </div>
      <div id="download-section" style="display: none; padding-top: 25px; border-top: 2px solid #edf2f7;">
        <button id="download-btn" style="margin: 0 auto; padding: 12px 25px; background-color: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-family: Arial, sans-serif; font-weight: 500; font-size: 15px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2); transition: all 0.2s ease;">Download File</button>
      </div>
    `;

    // Add hover effects
    const closeBtn = modal.querySelector("#close-btn");
    closeBtn.addEventListener("mouseover", () => closeBtn.style.color = "#ff4444");
    closeBtn.addEventListener("mouseout", () => closeBtn.style.color = "#666");

    const toggleBtn = modal.querySelector("#toggle-progress");
    toggleBtn.addEventListener("mouseover", () => {
      toggleBtn.style.backgroundColor = "#f0f0f0";
    });
    toggleBtn.addEventListener("mouseout", () => {
      toggleBtn.style.backgroundColor = "transparent";
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

    modal.querySelector("#close-btn").addEventListener("click", () => {
      modal.remove();
      overlay.remove();
    });

    // Add toggle functionality for progress section
    const toggleBtn = modal.querySelector("#toggle-progress");
    const progressDetails = modal.querySelector("#progress-details");
    toggleBtn.addEventListener("click", () => {
      if (progressDetails.style.display === "none") {
        progressDetails.style.display = "block";
        toggleBtn.textContent = "Hide";
      } else {
        progressDetails.style.display = "none";
        toggleBtn.textContent = "Show";
      }
    });

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

    const behindRoutes = routes.filter((route) => route.progress?.includes("behind"));
    console.log("Behind Routes:", behindRoutes);

    updateProgress(`Found ${behindRoutes.length} routes that are behind schedule.`, true, true);

    if (behindRoutes.length > 0) {
      const daSelectionSection = modal.querySelector("#da-selection-section");
      const daDropdowns = modal.querySelector("#da-dropdowns");
      const downloadSection = modal.querySelector("#download-section");
      
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

      // Show download section
      downloadSection.style.display = "block";
      const downloadBtn = modal.querySelector("#download-btn");
      downloadBtn.textContent = `Download (${behindRoutes.length} Routes)`;
      
      downloadBtn.onclick = () => {
        // Create file content with selected DAs
        const fileContent = behindRoutes.map((route) => {
          const select = daDropdowns.querySelector(`select[data-route-code="${route.routeCode}"]`);
          const associateInfo = select ? select.value : route.associateInfo;
          return `${route.routeCode}: ${associateInfo} (${route.progress})`;
        }).join("\n");

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
