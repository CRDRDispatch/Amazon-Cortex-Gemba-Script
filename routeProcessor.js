(async function() {
  console.log("Script loaded and running");

  // Test for element selection
  const routeDivs = document.querySelectorAll(".css-1muusaa");
  console.log(`Found ${routeDivs.length} route divs`);

  // Example output
  routeDivs.forEach((div, index) => {
    console.log(`Route ${index + 1}:`, div.textContent.trim());
  });

  alert("Script execution completed.");
})();
