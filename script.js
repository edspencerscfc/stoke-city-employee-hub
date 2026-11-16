const menuButton = document.getElementById("menuButton");
const mainNavigation = document.getElementById("mainNavigation");
const searchForm = document.getElementById("searchForm");
const hubSearch = document.getElementById("hubSearch");

menuButton.addEventListener("click", () => {
  const isOpen = mainNavigation.classList.toggle("is-open");

  menuButton.setAttribute("aria-expanded", isOpen);
  menuButton.textContent = isOpen ? "Close" : "Menu";
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNavigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menu";
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchTerm = hubSearch.value.trim();

  if (!searchTerm) {
    hubSearch.focus();
    return;
  }

  alert(
    `Search for "${searchTerm}" would connect to the Employee Hub search in the permanent version.`
  );
});
