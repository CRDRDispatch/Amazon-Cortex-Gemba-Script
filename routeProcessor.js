(async function () {
  const createModal = () => {
    const overlay = document.createElement("div");
    overlay.id = "custom-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.7)";
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
      <div style="margin-bottom: 20px;">
        <img src="https://crdrdispatch.github.io/GembaScript/Logo.svg" alt="Logo" style="height: 50px; display: block; margin: 0 auto;">
      </div>
      <h2 style="font-family: Arial, sans-serif; margin-bottom: 20px;">Gimme That GEMBA</h2>
      <div id="progress-details" style="font-family: Arial, sans-serif; text-align: left; margin-bottom: 20px;">
        <p>Initializing...</p>
      </div>
      <button id="download-btn" style="display: none; margin: 0 auto; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-family: Arial, sans-serif;">Download File</button>
      <button id="close-btn" style="margin-top: 10px; padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-family: Arial, sans-serif;">Close</button>
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

  const scrollToBottom = async (maxScrolls = 20, scrollDelay = 100) => {
    updateProgress("Scrolling...", false);
    for (let scrollCount = 0; scrollCount < maxScrolls; scrollCount++) {
      window.scrollBy(0, window.innerHeight);
      await new Promise((resolve) => setTimeout(resolve, scrollDelay));
    }
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

    await scrollToBottom(20, 100); // Faster scrolling with reduced delay
    updateProgress("Scrolling complete. Collecting elements...", false);

    const routeContainers = Array.from(document.querySelectorAll(routeSelector));
    if (!routeContainers || routeContainers.length === 0) {
      updateProgress("No routes found after scrolling.");
      return;
    }

    updateProgress(`Found ${routeContainers.length} routes. Processing...`);

    const results = [];
    const processedIds = new Set();

    routeContainers.forEach((container) => {
      if (processedIds.has(container)) return;

      processedIds.add(container);

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

      const progressElem = isV1
        ? container.querySelector(".progress")
        : container.querySelector(".css-1xac89n.font-weight-bold");
      let progressText = progressElem?.textContent.trim();

      const behindMatch = progressText?.match(/(\d+)\s*behind/);
      progressText = behindMatch ? `${behindMatch[1]} behind` : null;

      if (routeCode && progressText) {
        results.push(`${routeCode}: ${associateNames || "No associate info"} (${progressText})`);
      }
    });

    updateProgress("Processing complete.");

    if (results.length > 0) {
      updateProgress(`Exporting ${results.length} routes.`);
      const fileContent = results.join("\n");
      const blob = new Blob([fileContent], { type: "text/plain" });
      const blobURL = URL.createObjectURL(blob);

      downloadBtn.style.display = "block";
      downloadBtn.textContent = `Download (${results.length} Routes)`;
      downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "route_data.txt";
        link.click();
        URL.revokeObjectURL(blobURL);
      };
    } else {
      modal.querySelector("#progress-details").innerHTML = "<p>No relevant route data found.</p>";
    }
  } catch (error) {
    console.error("Error during route data processing:", error);
    modal.querySelector("#progress-details").innerHTML = `<p>Error: ${error.message}</p>`;
  }
})();
