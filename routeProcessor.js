(async function () {
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
      <button id="close-btn" style="position: absolute; top: 10px; right: 10px; border: none; background: none; font-size: 16px; cursor: pointer;">✖</button>
      <div>
        <img src="https://crdrdispatch.github.io/GembaScript/Logo.svg" alt="Logo" style="height: 70px;">
      </div>
      <h2>Gimme That GEMBA</h2>
      <div id="progress-details"></div>
      <div id="route-dropdowns" style="display: none;">
        <h3>These routes have multiple DAs. Choose one:</h3>
      </div>
      <button id="download-btn" style="display: none;">Download</button>
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
      progressDetails.innerHTML = append
        ? progressDetails.innerHTML + `<p>${message}</p>`
        : `<p>${message}</p>`;
    }
  };

  const updateDropdowns = (routesWithDropdowns) => {
    const dropdownContainer = document.getElementById("route-dropdowns");
    dropdownContainer.innerHTML = routesWithDropdowns
      .map(
        (route, index) => `
          <div>
            <label>${route.routeCode}:</label>
            <select id="route-select-${index}">
              ${route.associates.map((a) => `<option>${a}</option>`).join("")}
            </select>
          </div>
        `
      )
      .join("");
    dropdownContainer.style.display = "block";
  };

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };

  const extractBehindProgress = (text) => {
    if (!text || typeof text !== "string") {
      return null; // Safeguard against undefined or non-string inputs
    }
    const match = text.match(/(\d+)\s*behind/);
    return match ? `${match[1]} behind` : null;
  };

  const collectRoutes = async (selector, uniqueKeys, routes, routesWithDropdowns, maxScrolls = 20, delay = 200) => {
    let totalRoutesFound = 0;

    for (let i = 0; i < maxScrolls; i++) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        const routeCodeElem = el.querySelector(".css-1nqzkik") || el.querySelector(".left-column.text-sm div:first-child");
        const progressElem = el.querySelector(".css-1xac89n.font-weight-bold");
        const routeCode = routeCodeElem?.textContent.trim() || routeCodeElem?.getAttribute("title");
        const associates = Array.from(el.querySelectorAll(".css-1kttr4w")).map((a) => a.textContent.trim());
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

      totalRoutesFound = uniqueKeys.size;
      updateProgress(`Scrolling... Step ${i + 1} of ${maxScrolls} - Found ${totalRoutesFound} routes.`, false);
      document.documentElement.scrollBy(0, 500);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    updateProgress(`Scrolling complete. Found ${totalRoutesFound} routes. Rechecking...`);
    document.documentElement.scrollTo(0, 0);

    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  try {
    console.log("Script started");

    const modal = createModal();
    updateProgress("Starting...");

    const uniqueKeys = new Set();
    const routes = [];
    const routesWithDropdowns = [];

    const selector = ".css-1muusaa";
    updateProgress(`Using selector: ${selector}`);

    await collectRoutes(selector, uniqueKeys, routes, routesWithDropdowns, 20, 200);

    updateProgress(`Found ${routes.length + routesWithDropdowns.length} routes.`);
    if (routesWithDropdowns.length > 0) {
      updateDropdowns(routesWithDropdowns);
    }

    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.style.display = "block";
    downloadBtn.addEventListener("click", () => {
      const fileContent = routes
        .map((r) => `${r.routeCode}: ${r.associate} (${r.progress})`)
        .join("\n");
      const blob = new Blob([fileContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "routes.txt";
      link.click();
    });

    updateProgress("Export ready. Click the button to download.");
  } catch (error) {
    console.error("Error during route processing:", error);
    alert(`Error: ${error.message}`);
  }
})();
