"use strict";

/* =========================================================
   ELEMENT REFERENCES
   ========================================================= */

const menuButton = document.getElementById("menuButton");
const menuButtonLabel = menuButton?.querySelector(".menu-button__label");
const mainNavigation = document.getElementById("mainNavigation");

const searchForm = document.getElementById("searchForm");
const hubSearch = document.getElementById("hubSearch");
const searchStatus = document.getElementById("searchStatus");

const quickLinksTrack = document.getElementById("quickLinksTrack");
const quickLinksPrevious = document.getElementById(
  "quickLinksPrevious"
);
const quickLinksNext = document.getElementById("quickLinksNext");

const prototypeToast = document.getElementById("prototypeToast");
const prototypeToastMessage = document.getElementById(
  "prototypeToastMessage"
);
const closePrototypeToast = document.getElementById(
  "closePrototypeToast"
);

const currentYear = document.getElementById("currentYear");

let toastTimer = null;

/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function isMobileNavigation() {
  return window.matchMedia("(max-width: 740px)").matches;
}

function openMenu() {
  if (!menuButton || !mainNavigation) {
    return;
  }

  mainNavigation.classList.add("is-open");
  menuButton.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");

  if (menuButtonLabel) {
    menuButtonLabel.textContent = "Close";
  }
}

function closeMenu(options = {}) {
  const { returnFocus = false } = options;

  if (!menuButton || !mainNavigation) {
    return;
  }

  mainNavigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");

  if (menuButtonLabel) {
    menuButtonLabel.textContent = "Menu";
  }

  if (returnFocus) {
    menuButton.focus();
  }
}

function toggleMenu() {
  if (!menuButton || !mainNavigation) {
    return;
  }

  const isOpen =
    menuButton.getAttribute("aria-expanded") === "true";

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuButton && mainNavigation) {
  menuButton.addEventListener("click", toggleMenu);

  mainNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (isMobileNavigation()) {
        closeMenu();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu({ returnFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (!isMobileNavigation()) {
      return;
    }

    const menuIsOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    if (!menuIsOpen) {
      return;
    }

    const clickWasInsideMenu = mainNavigation.contains(event.target);
    const clickWasOnButton = menuButton.contains(event.target);

    if (!clickWasInsideMenu && !clickWasOnButton) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileNavigation()) {
      closeMenu();
    }
  });
}

/* =========================================================
   PROTOTYPE LINK MESSAGE
   ========================================================= */

function hidePrototypeMessage() {
  if (!prototypeToast) {
    return;
  }

  prototypeToast.hidden = true;

  if (toastTimer) {
    window.clearTimeout(toastTimer);
    toastTimer = null;
  }
}

function showPrototypeMessage(message) {
  if (!prototypeToast || !prototypeToastMessage) {
    return;
  }

  const fallbackMessage =
    "This destination has not yet been connected.";

  prototypeToastMessage.textContent = message || fallbackMessage;
  prototypeToast.hidden = false;

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(() => {
    hidePrototypeMessage();
  }, 7000);
}

document.querySelectorAll(".prototype-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (href === "#" || !href) {
      event.preventDefault();

      showPrototypeMessage(
        link.dataset.prototypeMessage ||
          "This destination has not yet been connected."
      );
    }
  });
});

if (closePrototypeToast) {
  closePrototypeToast.addEventListener("click", hidePrototypeMessage);
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    prototypeToast &&
    !prototypeToast.hidden
  ) {
    hidePrototypeMessage();
  }
});

/* =========================================================
   RESOURCE CAROUSEL
   Manual controls only. No automatic rotation.
   ========================================================= */

function getResourceCards() {
  if (!quickLinksTrack) {
    return [];
  }

  return Array.from(
    quickLinksTrack.querySelectorAll(".resource-card")
  );
}

function getResourceScrollDistance() {
  const firstCard = getResourceCards()[0];

  if (!firstCard || !quickLinksTrack) {
    return 320;
  }

  const trackStyles = window.getComputedStyle(quickLinksTrack);
  const gap = Number.parseFloat(trackStyles.columnGap) || 16;

  return firstCard.getBoundingClientRect().width + gap;
}

function scrollResources(direction) {
  if (!quickLinksTrack) {
    return;
  }

  const distance = getResourceScrollDistance() * direction;

  quickLinksTrack.scrollBy({
    left: distance,
    behavior: "smooth"
  });
}

function updateResourceControls() {
  if (
    !quickLinksTrack ||
    !quickLinksPrevious ||
    !quickLinksNext
  ) {
    return;
  }

  const maxScrollLeft =
    quickLinksTrack.scrollWidth - quickLinksTrack.clientWidth;

  const isAtStart = quickLinksTrack.scrollLeft <= 4;
  const isAtEnd =
    quickLinksTrack.scrollLeft >= maxScrollLeft - 4;

  quickLinksPrevious.disabled = isAtStart;
  quickLinksNext.disabled = isAtEnd || maxScrollLeft <= 4;
}

if (
  quickLinksTrack &&
  quickLinksPrevious &&
  quickLinksNext
) {
  quickLinksPrevious.addEventListener("click", () => {
    scrollResources(-1);
  });

  quickLinksNext.addEventListener("click", () => {
    scrollResources(1);
  });

  quickLinksTrack.addEventListener(
    "scroll",
    updateResourceControls,
    { passive: true }
  );

  quickLinksTrack.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollResources(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollResources(-1);
    }

    if (event.key === "Home") {
      event.preventDefault();

      quickLinksTrack.scrollTo({
        left: 0,
        behavior: "smooth"
      });
    }

    if (event.key === "End") {
      event.preventDefault();

      quickLinksTrack.scrollTo({
        left: quickLinksTrack.scrollWidth,
        behavior: "smooth"
      });
    }
  });

  window.addEventListener("resize", updateResourceControls);

  updateResourceControls();
}

/* =========================================================
   RESOURCE SEARCH
   ========================================================= */

function clearSearchHighlights() {
  getResourceCards().forEach((card) => {
    card.classList.remove("is-search-match");
  });
}

function normaliseSearchText(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCardSearchText(card) {
  const visibleText = card.textContent || "";
  const keywords = card.dataset.resource || "";

  return normaliseSearchText(`${visibleText} ${keywords}`);
}

function findResourceMatches(searchTerm) {
  const normalisedTerm = normaliseSearchText(searchTerm);

  if (!normalisedTerm) {
    return [];
  }

  const searchWords = normalisedTerm
    .split(" ")
    .filter((word) => word.length > 0);

  return getResourceCards().filter((card) => {
    const searchableText = getCardSearchText(card);

    return searchWords.every((word) =>
      searchableText.includes(word)
    );
  });
}

function showSearchResult(matches, originalSearchTerm) {
  if (!searchStatus) {
    return;
  }

  searchStatus.classList.remove("is-error");

  if (matches.length === 1) {
    searchStatus.textContent =
      `1 resource found for “${originalSearchTerm}”.`;
    return;
  }

  searchStatus.textContent =
    `${matches.length} resources found for ` +
    `“${originalSearchTerm}”. The first result is highlighted.`;
}

function showNoSearchResult(originalSearchTerm) {
  if (!searchStatus) {
    return;
  }

  searchStatus.classList.add("is-error");
  searchStatus.textContent =
    `No resources were found for “${originalSearchTerm}”. ` +
    "Try handbook, benefits, brand, learning, policies, IT, " +
    "payroll or directory.";
}

function focusFirstSearchMatch(matches) {
  const firstMatch = matches[0];

  if (!firstMatch || !quickLinksTrack) {
    return;
  }

  matches.forEach((card) => {
    card.classList.add("is-search-match");
  });

  const trackLeft =
    quickLinksTrack.getBoundingClientRect().left;
  const cardLeft = firstMatch.getBoundingClientRect().left;
  const destination =
    quickLinksTrack.scrollLeft + cardLeft - trackLeft - 4;

  quickLinksTrack.scrollTo({
    left: destination,
    behavior: "smooth"
  });

  document
    .getElementById("quick-links")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  window.setTimeout(() => {
    firstMatch.focus({
      preventScroll: true
    });
  }, 450);
}

if (searchForm && hubSearch && quickLinksTrack) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    clearSearchHighlights();

    const originalSearchTerm = hubSearch.value.trim();

    if (!originalSearchTerm) {
      if (searchStatus) {
        searchStatus.classList.add("is-error");
        searchStatus.textContent =
          "Enter a word or phrase to search the quick links.";
      }

      hubSearch.focus();
      return;
    }

    const matches = findResourceMatches(originalSearchTerm);

    if (matches.length === 0) {
      showNoSearchResult(originalSearchTerm);
      return;
    }

    showSearchResult(matches, originalSearchTerm);
    focusFirstSearchMatch(matches);
  });

  hubSearch.addEventListener("input", () => {
    clearSearchHighlights();

    if (searchStatus) {
      searchStatus.textContent = "";
      searchStatus.classList.remove("is-error");
    }
  });

  hubSearch.addEventListener("search", () => {
    if (!hubSearch.value) {
      clearSearchHighlights();

      if (searchStatus) {
        searchStatus.textContent = "";
        searchStatus.classList.remove("is-error");
      }
    }
  });
}

/* =========================================================
   FOOTER YEAR
   ========================================================= */

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
