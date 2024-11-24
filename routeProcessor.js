(async function () {
  const loadScript = async (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.type = "module";
      script.onload = () => {
        console.log(`Loaded script: ${src}`);
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  const uiUrl = "https://crdrdispatch.github.io/GembaScript/ui.js";
  const logicUrl = "https://crdrdispatch.github.io/GembaScript/logic.js";

  try {
    console.log("Loading external modules...");
    await loadScript(uiUrl);
    await loadScript(logicUrl);

    const { createModal, updateProgress, updateDropdowns } = await import(uiUrl);
    const { collectRoutes, extractBehindProgress } = await import(logicUrl);

    console.log("Modules loaded successfully. Initializing...");

    const modal = createModal();
    updateProgress("Starting...");

    const uniqueKeys = new Set();
    const routes = [];
    const routesWithDropdowns = [];

    // Debugging: Log selector and container details
    const selector = ".css-1muusaa";
    console.log(`Using selector: ${selector}`);
    const routeContainers = document.querySelectorAll(selector);
    console.log(`Found ${routeContainers.length} initial route containers`);

    await collectRoutes(selector, uniqueKeys, routes, routesWithDropdowns, 20, 200);

    console.log(`Routes collected: ${routes.length}`);
    console.log(`Routes with dropdowns: ${routesWithDropdowns.length}`);

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
    console.error("Error loading external scripts or processing routes:", error);
    alert(`Error: ${error.message}`);
  }
})();
