(async function () {
  // Load external script dynamically
  const loadScript = async (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.type = "module";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // URLs for the external files
  const uiUrl = "https://crdrdispatch.github.io/GembaScript/ui.js";
  const logicUrl = "https://crdrdispatch.github.io/GembaScript/logic.js";

  try {
    // Load both scripts
    console.log("Loading external modules...");
    await loadScript(uiUrl);
    await loadScript(logicUrl);

    // Import modules dynamically
    const { createModal, updateProgress, updateDropdowns } = await import(uiUrl);
    const { collectRoutes, hashString, extractBehindProgress } = await import(logicUrl);

    // Initialize the modal
    const modal = createModal();
    updateProgress("Starting...");

    // Initialize route data structures
    const uniqueKeys = new Set();
    const routes = [];
    const routesWithDropdowns = [];

    // Collect routes
    await collectRoutes(
      ".css-1muusaa",
      uniqueKeys,
      routes,
      routesWithDropdowns,
      20,
      200
    );

    // Update progress
    updateProgress(`Found ${routes.length + routesWithDropdowns.length} routes.`);

    // Display dropdowns if there are multiple associates
    if (routesWithDropdowns.length > 0) {
      updateDropdowns(routesWithDropdowns);
    }

    // Add download functionality
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
    console.error("Error loading external scripts:", error);
    alert(`Failed to load external scripts: ${error.message}`);
  }
})();
