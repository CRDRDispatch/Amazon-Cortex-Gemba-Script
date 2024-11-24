(async function () {
  // Function to create a modal for progress and downloading the file
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
    // Detect if V1 or V2 is being used
    const isV1 = document.querySelector(".css-hkr77h")?.checked;

    const results = [];

    if (isV1) {
      console.log("Using V1 Cortex");

      // V1 route extraction
      const routeContainers = document.querySelectorAll(
        ".routes-list.d-flex.flex-1.flex-column.border-y-list > div"
      );

      routeContainers.forEach((container) => {
        const routeCodeElem = container.querySelector(
          ".left-column.text-sm"
        );
        const associateContainer = container.querySelector(
          ".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space"
        );
        const tooltipElem = associateContainer.nextElementSibling?.classList.contains(
          "af-tooltip"
        )
          ? associateContainer.nextElementSibling.querySelectorAll("div")
          : null;
        const progressElem = container.querySelector(".progress");

        const routeCode = routeCodeElem?.textContent.trim();
        const associateNames = tooltipElem
          ? Array.from(tooltipElem).map((el) => el.textContent.trim()).join(", ")
          : associateContainer.querySelector(".text-truncate")?.textContent.trim();
        const progressText = progressElem?.textContent.trim();

        if (routeCode && associateNames && progressText && progressText.includes("behind")) {
          results.push(`${routeCode}: ${associateNames} (${progressText})`);
        }
      });
    } else {
      console.log("Using V2 Cortex");

      // V2 route extraction
      const routeDivs = document.querySelectorAll(".css-1muusaa");

      routeDivs.forEach((routeDiv) => {
        const routeCodeElem = routeDiv.querySelector(".css-1nqzkik");
        const associateElements = routeDiv.querySelectorAll(".css-1kttr4w");
        const behindElem = routeDiv.querySelector(".css-1xac89n.font-weight-bold");

        const routeCode = routeCodeElem?.textContent.trim();
        const associateNames = Array.from(associateElements)
          .map((el) => el.textContent.trim())
          .join(", ");
        const behindText = behindElem?.textContent.trim();

        if (routeCode && associateNames && behindText && behindText.includes("behind")) {
          results.push(`${routeCode}: ${associateNames} (${behindText})`);
        }
      });
    }

    if (results.length > 0) {
      // Create a file blob for download
      const fileContent = results.join("\n");
      const blob = new Blob([fileContent], { type: "text/plain" });
      const blobURL = URL.createObjectURL(blob);

      // Enable the download button
      downloadBtn.style.display = "block";
      downloadBtn.textContent = `Download (${results.length} Routes)`;
      downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = blobURL;
        link.download = "route_data.txt";
        link.click();
        URL.revokeObjectURL(blobURL); // Clean up the blob URL
      };
    } else {
      modal.innerHTML = "<p>No relevant route data found.</p>";
    }
  } catch (error) {
    console.error("Error processing route data:", error);
    modal.innerHTML = `<p>Error: ${error.message}</p>`;
  }
})();
