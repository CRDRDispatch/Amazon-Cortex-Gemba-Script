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
    modal.style.width = "400px";
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
      <h2 style="font-family: Arial, sans-serif; margin-bottom: 20px;">Gimme That GEMBA</h2>
      <div id="progress-details" style="font-family: Arial, sans-serif; text-align: left; margin-bottom: 20px;">
        <p>Initializing...</p>
      </div>
      <button id="download-btn" style="display: none; margin: 0 auto; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-family: Arial, sans-serif; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);">Download File</button>
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

  const collectRoutes = async (selector, uniqueRoutes, maxScrolls = 20, scrollDelay = 100) => {
    for (let i = 0; i < maxScrolls; i++) {
      const elements = document.querySelectorAll(selector);

      elements.forEach((el) => {
        const id = el.getAttribute("id") || el.getAttribute("data-id") || el.outerHTML;
        if (!uniqueRoutes.has(id)) {
          uniqueRoutes.add(id);
        }
      });

      elements[elements.length - 1]?.scrollIntoView({ behavior: "smooth", block: "end" });
      await new Promise((resolve) => setTimeout(resolve, scrollDelay));
    }

    updateProgress(`Collected ${uniqueRoutes.size} unique routes so far.`);
  };

  const modal = createModal();
  const downloadBtn = modal.querySelector("#download-btn");

  try {
    console.log("Script started");
    updateProgress("Script started...");

    const isV1 = document.querySelector(".css-hkr77h")?.checked;
    updateProgress(`Detected Cortex Version: ${isV1 ? "V1" : "V2"}`);

    const routeSelector = isV1
      ? '[class^="af-link routes-list-item p-2 d-flex align-items-center w-100 route-"]'
      : ".css-1muusaa";

    const uniqueRoutes = new Set();

    updateProgress("Scrolling to collect routes...");
    await collectRoutes(routeSelector, uniqueRoutes, 20, 100);

    updateProgress("Scrolling back to the top...");
    window.scrollTo({ top: 0, behavior: "smooth" });
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for everything to load again

    updateProgress("Rechecking routes...");
    await collectRoutes(routeSelector, uniqueRoutes, 20, 100);

    updateProgress(`Final collection complete. ${uniqueRoutes.size} unique routes found.`);

    const results = [];
    uniqueRoutes.forEach((route) => {
      // Example placeholder for extracting data for each route
      const container = document.querySelector(`[data-id="${route}"]`) || document.querySelector(`#${route}`);
      if (!container) return;

      const progressElem = isV1
        ? container.querySelector(".progress")
        : container.querySelector(".css-1xac89n.font-weight-bold");
      let progressText = progressElem?.textContent.trim();

      const behindMatch = progressText?.match(/(\d+)\s*behind/);
      progressText = behindMatch ? `${behindMatch[1]} behind` : null;

      // Only export routes with "behind" progress
      if (progressText) {
        const routeCodeElem = isV1
          ? container.querySelector(".left-column.text-sm div:first-child")
          : container.querySelector(".css-1nqzkik");
        const routeCode = isV1
          ? routeCodeElem?.textContent.trim()
          : routeCodeElem?.getAttribute("title")?.trim();

        const associateContainers = isV1
          ? container.querySelector(".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space")
          : container.querySelectorAll(".css-1kttr4w");
        const associateNames = Array.from(associateContainers || [])
          .map((el) => el.textContent.trim())
          .join(", ");

        results.push(`${routeCode}: ${associateNames || "No associate info"} (${progressText})`);
      }
    });

    if (results.length > 0) {
      const fileContent = results.join("\n");
      const blob = new Blob([fileContent], { type: "text/plain" });
      const blobURL = URL.createObjectURL(blob);

      downloadBtn.style.display = "block";
      downloadBtn.textContent = `Download (${results.length} Routes)`;
      downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "behind_routes.txt";
        link.click();
        URL.revokeObjectURL(blobURL);
      };

      updateProgress(`Exporting ${results.length} behind routes.`);
    } else {
      updateProgress("No behind routes found.");
    }
  } catch (error) {
    console.error("Error during route data processing:", error);
    updateProgress(`Error: ${error.message}`);
  }
})();
