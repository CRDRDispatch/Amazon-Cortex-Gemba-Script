(async function () {
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
    const isV1 = document.querySelector(".css-hkr77h")?.checked;

    const results = [];

    if (isV1) {
      console.log("Using V1 Cortex");

      const observer = new MutationObserver((mutations, obs) => {
        const routeContainers = document.querySelectorAll(
          ".routes-list.d-flex.flex-1.flex-column.border-y-list > div"
        );
        if (routeContainers.length > 0) {
          obs.disconnect();
          console.log(`Found ${routeContainers.length} route containers`);

          routeContainers.forEach((container, index) => {
            console.log(`Processing container ${index + 1}`);
            const routeCodeElem = container.querySelector(".left-column.text-sm");
            const associateContainer = container.querySelector(".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space");
            const tooltipElem = associateContainer.nextElementSibling?.classList.contains("af-tooltip")
              ? associateContainer.nextElementSibling.querySelectorAll("div")
              : null;
            const progressElem = container.querySelector(".progress");

            const routeCode = routeCodeElem?.textContent.trim();
            const associateNames = tooltipElem
              ? Array.from(tooltipElem).map((el) => el.textContent.trim()).join(", ")
              : associateContainer.querySelector(".text-truncate")?.textContent.trim();
            const progressText = progressElem?.textContent.trim();

            console.log({ routeCode, associateNames, progressText });

            if (routeCode && associateNames && progressText && progressText.includes("behind")) {
              console.log(`Adding route: ${routeCode}`);
              results.push(`${routeCode}: ${associateNames} (${progressText})`);
            }
          });

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
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  } catch (error) {
    console.error("Error processing route data:", error);
    modal.innerHTML = `<p>Error: ${error.message}</p>`;
  }
})();
