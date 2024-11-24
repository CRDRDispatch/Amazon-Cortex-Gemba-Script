(async function () {
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
      <h2 style="margin-bottom: 20px;">Gimme That GEMBA</h2>
      <div id="progress-details" style="text-align: left; margin-bottom: 20px;"></div>
      <div id="route-dropdowns" style="display: none;">
        <h3>Select DA for Multiple Associates</h3>
      </div>
      <button id="download-btn" style="display: none; margin-top: 10px;">Download</button>
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
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  };

  const extractBehindProgress = (progressText) => {
    if (!progressText || typeof progressText !== "string") return null;
    const match = progressText.match(/(\d+)\s*behind/);
    return match ? `${match[1]} behind` : null;
  };

  const collectRoutes = async (selector, uniqueKeys, routes, routesWithDropdowns, maxScrolls = 20, scrollDelay = 200, isV1 = false) => {
    updateProgress("Scrolling to collect routes...");

    for (let i = 0; i < maxScrolls; i++) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
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
            } else {
              routes.push({ routeCode, associate: associates[0], progress });
            }
          }
        }
      });

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
    const routesWithDropdowns = [];
    const isV1 = document.querySelector(".css-hkr77h")?.checked;

    const selector = isV1
      ? '[class^="af-link routes-list-item p-2 d-flex align-items-center w-100 route-"]'
      : ".css-1muusaa";

    await collectRoutes(selector, uniqueKeys, routes, routesWithDropdowns, 20, 200, isV1);

    // Filter behind routes
    const behindRoutes = routes.filter((route) => route.progress.includes("behind"));
    updateProgress(`Found ${behindRoutes.length} behind routes.`);
    console.log("Behind Routes:", behindRoutes);

    if (routesWithDropdowns.length > 0) {
      const dropdownContainer = document.getElementById("route-dropdowns");
      dropdownContainer.style.display = "block";
      dropdownContainer.innerHTML = routesWithDropdowns
        .map(
          (route, index) => `
            <div>
              <label for="route-select-${index}">${route.routeCode}:</label>
              <select id="route-select-${index}">
                ${route.associates.map((associate) => `<option>${associate}</option>`).join("")}
              </select>
            </div>
          `
        )
        .join("");
    }

    const downloadBtn = document.getElementById("download-btn");
    downloadBtn.style.display = "block";
    downloadBtn.addEventListener("click", () => {
      routesWithDropdowns.forEach((route, index) => {
        const dropdown = document.getElementById(`route-select-${index}`);
        const selectedAssociate = dropdown?.value || "No associate info";
        behindRoutes.push({ routeCode: route.routeCode, associate: selectedAssociate, progress: route.progress });
      });

      const fileContent = behindRoutes.map((r) => `${r.routeCode}: ${r.associate} (${r.progress})`).join("\n");
      const blob = new Blob([fileContent], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "behind_routes.txt";
      link.click();
    });
  } catch (error) {
    console.error("Error during route processing:", error);
    updateProgress(`Error: ${error.message}`);
  }
})();
