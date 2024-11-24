// ui.js

// Creates the modal and overlay
export const createModal = () => {
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

// Updates the progress section in the modal
export const updateProgress = (message, append = true) => {
  const progressDetails = document.getElementById("progress-details");
  if (progressDetails) {
    progressDetails.innerHTML = append
      ? progressDetails.innerHTML + `<p>${message}</p>`
      : `<p>${message}</p>`;
  }
};

// Updates the dropdown section for routes with multiple DAs
export const updateDropdowns = (routesWithDropdowns) => {
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
