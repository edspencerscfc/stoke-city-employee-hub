"use strict";

/* =========================================================
   EDITABLE TICKER CONTENT

   Update this array whenever a result or staff notice changes.
   The ticker is generated automatically from these entries.

   Types:
   - "result"
   - "notice"
   ========================================================= */

const tickerItems = [
  {
    type: "result",
    label: "First Team",
    text: "Portsmouth 1–2 Stoke City"
  },
  {
    type: "result",
    label: "Women",
    text: "Stoke City Women 6–1 Liverpool Feds"
  },
  {
    type: "result",
    label: "Under-21s",
    text: "Stoke City U21 1–4 Fulham U21"
  },
  {
    type: "notice",
    label: "Staff Notice",
    text: "Planned system maintenance this Friday from 6pm"
  },
  {
    type: "notice",
    label: "Reminder",
    text: "Complete mandatory staff training by 4 December"
  },
  {
    type: "notice",
    label: "People Team",
    text: "Benefits enrolment closes on 30 November"
  },
  {
    type: "notice",
    label: "Finance",
    text: "Submit December expense claims by 15 December"
  }
];

/* =========================================================
   ELEMENT REFERENCES
   ========================================================= */

const menuButton = document.getElementById("menuButton");
const menuButtonLabel = menuButton?.querySelector(
  ".menu-button__label"
);
const mainNavigation = document.getElementById("mainNavigation");

const ticker = document.querySelector(".ticker");
const tickerTrack = document.getElementById("tickerTrack");
const tickerViewport = document.getElementById("tickerViewport");
const tickerControl = document.getElementById("tickerControl");
const tickerControlText = tickerControl?.querySelector(
  ".ticker__control-text"
);

const searchForm = document.getElementById("searchForm");
const hubSearch = document.getElementById("hubSearch");
const searchStatus = document.getElementById("searchStatus");

const quickLinksTrack = document.getElementById("quickLinksTrack");
const quickLinksPrevious = document.getElementById(
  "quickLinksPrevious"
);
const quickLinksNext = document.getElementById("quickLinksNext");
const resourceAutoplay = document.getElementById(
  "resourceAutoplay"
);
const resourceCurrent = document.getElementById("resourceCurrent");
const resourceTotal = document.getElementById("resourceTotal");

const prototypeToast = document.getElementById("prototypeToast");
const prototypeToastMessage = document.getElementById(
  "prototypeToastMessage"
);
const closePrototypeToast = document.getElementById(
  "closePrototypeToast"
);

const currentYear = document.getElementById("currentYear");

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let toastTimer = null;
let resourceTimer = null;
let resourceAutoplayPaused = false;
let resourceInteractionPaused = false;

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

function closeMenu(returnFocus = false) {
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
  const isOpen =
    menuButton?.getAttribute("aria-expanded") === "true";

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
      closeMenu(true);
    }
  });

  document.addEventListener("click", (event) => {
    if (!isMobileNavigation()) {
      return;
    }

    const menuIsOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    if (
      menuIsOpen &&
      !mainNavigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
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
   MOVING STAFF TICKER
   ========================================================= */

function createTickerItem(item) {
  const tickerItem = document.createElement("span");
  tickerItem.className = `ticker__item ticker__item--${item.type}`;

  const badge = document.createElement("strong");
  badge.className = "ticker__badge";
  badge.textContent = item.label;

  const text = document.createElement("span");
  text.className = "ticker__text";
  text.textContent = item.text;

  const separator = document.createElement("span");
  separator.className = "ticker__separator";
  separator.setAttribute("aria-hidden", "true");
  separator.textContent = "•";

  tickerItem.append(badge, text, separator);

  return tickerItem;
}

function createTickerGroup(isDuplicate = false) {
  const group = document.createElement("div");
  group.className = "ticker__group";

  if (isDuplicate) {
    group.classList.add("ticker__group--duplicate");
    group.setAttribute("aria-hidden", "true");
  }

  tickerItems.forEach((item) => {
    group.appendChild(createTickerItem(item));
  });

  return group;
}

function renderTicker() {
  if (!tickerTrack) {
    return;
  }

  tickerTrack.replaceChildren(
    createTickerGroup(false),
    createTickerGroup(true)
  );

  window.requestAnimationFrame(() => {
    const firstGroup = tickerTrack.querySelector(".ticker__group");

    if (!firstGroup) {
      return;
    }

    /*
      Roughly 75 pixels per second creates a steady news-style
      movement without racing through the messages.
    */
    const duration = Math.max(firstGroup.scrollWidth / 75, 30);

    tickerTrack.style.setProperty(
      "--ticker-duration",
      `${duration}s`
    );
  });
}

function setTickerPaused(isPaused) {
  if (!ticker || !tickerControl || !tickerControlText) {
    return;
  }

  ticker.classList.toggle("is-paused", isPaused);
  tickerControl.setAttribute("aria-pressed", String(isPaused));
  tickerControl.setAttribute(
    "aria-label",
    isPaused ? "Play staff updates" : "Pause staff updates"
  );
  tickerControlText.textContent = isPaused ? "Play" : "Pause";
}

function toggleTicker() {
  const isPaused = ticker?.classList.contains("is-paused");
  setTickerPaused(!isPaused);
}

renderTicker();

if (tickerControl) {
  tickerControl.addEventListener("click", toggleTicker);
}

if (reducedMotionQuery.matches) {
  setTickerPaused(true);
  tickerControl?.setAttribute("disabled", "");
}

document.addEventListener("visibilitychange", () => {
  if (!ticker || reducedMotionQuery.matches) {
    return;
  }

  if (document.hidden) {
    ticker.classList.add("ticker--tab-hidden");
    ticker.classList.add("is-paused");
  } else if (ticker.classList.contains("ticker--tab-hidden")) {
    ticker.classList.remove("ticker--tab-hidden");
    setTickerPaused(false);
  }
});

/* =========================================================
   PROTOTYPE LINK MESSAGES
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

  prototypeToastMessage.textContent =
    message || "This destination has not yet been connected.";

  prototypeToast.hidden = false;

  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  toastTimer = window.setTimeout(hidePrototypeMessage, 7000);
}

document.querySelectorAll(".prototype-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      event.preventDefault();

      showPrototypeMessage(
        link.dataset.prototypeMessage ||
          "This destination has not yet been connected."
      );
    }
  });
});

closePrototypeToast?.addEventListener(
  "click",
  hidePrototypeMessage
);

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
   QUICK LINKS
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
  const gap = Number.parseFloat(trackStyles.columnGap) || 18;

  return firstCard.getBoundingClientRect().width + gap;
}

function getCurrentResourceIndex() {
  if (!quickLinksTrack) {
    return 0;
  }

  const distance = getResourceScrollDistance();

  return Math.max(
    0,
    Math.min(
      getResourceCards().length - 1,
      Math.round(quickLinksTrack.scrollLeft / distance)
    )
  );
}

function updateResourceProgress() {
  const cards = getResourceCards();
  const currentIndex = getCurrentResourceIndex();

  if (resourceCurrent) {
    resourceCurrent.textContent = String(
      currentIndex + 1
    ).padStart(2, "0");
  }

  if (resourceTotal) {
    resourceTotal.textContent = String(
      cards.length
    ).padStart(2, "0");
  }
}

function scrollResources(direction) {
  if (!quickLinksTrack) {
    return;
  }

  quickLinksTrack.scrollBy({
    left: getResourceScrollDistance() * direction,
    behavior: "smooth"
  });
}

function moveToNextResource() {
  if (!quickLinksTrack) {
    return;
  }

  const maxScrollLeft =
    quickLinksTrack.scrollWidth - quickLinksTrack.clientWidth;

  const atEnd =
    quickLinksTrack.scrollLeft >= maxScrollLeft - 8;

  if (atEnd) {
    quickLinksTrack.scrollTo({
      left: 0,
      behavior: "smooth"
    });
  } else {
    scrollResources(1);
  }
}

function stopResourceAutoplay() {
  if (resourceTimer) {
    window.clearInterval(resourceTimer);
    resourceTimer = null;
  }
}

function startResourceAutoplay() {
  stopResourceAutoplay();

  if (
    reducedMotionQuery.matches ||
    resourceAutoplayPaused ||
    resourceInteractionPaused ||
    document.hidden
  ) {
    return;
  }

  resourceTimer = window.setInterval(
    moveToNextResource,
    2000
  );
}

function setResourceInteractionPaused(isPaused) {
  resourceInteractionPaused = isPaused;

  if (isPaused) {
    stopResourceAutoplay();
  } else {
    startResourceAutoplay();
  }
}

function updateResourceAutoplayButton() {
  if (!resourceAutoplay) {
    return;
  }

  resourceAutoplay.setAttribute(
    "aria-pressed",
    String(resourceAutoplayPaused)
  );

  resourceAutoplay.textContent = resourceAutoplayPaused
    ? "Resume automatic movement"
    : "Pause automatic movement";
}

if (
  quickLinksTrack &&
  quickLinksPrevious &&
  quickLinksNext
) {
  quickLinksPrevious.addEventListener("click", () => {
    scrollResources(-1);
    startResourceAutoplay();
  });

  quickLinksNext.addEventListener("click", () => {
    moveToNextResource();
    startResourceAutoplay();
  });

  quickLinksTrack.addEventListener(
    "scroll",
    updateResourceProgress,
    { passive: true }
  );

  quickLinksTrack.addEventListener("mouseenter", () => {
    setResourceInteractionPaused(true);
  });

  quickLinksTrack.addEventListener("mouseleave", () => {
    setResourceInteractionPaused(false);
  });

  quickLinksTrack.addEventListener("focusin", () => {
    setResourceInteractionPaused(true);
  });

  quickLinksTrack.addEventListener("focusout", (event) => {
    if (!quickLinksTrack.contains(event.relatedTarget)) {
      setResourceInteractionPaused(false);
    }
  });

  quickLinksTrack.addEventListener(
    "pointerdown",
    () => {
      setResourceInteractionPaused(true);
    },
    { passive: true }
  );

  quickLinksTrack.addEventListener(
    "pointerup",
    () => {
      window.setTimeout(() => {
        setResourceInteractionPaused(false);
      }, 1200);
    },
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

  window.addEventListener("resize", updateResourceProgress);

  updateResourceProgress();
  startResourceAutoplay();
}

resourceAutoplay?.addEventListener("click", () => {
  resourceAutoplayPaused = !resourceAutoplayPaused;
  updateResourceAutoplayButton();

  if (resourceAutoplayPaused) {
    stopResourceAutoplay();
  } else {
    startResourceAutoplay();
  }
});

if (reducedMotionQuery.matches) {
  resourceAutoplayPaused = true;
  stopResourceAutoplay();

  if (resourceAutoplay) {
    resourceAutoplay.hidden = true;
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopResourceAutoplay();
  } else {
    startResourceAutoplay();
  }
});

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
  return normaliseSearchText(
    `${card.textContent || ""} ${card.dataset.resource || ""}`
  );
}

function findResourceMatches(searchTerm) {
  const words = normaliseSearchText(searchTerm)
    .split(" ")
    .filter(Boolean);

  return getResourceCards().filter((card) => {
    const searchableText = getCardSearchText(card);

    return words.every((word) =>
      searchableText.includes(word)
    );
  });
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
  const cardLeft =
    firstMatch.getBoundingClientRect().left;

  quickLinksTrack.scrollTo({
    left:
      quickLinksTrack.scrollLeft +
      cardLeft -
      trackLeft -
      4,
    behavior: "smooth"
  });

  document
    .getElementById("quick-links")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  window.setTimeout(() => {
    firstMatch.focus({ preventScroll: true });
  }, 450);
}

if (searchForm && hubSearch && quickLinksTrack) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearSearchHighlights();

    const term = hubSearch.value.trim();

    if (!term) {
      searchStatus?.classList.add("is-error");

      if (searchStatus) {
        searchStatus.textContent =
          "Enter a word or phrase to search the quick links.";
      }

      hubSearch.focus();
      return;
    }

    const matches = findResourceMatches(term);

    if (matches.length === 0) {
      searchStatus?.classList.add("is-error");

      if (searchStatus) {
        searchStatus.textContent =
          `No resources were found for “${term}”. ` +
          "Try handbook, benefits, brand, learning, policies, " +
          "IT, payroll or directory.";
      }

      return;
    }

    searchStatus?.classList.remove("is-error");

    if (searchStatus) {
      searchStatus.textContent =
        matches.length === 1
          ? `1 resource found for “${term}”.`
          : `${matches.length} resources found for “${term}”.`;
    }

    focusFirstSearchMatch(matches);
  });

  hubSearch.addEventListener("input", () => {
    clearSearchHighlights();

    if (searchStatus) {
      searchStatus.textContent = "";
      searchStatus.classList.remove("is-error");
    }
  });
}

/* =========================================================
   FOOTER YEAR
   ========================================================= */

if (currentYear) {
  currentYear.textContent = String(
    new Date().getFullYear()
  );
}
