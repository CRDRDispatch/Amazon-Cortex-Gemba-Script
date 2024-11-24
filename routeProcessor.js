(async function () {
  // Create a modal for progress and downloading the file
  const createModal = () => {
    const modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "white";
    modal.style.border = "1px solid #ccc";
    modal.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    modal.style.padding = "20px";
    modal.style.zIndex = 10000;
    modal.style.textAlign = "center";

    modal.innerHTML = `
      <p>Processing route data...</p>
      <button id="download-btn" style="display: none; margin-top: 10px;">Download File</button>
    `;

    document.body.appendChild(modal);
    return modal;
  };

  const modal = createModal();
  const downloadBtn = modal.querySelector("#download-btn");

  try {
    console.log("Script started");

    // Detect if using V1 Cortex
    const isV1 = document.querySelector(".css-hkr77h")?.checked;
    console.log("Cortex Version:", isV1 ? "V1" : "V2");

    const results = [];
    if (isV1) {
      console.log("Processing V1 Cortex");

      // Select route containers
      const routeContainers = document.querySelectorAll(
        ".routes-list.d-flex.flex-1.flex-column.border-y-list > div"
      );
      console.log(`Found ${routeContainers.length} route containers`);

      routeContainers.forEach((container, index) => {
        console.log(`Processing container ${index + 1}`);

        const routeCodeElem = container.querySelector(".left-column.text-sm");
        const associateContainer = container.querySelector(
          ".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space"
        );
        const tooltipElem = associateContainer?.nextElementSibling?.classList.contains("af-tooltip")
          ? associateContainer.nextElementSibling.querySelectorAll("div")
          : null;
        const progressElem = container.querySelector(".progress");

        const routeCode = routeCodeElem?.textContent.trim();
        const associateNames = tooltipElem
          ? Array.from(tooltipElem).map((el) => el.textContent.trim()).join(", ")
          : associateContainer?.querySelector(".text-truncate")?.textContent.trim();
        const progressText = progressElem?.textContent.trim();

        console.log({ routeCode, associateNames, progressText });

        if (routeCode && associateNames && progressText?.includes("behind")) {
          results.push(`${routeCode}: ${associateNames} (${progressText})`);
        }
      });
    }

    console.log("Processing complete. Results:", results);

    if (results.length > 0) {
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
      modal.innerHTML = "<p>No relevant route data found.</p>";
    }
  } catch (error) {
    console.error("Error during route data processing:", error);
    modal.innerHTML = `<p>Error: ${error.message}</p>`;
  }
})();
