(async function () {
  const createModal = () => {
    // Create the overlay
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

    // Create the modal
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

    // Close the modal and overlay on button click
    modal.querySelector("#close-btn").addEventListener("click", () => {
      modal.remove();
      overlay.remove();
    });

    return modal;
  };

  const updateProgress = (message) => {
    const progressDetails = document.getElementById("progress-details");
    if (progressDetails) {
      progressDetails.innerHTML += `<p>${message}</p>`;
    }
  };

  const modal = createModal();
  const downloadBtn = modal.querySelector("#download-btn");

  try {
    console.log("Script started");
    updateProgress("Script started...");

    const isV1 = document.querySelector(".css-hkr77h")?.checked;
    console.log("Cortex Version:", isV1 ? "V1" : "V2");
    updateProgress(`Detected Cortex Version: ${isV1 ? "V1" : "V2"}`);

    const waitForRoutes = (timeout = 10000, interval = 500) => {
      return new Promise((resolve, reject) => {
        let foundRoutes = false;
        let elapsed = 0;

        const intervalCheck = setInterval(() => {
          const parentContainer = isV1
            ? document.querySelector(".routes-list.d-flex.flex-1.flex-column.border-y-list")
            : document.querySelector(".css-1muusaa");
          console.log("Parent container:", parentContainer);

          if (parentContainer) {
            const routeContainers = isV1
              ? Array.from(
                  parentContainer.querySelectorAll('[class^="af-link routes-list-item p-2 d-flex align-items-center w-100 route-"]')
                )
              : Array.from(parentContainer.querySelectorAll(".css-1nqzkik"));

            console.log(`Found ${routeContainers.length} valid route containers`, routeContainers);

            if (routeContainers.length > 0) {
              clearInterval(intervalCheck);
              foundRoutes = true;
              resolve(routeContainers);
            }
          }

          elapsed += interval;
          if (elapsed >= timeout) {
            clearInterval(intervalCheck);
            console.warn("Timeout reached. No route containers found.");
            reject("Timeout reached while waiting for routes.");
          }
        }, interval);
      });
    };

    const routeContainers = await waitForRoutes().catch((err) => {
      console.error(err);
      modal.querySelector("#progress-details").innerHTML = "<p>Failed to load route data. Please try again later.</p>";
      return [];
    });

    if (!routeContainers || routeContainers.length === 0) return;

    updateProgress(`Found ${routeContainers.length} routes. Processing...`);

    const results = [];
    routeContainers.forEach((container, index) => {
      console.log(`Processing container ${index + 1}`);

      // Route Code
      const routeCodeElem = isV1
        ? container.querySelector(".left-column.text-sm div:first-child")
        : container.querySelector(".css-1nqzkik");
      const routeCode = routeCodeElem?.textContent.trim();

      // Associated Info
      const associateContainer = isV1
        ? container.querySelector(".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space")
        : container.querySelector(".css-1kttr4w");
      const tooltipElem = associateContainer?.nextElementSibling?.classList.contains("af-tooltip")
        ? associateContainer.nextElementSibling.querySelectorAll("div")
        : null;
      let associateNames = tooltipElem
        ? Array.from(tooltipElem).map((el) => el.textContent.trim()).join(", ")
        : associateContainer?.textContent.trim();

      // Remove "(Cornerstone Delivery Service)"
      if (associateNames) {
        associateNames = associateNames.replace(/\(Cornerstone Delivery Service\)/g, "").trim();
      }

      // Route Progress
      const progressElem = container.querySelector(".progress");
      let progressText = progressElem?.textContent.trim();

      // Extract number before "behind" and filter routes
      const behindMatch = progressText?.match(/(\d+)\s*behind/);
      progressText = behindMatch ? `${behindMatch[1]} behind` : null;

      console.log({
        routeCode,
        associateNames,
        progressText,
      });

      // Only include routes with "behind" progress info
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
