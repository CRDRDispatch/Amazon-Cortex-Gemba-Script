(() => {
  console.log("Script started...");

  // Create a modal for progress
  const createModal = () => {
    console.log("Creating modal...");
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

  const waitForElements = (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          clearInterval(interval);
          resolve(elements);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          reject(new Error(`Timeout: No elements found for selector "${selector}"`));
        }
      }, 100);
    });
  };

  const modal = createModal();
  const downloadBtn = modal.querySelector("#download-btn");

  (async function () {
    try {
      console.log("Waiting for route elements...");
      const routeDivs = await waitForElements(".css-1muusaa");

      console.log(`Found ${routeDivs.length} route elements.`);
      const results = [];

      // Extract data from each route div
      routeDivs.forEach((routeDiv, index) => {
        console.log(`Processing route ${index + 1}...`);
        const routeCodeElem = routeDiv.querySelector(".css-1nqzkik");
        const associateNameElems = routeDiv.querySelectorAll(".css-1kttr4w");
        const behindElem = routeDiv.querySelector(".css-1xac89n.font-weight-bold");

        const routeCode = routeCodeElem ? routeCodeElem.textContent.trim() : null;
        const associateNames = associateNameElems
          ? Array.from(associateNameElems).map(el => el.textContent.trim()).join(", ")
          : null;
        const behindText = behindElem ? behindElem.textContent.trim() : null;

        console.log({ routeCode, associateNames, behindText });

        if (routeCode && associateNames && behindText && behindText.includes("behind")) {
          results.push(`${routeCode}: ${associateNames} (${behindText})`);
        }
      });

      console.log("Route processing complete:", results);

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
})();
