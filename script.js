const menuButton = document.getElementById("menuButton");
const mainNavigation = document.getElementById("mainNavigation");
const searchForm = document.getElementById("searchForm");
const hubSearch = document.getElementById("hubSearch");

if (menuButton && mainNavigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNavigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Close" : "Menu";
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
  mainNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNavigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
@@ -20,102 +18,127 @@ if (menuButton && mainNavigation) {
  });
}

if (searchForm && hubSearch) {
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
}

/* Quick Links carousel */
/* Resource carousel */

const quickLinksTrack = document.getElementById("quickLinksTrack");
const quickLinksPrevious = document.getElementById("quickLinksPrevious");
const quickLinksNext = document.getElementById("quickLinksNext");
const resourceTrack = document.getElementById("resourceTrack");
const resourcesPrevious = document.getElementById("resourcesPrevious");
const resourcesNext = document.getElementById("resourcesNext");

if (quickLinksTrack && quickLinksPrevious && quickLinksNext) {
  const prefersReducedMotion = window.matchMedia(
if (resourceTrack && resourcesPrevious && resourcesNext) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const getScrollAmount = () => {
    const firstCard = quickLinksTrack.querySelector(".resource-card");
  const getCardWidth = () => {
    const card = resourceTrack.querySelector(".resource-card");

    if (!firstCard) {
      return 300;
    }

    return firstCard.offsetWidth + 16;
    return card ? card.offsetWidth + 16 : 300;
  };

  const moveCarousel = (direction) => {
    quickLinksTrack.scrollBy({
      left: getScrollAmount() * direction,
  const moveResources = (direction) => {
    resourceTrack.scrollBy({
      left: getCardWidth() * direction,
      behavior: "smooth"
    });
  };

  quickLinksNext.addEventListener("click", () => {
    const nearEnd =
      quickLinksTrack.scrollLeft + quickLinksTrack.clientWidth >=
      quickLinksTrack.scrollWidth - 10;
  resourcesNext.addEventListener("click", () => {
    const atEnd =
      resourceTrack.scrollLeft + resourceTrack.clientWidth >=
      resourceTrack.scrollWidth - 10;

    if (nearEnd) {
      quickLinksTrack.scrollTo({
    if (atEnd) {
      resourceTrack.scrollTo({
        left: 0,
        behavior: "smooth"
      });
    } else {
      moveCarousel(1);
      moveResources(1);
    }
  });

  quickLinksPrevious.addEventListener("click", () => {
    const nearStart = quickLinksTrack.scrollLeft <= 10;
  resourcesPrevious.addEventListener("click", () => {
    const atStart = resourceTrack.scrollLeft <= 10;

    if (nearStart) {
      quickLinksTrack.scrollTo({
        left: quickLinksTrack.scrollWidth,
    if (atStart) {
      resourceTrack.scrollTo({
        left: resourceTrack.scrollWidth,
        behavior: "smooth"
      });
    } else {
      moveCarousel(-1);
      moveResources(-1);
    }
  });

  let carouselTimer;

  const startCarouselRotation = () => {
    if (prefersReducedMotion) {
  const stopRotation = () => {
    window.clearInterval(carouselTimer);
  };

  const startRotation = () => {
    if (reducedMotion) {
      return;
    }

    stopCarouselRotation();
    stopRotation();

    carouselTimer = window.setInterval(() => {
      quickLinksNext.click();
    }, 5000);
      resourcesNext.click();
    }, 6000);
  };

  const stopCarouselRotation = () => {
    window.clearInterval(carouselTimer);
  };
  resourceTrack.addEventListener("mouseenter", stopRotation);
  resourceTrack.addEventListener("mouseleave", startRotation);
  resourceTrack.addEventListener("focusin", stopRotation);
  resourceTrack.addEventListener("focusout", startRotation);

  startRotation();
}

/* Resource search */

const searchForm = document.getElementById("searchForm");
const hubSearch = document.getElementById("hubSearch");

if (searchForm && hubSearch && resourceTrack) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchTerm = hubSearch.value.trim().toLowerCase();

    if (!searchTerm) {
      hubSearch.focus();
      return;
    }

  quickLinksTrack.addEventListener("mouseenter", stopCarouselRotation);
  quickLinksTrack.addEventListener("mouseleave", startCarouselRotation);
    const cards = [...resourceTrack.querySelectorAll(".resource-card")];

  quickLinksTrack.addEventListener("focusin", stopCarouselRotation);
  quickLinksTrack.addEventListener("focusout", startCarouselRotation);
    const match = cards.find((card) => {
      const searchableText =
        `${card.textContent} ${card.dataset.resource}`.toLowerCase();

  startCarouselRotation();
      return searchableText.includes(searchTerm);
    });

    if (match) {
      document.getElementById("resources").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      window.setTimeout(() => {
        resourceTrack.scrollTo({
          left: match.offsetLeft - resourceTrack.offsetLeft,
          behavior: "smooth"
        });

        match.focus({ preventScroll: true });
      }, 500);
    } else {
      alert(
        `No matching resource was found for "${hubSearch.value}". Please try handbook, benefits, brand, learning, IT, payroll or directory.`
      );
    }
  });
}
