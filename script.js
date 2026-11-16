const menuButton = document.getElementById("menuButton");
const mainNavigation = document.getElementById("mainNavigation");

if (menuButton && mainNavigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNavigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Close" : "Menu";
  });

  mainNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNavigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    });
  });
}

/* Resource carousel */

const resourceTrack = document.getElementById("resourceTrack");
const resourcesPrevious = document.getElementById("resourcesPrevious");
const resourcesNext = document.getElementById("resourcesNext");

if (resourceTrack && resourcesPrevious && resourcesNext) {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const getCardWidth = () => {
    const card = resourceTrack.querySelector(".resource-card");

    return card ? card.offsetWidth + 16 : 300;
  };

  const moveResources = (direction) => {
    resourceTrack.scrollBy({
      left: getCardWidth() * direction,
      behavior: "smooth"
    });
  };

  resourcesNext.addEventListener("click", () => {
    const atEnd =
      resourceTrack.scrollLeft + resourceTrack.clientWidth >=
      resourceTrack.scrollWidth - 10;

    if (atEnd) {
      resourceTrack.scrollTo({
        left: 0,
        behavior: "smooth"
      });
    } else {
      moveResources(1);
    }
  });

  resourcesPrevious.addEventListener("click", () => {
    const atStart = resourceTrack.scrollLeft <= 10;

    if (atStart) {
      resourceTrack.scrollTo({
        left: resourceTrack.scrollWidth,
        behavior: "smooth"
      });
    } else {
      moveResources(-1);
    }
  });

  let carouselTimer;

  const stopRotation = () => {
    window.clearInterval(carouselTimer);
  };

  const startRotation = () => {
    if (reducedMotion) {
      return;
    }

    stopRotation();

    carouselTimer = window.setInterval(() => {
      resourcesNext.click();
    }, 6000);
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

    const cards = [...resourceTrack.querySelectorAll(".resource-card")];

    const match = cards.find((card) => {
      const searchableText =
        `${card.textContent} ${card.dataset.resource}`.toLowerCase();

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
