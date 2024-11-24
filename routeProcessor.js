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
    overlay.style.backdropFilter = "blur(5px)";
    overlay.style.zIndex = "9999";
    document.body.appendChild(overlay);

    const modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.width = "500px";
    modal.style.maxHeight = "80%";
    modal.style.overflowY = "auto";
    modal.style.background = "white";
    modal.style.border = "1px solid #ccc";
    modal.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
    modal.style.padding = "20px";
    modal.style.borderRadius = "10px";
    modal.style.zIndex = "10000";
    modal.style.textAlign = "center";

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

  const updateDropdowns = (routesWithDropdowns) => {
    const dropdownContainer = document.getElementById("route-dropdowns");
    if (!dropdownContainer) return;

    dropdownContainer.innerHTML += routesWithDropdowns
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
    const match = progressText?.match(/(\d+)\s*behind/);
    return match ? `${match[1]} behind` : null;
  };

  const cleanAssociateNames = (names) => {
    return names.replace(/\(Cornerstone Delivery Service\)/g, "").trim();
  };

  const extractAssociates = (container, isV1) => {
    if (!isV1) {
      return Array.from(container.querySelectorAll(".css-1kttr4w"))
        .map((el) => cleanAssociateNames(el.textContent.trim()));
    }

    const associateContainer = container.querySelector(".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space");
    const tooltip = associateContainer?.nextElementSibling?.classList.contains("af-tooltip")
      ? Array.from(associateContainer.nextElementSibling.querySelectorAll("div")).map((el) =>
          cleanAssociateNames(el.textContent.trim())
        )
      : null;

    if (tooltip) {
      return tooltip;
    }

    return [cleanAssociateNames(associateContainer?.textContent.trim() || "No associate info")];
  };

  const collectRoutes = async (selector, uniqueKeys, routes, routesWithDropdowns, maxScrolls = 20, scrollDelay = 200, isV1 = false) => {
    for (let i = 0; i < maxScrolls; i++) {
      const elements = document.querySelectorAll(selector);

      elements.forEach((el) => {
        const routeCodeElem = el.querySelector(".css-1nqzkik") || el.querySelector(".left-column.text-sm div:first-child");
        const progressElem = el.querySelector(".css-1xac89n.font-weight-bold") || el.querySelector(".progress");

        const routeCode = routeCodeElem?.textContent.trim() || routeCodeElem?.getAttribute("title");
        const associates = extractAssociates(el, isV1);
        const progressRaw = progressElem?.textContent.trim();
        const progress = extractBehindProgress(progressRaw);

        const uniqueKey = hashString(`${routeCode}-${associates.join(",")}-${progress}`);
        if (!uniqueKeys.has(uniqueKey) && progress) {
          uniqueKeys.add(uniqueKey);

          if (associates.length > 1) {
            routesWithDropdowns.push({ routeCode, associates, progress });
          } else {
            routes.push({ routeCode, associate: associates[0], progress });
          }
        }
      });

      elements[elements.length - 1]?.scrollIntoView({ behavior: "smooth", block: "end" });
      updateProgress(`Scrolling... Step ${i + 1} of ${maxScrolls}`, false);
      await new Promise((resolve) => setTimeout(resolve, scrollDelay));
    }
  };

  const modal = createModal();
  const downloadBtn = modal.querySelector("#download-btn");

  try {
    console.log("Script started");
    updateProgress("Script started...");

    const isV1 = document.querySelector(".css-hkr77h")?.checked;

    const routeSelector = isV1
      ? '[class^="af-link routes-list-item p-2 d-flex align-items-center w-100 route-"]'
      : ".css-1muusaa";

    const uniqueKeys = new Set();
    const routes = [];
    const routesWithDropdowns = [];

    updateProgress("Collecting routes...");
    await collectRoutes(routeSelector, uniqueKeys, routes, routesWithDropdowns, 20, 200, isV1);

    if (routesWithDropdowns.length > 0) {
      updateDropdowns(routesWithDropdowns);

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
      };
    } else {
      downloadBtn.style.display = "block";
      const fileContent = routes
        .map((route) => `${route.routeCode}: ${route.associate} (${route.progress})`)
        .join("\n");

      const blob = new Blob([fileContent], { type: "text/plain" });
      const blobURL = URL.createObjectURL(blob);

      downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "behind_routes.txt";
        link.click();
        URL.revokeObjectURL(blobURL);
      };
    }

    updateProgress("Export ready. Click the button to download.");
  } catch (error) {
    console.error("Error during route data processing:", error);
    updateProgress(`Error: ${error.message}`);
  }
})();
