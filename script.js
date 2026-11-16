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

  let carouselTimer;

  const getScrollAmount = () => {
    const firstCard = quickLinksTrack.querySelector(".resource-card");

    if (!firstCard) {
      return 400;
    }

    const cardGap = 20;

    return firstCard.offsetWidth + cardGap;
  };

  const moveCarousel = (direction) => {
    quickLinksTrack.scrollBy({
      left: getScrollAmount() * direction,
      behavior: "smooth"
    });
  };

  const moveToNextSlide = () => {
    const nearEnd =
      quickLinksTrack.scrollLeft + quickLinksTrack.clientWidth >=
      quickLinksTrack.scrollWidth - 15;

    if (nearEnd) {
      quickLinksTrack.scrollTo({
        left: 0,
        behavior: "smooth"
      });
    } else {
      moveCarousel(1);
    }
  };

  quickLinksNext.addEventListener("click", () => {
    moveToNextSlide();
  });

  quickLinksPrevious.addEventListener("click", () => {
    const nearStart = quickLinksTrack.scrollLeft <= 15;

    if (nearStart) {
      quickLinksTrack.scrollTo({
        left: quickLinksTrack.scrollWidth,
        behavior: "smooth"
      });
    } else {
      moveCarousel(-1);
    }
  });

  const stopCarouselRotation = () => {
    window.clearInterval(carouselTimer);
  };

  const startCarouselRotation = () => {
    if (prefersReducedMotion) {
      return;
    }

    stopCarouselRotation();

    carouselTimer = window.setInterval(() => {
      moveToNextSlide();
    }, 3000);
  };

  quickLinksTrack.addEventListener("mouseenter", stopCarouselRotation);
  quickLinksTrack.addEventListener("mouseleave", startCarouselRotation);

  quickLinksTrack.addEventListener("focusin", stopCarouselRotation);
  quickLinksTrack.addEventListener("focusout", startCarouselRotation);

  quickLinksTrack.addEventListener("touchstart", stopCarouselRotation, {
    passive: true
  });

  quickLinksTrack.addEventListener("touchend", startCarouselRotation, {
    passive: true
  });

  startCarouselRotation();
}
