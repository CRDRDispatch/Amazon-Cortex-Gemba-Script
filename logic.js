// logic.js

// Hash function for deduplication
export const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

// Extracts the "behind" progress text
export const extractBehindProgress = (text) => {
  const match = text.match(/(\d+)\s*behind/);
  return match ? `${match[1]} behind` : null;
};

// Cleans associate names
export const cleanAssociateNames = (names) => {
  return names.replace(/\(Cornerstone Delivery Service\)/g, "").trim();
};

// Collects routes
export const collectRoutes = async (selector, uniqueKeys, routes, routesWithDropdowns, maxScrolls = 20, delay = 200, isV1 = false) => {
  for (let i = 0; i < maxScrolls; i++) {
    document.querySelectorAll(selector).forEach((el) => {
      const routeCodeElem = el.querySelector(".css-1nqzkik") || el.querySelector(".left-column.text-sm div:first-child");
      const progressElem = el.querySelector(".css-1xac89n.font-weight-bold");
      const routeCode = routeCodeElem?.textContent.trim() || routeCodeElem?.getAttribute("title");
      const associates = Array.from(el.querySelectorAll(".css-1kttr4w")).map((a) => cleanAssociateNames(a.textContent.trim()));
      const progressRaw = progressElem?.textContent.trim();
      const progress = extractBehindProgress(progressRaw);

      const uniqueKey = hashString(`${routeCode}-${associates.join(",")}-${progress}`);
      if (!uniqueKeys.has(uniqueKey) && progress) {
        uniqueKeys.add(uniqueKey);

        if (associates.length > 1) {
          routesWithDropdowns.push({ routeCode, associates, progress });
        } else {
          routes.push({ routeCode, associate: associates[0], progress });
        }
      }
    });
    document.documentElement.scrollBy(0, 500);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  document.documentElement.scrollTo(0, 0);
};
