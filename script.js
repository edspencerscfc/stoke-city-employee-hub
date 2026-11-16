const menuButton = document.getElementById("menuButton");
const mainNavigation = document.getElementById("mainNavigation");
const searchForm = document.getElementById("searchForm");
const hubSearch = document.getElementById("hubSearch");

if (menuButton && mainNavigation) {
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

const quickLinksTrack = document.getElementById("quickLinksTrack");
const quickLinksPrevious = document.getElementById("quickLinksPrevious");
const quickLinksNext = document.getElementById("quickLinksNext");

if (quickLinksTrack && quickLinksPrevious && quickLinksNext) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const getScrollAmount = () => {
    const firstCard = quickLinksTrack.querySelector(".resource-card");

    if (!firstCard) {
      return 300;
    }

    return firstCard.offsetWidth + 16;
  };

  const moveCarousel = (direction) => {
    quickLinksTrack.scrollBy({
      left: getScrollAmount() * direction,
      behavior: "smooth"
    });
  };

  quickLinksNext.addEventListener("click", () => {
    const nearEnd =
      quickLinksTrack.scrollLeft + quickLinksTrack.clientWidth >=
      quickLinksTrack.scrollWidth - 10;

    if (nearEnd) {
      quickLinksTrack.scrollTo({
        left: 0,
        behavior: "smooth"
      });
    } else {
      moveCarousel(1);
    }
  });

  quickLinksPrevious.addEventListener("click", () => {
    const nearStart = quickLinksTrack.scrollLeft <= 10;

    if (nearStart) {
      quickLinksTrack.scrollTo({
        left: quickLinksTrack.scrollWidth,
        behavior: "smooth"
      });
    } else {
      moveCarousel(-1);
    }
  });

  let carouselTimer;

  const startCarouselRotation = () => {
    if (prefersReducedMotion) {
      return;
    }

    stopCarouselRotation();

    carouselTimer = window.setInterval(() => {
      quickLinksNext.click();
    }, 5000);
  };

  const stopCarouselRotation = () => {
    window.clearInterval(carouselTimer);
  };

  quickLinksTrack.addEventListener("mouseenter", stopCarouselRotation);
  quickLinksTrack.addEventListener("mouseleave", startCarouselRotation);

  quickLinksTrack.addEventListener("focusin", stopCarouselRotation);
  quickLinksTrack.addEventListener("focusout", startCarouselRotation);

  startCarouselRotation();
}
