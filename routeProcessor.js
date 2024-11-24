(async function () {
  console.log("Debugging V1 Route Processing");

  const routeContainers = document.querySelectorAll(
    ".routes-list.d-flex.flex-1.flex-column.border-y-list > div"
  );
  console.log(`Found ${routeContainers.length} route containers`);

  const rawData = Array.from(routeContainers).map((container, index) => {
    const routeCode = container.querySelector(".left-column.text-sm")?.textContent.trim();
    const associateContainer = container.querySelector(".ml-lg-4.ml-2.mr-2.mr-lg-auto.normal-white-space");
    const tooltipElem = associateContainer?.nextElementSibling?.classList.contains("af-tooltip")
      ? associateContainer.nextElementSibling.querySelectorAll("div")
      : null;
    const associateNames = tooltipElem
      ? Array.from(tooltipElem).map((el) => el.textContent.trim()).join(", ")
      : associateContainer?.querySelector(".text-truncate")?.textContent.trim();
    const progressText = container.querySelector(".progress")?.textContent.trim();

    return { index, routeCode, associateNames, progressText };
  });

  console.log("Raw Data:", rawData);
})();
