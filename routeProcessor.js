(() => {
  console.log("Script started...");

  // Create the modal for progress
  const createModal = () => {
    console.log("Creating modal...");

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "custom-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = 9999;
    document.body.appendChild(overlay);

    // Create modal container
    const modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.background = "white";
    modal.style.border = "1px solid #ccc";
    modal.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    modal.style.borderRadius = "8px";
    modal.style.padding = "20px";
    modal.style.width = "400px"; // Adjust modal size
    modal.style.textAlign = "center";
    modal.style.zIndex = 10000;

    // Add logo
    const logo = document.createElement("img");
    logo.src = "https://crdrdispatch.github.io/GembaScript/Logo.svg";
    logo.alt = "Company Logo";
    logo.style.width = "150px";
    logo.style.marginBottom = "20px";
    modal.appendChild(logo);

    // Add text
    const message = document.createElement("p");
    message.textContent = "Processing route data...";
    modal.appendChild(message);

    // Add close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.marginTop = "20px";
    closeButton.style.backgroundColor = "#007bff";
    closeButton.style.color = "white";
    closeButton.style.border = "none";
    closeButton.style.padding = "10px 20px";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = () => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    };
    modal.appendChild(closeButton);

    // Add download button (initially hidden)
    const downloadBtn = document.createElement("button");
    downloadBtn.id = "download-btn";
    downloadBtn.style.display = "none";
    downloadBtn.style.marginTop = "10px";
    downloadBtn.style.backgroundColor = "#28a745";
    downloadBtn.style.color = "white";
    downloadBtn.style.border = "none";
    downloadBtn.style.padding = "10px 20px";
    downloadBtn.style.borderRadius = "5px";
    downloadBtn.style.cursor = "pointer";
    modal.appendChild(downloadBtn);

    document.body.appendChild(modal);

    return { modal, downloadBtn };
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

  const { modal, downloadBtn } = createModal();

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
        modal.querySelector("p").textContent = "No relevant route data found.";
      }
    } catch (error) {
      console.error("Error processing route data:", error);
      modal.querySelector("p").textContent = `Error: ${error.message}`;
    }
  })();
})();
