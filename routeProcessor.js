(async function () {
  // Update progress in the modal
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

  // Create the modal
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
      <button id="download-btn" style="display: none; margin: 20px auto 0; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-family: Arial, sans-serif; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);">Download File</button>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#close-btn").addEventListener("click", () => {
      modal.remove();
      overlay.remove();
    });

    return modal;
  };

  const collectRoutes = async (selector, routeCodeSelector, uniqueKeys, routes, maxScrolls = 20, scrollDelay = 200) => {
    let totalRoutes = 0;
    updateProgress("Scrolling to collect routes...");

    for (let i = 0; i < maxScrolls; i++) {
      const elements = document.querySelectorAll(selector);

      elements.forEach((el) => {
        const routeCodeElem = el.querySelector(routeCodeSelector);
        const routeCode = routeCodeElem?.textContent.trim() || routeCodeElem?.getAttribute("title");

        if (routeCode && !uniqueKeys.has(routeCode)) {
          uniqueKeys.add(routeCode);
          routes.push(routeCode);
        }
      });

      totalRoutes = uniqueKeys.size;
      updateProgress(`Found ${totalRoutes} routes so far...`, false);
      document.documentElement.scrollBy(0, 500);
      await new Promise((resolve) => setTimeout(resolve, scrollDelay));
    }

    updateProgress("Rechecking for missed routes...");
    document.documentElement.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    updateProgress("Route collection complete.");
  };

  try {
    const modal = createModal();
    updateProgress("Script started...");

    const uniqueKeys = new Set();
    const routes = [];

    // Check version and set selectors accordingly
    const isV1 = document.querySelector(".css-hkr77h")?.checked;
    const selector = isV1
      ? '[class^="af-link routes-list-item p-2 d-flex align-items-center w-100 route-"]'
      : ".css-1muusaa";
    const routeCodeSelector = isV1 ? ".left-column.text-sm div:first-child" : ".css-1nqzkik";

    updateProgress(`Collecting routes for ${isV1 ? "V1" : "V2"}...`);

    await collectRoutes(selector, routeCodeSelector, uniqueKeys, routes);

    updateProgress(`Found ${routes.length} unique routes.`);
    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.style.display = "block";
    downloadBtn.addEventListener("click", () => {
      const fileContent = routes.join("\n");
      const blob = new Blob([fileContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "routes.txt";
      link.click();
    });
  } catch (error) {
    console.error("Error during route processing:", error);
    updateProgress(`Error: ${error.message}`);
  }
})();
