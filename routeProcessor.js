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

    const isV1 = document.querySelector(".css-hkr77h")?.checked;
    console.log("Cortex Version:", isV1 ? "V1" : "V2");

    // Use MutationObserver to wait for routes to load dynamically
    const waitForRoutes = () => {
      return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
          const routeContainers = document.querySelectorAll(
            isV1
              ? ".routes-list.d-flex.flex-1.flex-column.border-y-list > div"
              : ".css-1muusaa"
          );
          if (routeContainers.length > 0) {
            console.log(`Found ${routeContainers.length} route containers`);
            observer.disconnect();
            resolve(routeContainers);
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });
      });
    };

    const routeContainers = await waitForRoutes();
    const allRoutes = [];

    routeContainers.forEach((container, index) => {
      const routeCode = isV1
        ? container.querySelector(".left-column.text-sm")?.textContent.trim()
        : container.querySelector(".css-1nqzkik")?.textContent.trim();

      const associateContainer = isV1
        ? container.querySelector(".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space")
        : container.querySelectorAll(".css-1kttr4w");

      const tooltipElem = isV1
        ? associateContainer.nextElementSibling?.classList.contains("af-tooltip")
          ? associateContainer.nextElementSibling.querySelectorAll("div")
          : null
        : null;

      const associateNames = isV1
        ? tooltipElem
          ? Array.from(tooltipElem).map((el) => el.textContent.trim()).join(", ")
          : associateContainer.querySelector(".text-truncate")?.textContent.trim()
        : Array.from(associateContainer).map((el) => el.textContent.trim()).join(", ");

      const progressElem = isV1
        ? container.querySelector(".progress")
        : container.querySelector(".css-1xac89n.font-weight-bold");

      const progressText = progressElem?.textContent.trim();

      allRoutes.push({
        routeCode,
        associateNames,
        progressText,
      });

      console.log(`Processed Route ${index + 1}:`, {
        routeCode,
        associateNames,
        progressText,
      });
    });

    console.log("All Routes Gathered:", allRoutes);

    // Filter for routes that are "behind"
    const behindRoutes = allRoutes.filter(
      (route) => route.progressText && route.progressText.includes("behind")
    );

    console.log("Filtered Routes (Behind):", behindRoutes);

    if (behindRoutes.length > 0) {
      const fileContent = behindRoutes
        .map((route) => `${route.routeCode}: ${route.associateNames} (${route.progressText})`)
        .join("\n");

      const blob = new Blob([fileContent], { type: "text/plain" });
      const blobURL = URL.createObjectURL(blob);

      downloadBtn.style.display = "block";
      downloadBtn.textContent = `Download (${behindRoutes.length} Routes)`;
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
