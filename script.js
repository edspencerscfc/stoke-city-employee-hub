"use strict";

/* =========================================================
   EDITABLE TICKER CONTENT

   Update these entries when results or staff notices change.

   Available types:
   - result
   - notice
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
    label: "Staff notice",
    text: "Planned system maintenance this Friday from 6pm"
  },
  {
    type: "notice",
    label: "People Team",
    text: "Benefits enrolment closes on 30 November"
  },
  {
    type: "notice",
    label: "Learning",
    text: "Complete mandatory staff training by 4 December"
  },
  {
    type: "notice",
    label: "Finance",
    text: "Submit December expenses by 15 December"
  }
];

/* =========================================================
   HELPERS
   ========================================================= */

const select = (selector) => document.querySelector(selector);

const selectAll = (selector) => [
  ...document.querySelectorAll(selector)
];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuButton = select("#menuBtn");
const navigation = select("#nav");

function closeMenu(returnFocus = false) {
  if (!menuButton || !navigation) {
    return;
  }

  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("lock");

  if (returnFocus) {
    menuButton.focus();
  }
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    document.body.classList.toggle("lock", isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu(true);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 740) {
      closeMenu();
    }
  });
}

/* =========================================================
   MOVING STAFF TICKER
   ========================================================= */

const ticker = select(".ticker");
const tickerTrack = select("#tickerTrack");
const tickerButton = select("#tickerBtn");

function createTickerGroup(isDuplicate = false) {
  const group = document.createElement("div");

  group.className = "ticker-group";

  if (isDuplicate) {
    group.classList.add("duplicate");
    group.setAttribute("aria-hidden", "true");
  }

  tickerItems.forEach((item) => {
    const tickerItem = document.createElement("span");
    const label = document.createElement("strong");
    const text = document.createElement("span");
    const separator = document.createElement("i");

    tickerItem.className = `ticker-item ${item.type}`;
    label.textContent = item.label;
    text.textContent = item.text;
    separator.textContent = "•";
    separator.setAttribute("aria-hidden", "true");

    tickerItem.append(label, text, separator);
    group.appendChild(tickerItem);
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
    const firstGroup = tickerTrack.firstElementChild;

    if (!firstGroup) {
      return;
    }

    /*
      The ticker aims for approximately 75 pixels per second.
      Longer messages therefore receive a longer duration.
    */

    const duration = Math.max(
      firstGroup.scrollWidth / 75,
      30
    );

    tickerTrack.style.setProperty(
      "--ticker-duration",
      `${duration}s`
    );
  });
}

function setTickerPaused(isPaused) {
  if (!ticker || !tickerButton) {
    return;
  }

  ticker.classList.toggle("paused", isPaused);

  tickerButton.textContent = isPaused
    ? "Play"
    : "Pause";

  tickerButton.setAttribute(
    "aria-pressed",
    String(isPaused)
  );

  tickerButton.setAttribute(
    "aria-label",
    isPaused
      ? "Play staff updates"
      : "Pause staff updates"
  );
}

renderTicker();

if (tickerButton) {
  tickerButton.addEventListener("click", () => {
    const isPaused = ticker?.classList.contains("paused");

    setTickerPaused(!isPaused);
  });
}

if (reducedMotion.matches) {
  setTickerPaused(true);

  if (tickerButton) {
    tickerButton.hidden = true;
  }
}

/* Pause animation when the browser tab is not visible */

document.addEventListener("visibilitychange", () => {
  if (!ticker || reducedMotion.matches) {
    return;
  }

  if (document.hidden) {
    ticker.classList.add("paused");
  }
});

/* =========================================================
   PROTOTYPE LINK MESSAGE
   ========================================================= */

const toast = select("#toast");
const toastClose = select("#toastClose");

let toastTimer;

function closeToast() {
  if (!toast) {
    return;
  }

  toast.hidden = true;

  window.clearTimeout(toastTimer);
}

function showPrototypeMessage() {
  if (!toast) {
    return;
  }

  toast.hidden = false;

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(() => {
    closeToast();
  }, 6000);
}

selectAll("[data-demo]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPrototypeMessage();
  });
});

if (toastClose) {
  toastClose.addEventListener("click", closeToast);
}

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toast &&
    !toast.hidden
  ) {
    closeToast();
  }
});

/* =========================================================
   RESOURCE CAROUSEL
   ========================================================= */

const resourceTrack = select("#resourceTrack");
const resourceCards = selectAll(".resource");
const previousButton = select("#prev");
const nextButton = select("#next");
const resourceCounter = select("#counter");
const autoplayButton = select("#autoplay");

let resourceTimer;
let autoplayManuallyPaused = false;
let interactionPaused = false;

function getResourceDistance() {
  const firstCard = resourceCards[0];

  if (!firstCard) {
    return 328;
  }

  return firstCard.getBoundingClientRect().width + 18;
}

function getCurrentResourceIndex() {
  if (!resourceTrack) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      resourceCards.length - 1,
      Math.round(
        resourceTrack.scrollLeft / getResourceDistance()
      )
    )
  );
}

function updateResourceCounter() {
  if (!resourceCounter) {
    return;
  }

  const current = String(
    getCurrentResourceIndex() + 1
  ).padStart(2, "0");

  const total = String(
    resourceCards.length
  ).padStart(2, "0");

  resourceCounter.textContent = `${current} / ${total}`;
}

function moveResources(direction) {
  if (!resourceTrack) {
    return;
  }

  resourceTrack.scrollBy({
    left: getResourceDistance() * direction,
    behavior: "smooth"
  });
}

function moveToNextResource() {
  if (!resourceTrack) {
    return;
  }

  const maximumScroll =
    resourceTrack.scrollWidth -
    resourceTrack.clientWidth;

  const isAtEnd =
    resourceTrack.scrollLeft >= maximumScroll - 8;

  if (isAtEnd) {
    resourceTrack.scrollTo({
      left: 0,
      behavior: "smooth"
    });

    return;
  }

  moveResources(1);
}

function stopResourceAutoplay() {
  window.clearInterval(resourceTimer);
  resourceTimer = null;
}

function startResourceAutoplay() {
  stopResourceAutoplay();

  if (
    reducedMotion.matches ||
    autoplayManuallyPaused ||
    interactionPaused ||
    document.hidden
  ) {
    return;
  }

  resourceTimer = window.setInterval(() => {
    moveToNextResource();
  }, 5000);
}

function pauseForInteraction() {
  interactionPaused = true;
  stopResourceAutoplay();
}

function resumeAfterInteraction() {
  interactionPaused = false;
  startResourceAutoplay();
}

if (
  resourceTrack &&
  previousButton &&
  nextButton
) {
  previousButton.addEventListener("click", () => {
    moveResources(-1);
    startResourceAutoplay();
  });

  nextButton.addEventListener("click", () => {
    moveToNextResource();
    startResourceAutoplay();
  });

  resourceTrack.addEventListener(
    "scroll",
    updateResourceCounter,
    { passive: true }
  );

  resourceTrack.addEventListener(
    "mouseenter",
    pauseForInteraction
  );

  resourceTrack.addEventListener(
    "mouseleave",
    resumeAfterInteraction
  );

  resourceTrack.addEventListener(
    "focusin",
    pauseForInteraction
  );

  resourceTrack.addEventListener(
    "focusout",
    (event) => {
      if (!resourceTrack.contains(event.relatedTarget)) {
        resumeAfterInteraction();
      }
    }
  );

  resourceTrack.addEventListener(
    "pointerdown",
    pauseForInteraction,
    { passive: true }
  );

  resourceTrack.addEventListener(
    "pointerup",
    () => {
      window.setTimeout(() => {
        resumeAfterInteraction();
      }, 1000);
    },
    { passive: true }
  );

  resourceTrack.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveResources(1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveResources(-1);
      }

      if (event.key === "Home") {
        event.preventDefault();

        resourceTrack.scrollTo({
          left: 0,
          behavior: "smooth"
        });
      }

      if (event.key === "End") {
        event.preventDefault();

        resourceTrack.scrollTo({
          left: resourceTrack.scrollWidth,
          behavior: "smooth"
        });
      }
    }
  );

  updateResourceCounter();
  startResourceAutoplay();
}

if (autoplayButton) {
  autoplayButton.addEventListener("click", () => {
    autoplayManuallyPaused =
      !autoplayManuallyPaused;

    autoplayButton.textContent =
      autoplayManuallyPaused
        ? "Resume automatic movement"
        : "Pause automatic movement";

    autoplayButton.setAttribute(
      "aria-pressed",
      String(autoplayManuallyPaused)
    );

    if (autoplayManuallyPaused) {
      stopResourceAutoplay();
    } else {
      startResourceAutoplay();
    }
  });
}

if (reducedMotion.matches && autoplayButton) {
  autoplayButton.hidden = true;
  stopResourceAutoplay();
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

const searchForm = select("#searchForm");
const searchInput = select("#searchInput");
const searchStatus = select("#searchStatus");

function clearSearchMatches() {
  resourceCards.forEach((card) => {
    card.classList.remove("match");
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

function findResourceMatches(query) {
  const words = normaliseSearchText(query)
    .split(" ")
    .filter(Boolean);

  return resourceCards.filter((card) => {
    const visibleText = card.textContent || "";
    const keywords = card.dataset.keywords || "";

    const searchableText = normaliseSearchText(
      `${visibleText} ${keywords}`
    );

    return words.every((word) => {
      return searchableText.includes(word);
    });
  });
}

if (
  searchForm &&
  searchInput &&
  searchStatus &&
  resourceTrack
) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    clearSearchMatches();

    const query = searchInput.value.trim();

    if (!query) {
      searchStatus.textContent =
        "Enter a word or phrase.";

      searchInput.focus();
      return;
    }

    const matches = findResourceMatches(query);

    if (matches.length === 0) {
      searchStatus.textContent =
        `No resources found for “${query}”.`;

      return;
    }

    searchStatus.textContent =
      `${matches.length} resource` +
      `${matches.length > 1 ? "s" : ""} found.`;

    matches.forEach((card) => {
      card.classList.add("match");
    });

    const firstMatch = matches[0];

    resourceTrack.scrollTo({
      left:
        firstMatch.offsetLeft -
        resourceTrack.offsetLeft,
      behavior: "smooth"
    });

    select("#resources")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    window.setTimeout(() => {
      firstMatch.focus({
        preventScroll: true
      });
    }, 400);
  });

  searchInput.addEventListener("input", () => {
    clearSearchMatches();
    searchStatus.textContent = "";
  });
}

/* =========================================================
   FOOTER YEAR
   ========================================================= */

const year = select("#year");

if (year) {
  year.textContent = String(
    new Date().getFullYear()
  );
}
