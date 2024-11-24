(async function () {
  // Helper function: Update progress in the modal
  const updateProgress = (message, append = true) => {
    const progressDetails = document.getElementById("progress-details");
    if (progressDetails) {
      if (append) {
        progressDetails.innerHTML += `<p>${message}</p>`;
      } else {
        progressDetails.innerHTML = `<p>${message}</p>`;
      }
    }
  };

  // Helper function: Update dropdowns for routes with multiple associates
  const updateDropdowns = (routesWithDropdowns) => {
    const dropdownContainer = document.getElementById("route-dropdowns");
    if (!dropdownContainer) return;

    dropdownContainer.innerHTML = routesWithDropdowns
      .map(
        (route, index) => `
          <div style="margin-bottom: 15px;">
            <label for="route-select-${index}" style="display: block; font-weight: bold;">${route.routeCode}:</label>
            <select id="route-select-${index}" style="width: 100%; padding: 5px; border: 1px solid #ccc; border-radius: 5px;">
              ${route.associates.map((associate) => `<option value="${associate}">${associate}</option>`).join("")}
            </select>
          </div>`
      )
      .join("");

    // Make the dropdowns section visible
    dropdownContainer.style.display = "block";
  };

  // Helper function: Create the modal
  const createModal = () => {
    const overlay = document.createElement("div");
    overlay.id = "custom-overlay";
    overlay.style = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      z-index: 9999;
    `;
    document.body.appendChild(overlay);

    const modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.style = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 500px;
      max-height: 80%;
      overflow-y: auto;
      background: white;
      border: 1px solid #ccc;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      padding: 20px;
      border-radius: 10px;
      z-index: 10000;
      text-align: center;
    `;
    modal.innerHTML = `
      <button id="close-btn" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 16px; cursor: pointer;">✖</button>
      <div style="margin-bottom: 20px;">
        <img src="https://crdrdispatch.github.io/GembaScript/Logo.svg" alt="Logo" style="height: 70px; display: block; margin: 0 auto;">
      </div>
      <h2 style="font-family: Arial, sans-serif; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Gimme That GEMBA</h2>
      <div id="progress-details" style="font-family: Arial, sans-serif; text-align: left; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
        <p>Initializing...</p>
      </div>
      <div id="route-dropdowns" style="font-family: Arial, sans-serif; text-align: left; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ddd; display: none;">
        <h3 style="margin-bottom: 10px; font-size: 16px;">These routes have multiple DAs. Please choose the DA assigned to the route:</h3>
      </div>
      <button id="download-btn" style="display: none; margin: 20px auto 0; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-family: Arial, sans-serif; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);">Download File</button>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#close-btn").addEventListener("click", () => {
      modal.remove();
      overlay.remove();
    });

    return modal;
  };

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  };

  const extractBehindProgress = (progressText) => {
    if (!progressText || typeof progressText !== "string") {
      console.log("Invalid progress text:", progressText);
      return null;
    }
    const match = progressText.match(/(\d+)\s*behind/);
    console.log("Extracted progress:", progressText, "=>", match ? `${match[1]} behind` : null);
    return match ? `${match[1]} behind` : null;
  };

  const collectRoutes = async (selector, uniqueKeys, routes, routesWithDropdowns, maxScrolls = 20, scrollDelay = 200, isV1 = false) => {
    updateProgress("Scrolling to collect routes...");
    console.log("Starting route collection...");
    console.log(`Selector used: ${selector}`);

    for (let i = 0; i < maxScrolls; i++) {
      console.log(`Scroll step ${i + 1}/${maxScrolls}`);
      const elements = document.querySelectorAll(selector);
      console.log(`Found ${elements.length} route containers during scroll step ${i + 1}.`);

      elements.forEach((el, index) => {
        const routeCodeElem = isV1
          ? el.querySelector(".left-column.text-sm div:first-child")
          : el.querySelector(".css-1nqzkik");
        const progressElem = isV1
          ? el.querySelector(".progress")
          : el.querySelector(".css-1xac89n.font-weight-bold");

        const routeCode = routeCodeElem?.textContent.trim() || routeCodeElem?.getAttribute("title");
        const progress = extractBehindProgress(progressElem?.textContent.trim());

        if (routeCode && progress) {
          const associates = Array.from(el.querySelectorAll(".css-1kttr4w")).map((a) => a.textContent.trim());
          const uniqueKey = hashString(`${routeCode}-${associates.join(",")}-${progress}`);

          if (!uniqueKeys.has(uniqueKey)) {
            uniqueKeys.add(uniqueKey);
            if (associates.length > 1) {
              routesWithDropdowns.push({ routeCode, associates, progress });
              console.log(`Added route with multiple DAs: ${routeCode}`, associates, progress);
            } else {
              routes.push({ routeCode, associate: associates[0], progress });
              console.log(`Added route: ${routeCode}`, associates[0], progress);
            }
          }
        } else {
          console.log(`Skipped route container ${index + 1} due to missing code or progress.`);
        }
      });

      document.documentElement.scrollBy(0, 500);
      await new Promise((resolve) => setTimeout(resolve, scrollDelay));
    }

    updateProgress("Rechecking for missed routes...");
    console.log("Rechecking routes...");
    document.documentElement.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    updateProgress("Route collection complete.");
    console.log("Route collection complete. Total unique routes:", uniqueKeys.size);
  };

  const modal = createModal();
  const downloadBtn = modal.querySelector("#download-btn");

  try {
    console.log("Script started");
    updateProgress("Script started...");

    const isV1 = document.querySelector(".css-hkr77h")?.checked;
    console.log(`Cortex Version: ${isV1 ? "V1" : "V2"}`);

    const routeSelector = isV1
      ? '[class^="af-link routes-list-item p-2 d-flex align-items-center w-100 route-"]'
      : ".css-1muusaa";

    const uniqueKeys = new Set();
    const routes = [];
    const routesWithDropdowns = [];

    updateProgress("Collecting routes...");
    await collectRoutes(routeSelector, uniqueKeys, routes, routesWithDropdowns, 20, 200, isV1);

    console.log("Collected Routes:", routes);
    console.log("Routes with multiple DAs:", routesWithDropdowns);

    if (routesWithDropdowns.length > 0) {
      updateDropdowns(routesWithDropdowns);
    }

    downloadBtn.style.display = "block";
    downloadBtn.onclick = () => {
      routesWithDropdowns.forEach((route, index) => {
        const dropdown = document.getElementById(`route-select-${index}`);
        const selectedAssociate = dropdown?.value || "No associate info";
        routes.push({ routeCode: route.routeCode, associate: selectedAssociate, progress: route.progress });
      });

      const fileContent = routes
        .map((route) => `${route.routeCode}: ${route.associate} (${route.progress})`)
        .join("\n");

      const blob = new Blob([fileContent], { type: "text/plain" });
      const blobURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobURL;
      link.download = "behind_routes.txt";
      link.click();
      URL.revokeObjectURL(blobURL);

      console.log("Download triggered");
    };

    updateProgress("Export ready. Click the button to download.");
  } catch (error) {
    console.error("Error during route data processing:", error);
    updateProgress(`Error: ${error.message}`);
  }
})();
