"use strict";

/* =========================================================
   EDITABLE TICKER CONTENT
   ========================================================= */

const tickerItems = [
  {
    type: "result",
    label: "First Team",
    message: "Portsmouth 1–2 Stoke City"
  },
  {
    type: "result",
    label: "Women",
    message: "Stoke City Women 6–1 Liverpool Feds"
  },
  {
    type: "result",
    label: "Under-21s",
    message: "Stoke City U21 1–4 Fulham U21"
  },
  {
    type: "notice",
    label: "Staff notice",
    message: "Planned system maintenance this Friday from 6pm"
  },
  {
    type: "notice",
    label: "People Team",
    message: "Benefits enrolment closes on 30 November"
  },
  {
    type: "notice",
    label: "Learning",
    message: "Complete mandatory staff training by 4 December"
  },
  {
    type: "notice",
    label: "Finance",
    message: "Submit December expenses by 15 December"
  }
];

const select = (selector) => document.querySelector(selector);

const selectAll = (selector) => [
  ...document.querySelectorAll(selector)
];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

/* Mobile menu */

const menuButton = select("#menuButton");
const mainNavigation = select("#mainNavigation");

function closeMenu(returnFocus = false) {
  if (!menuButton || !mainNavigation) {
    return;
  }

  mainNavigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");

  if (returnFocus) {
    menuButton.focus();
  }
}

menuButton?.addEventListener("click", () => {
  const isOpen =
    mainNavigation.classList.toggle("is-open");

  menuButton.setAttribute(
    "aria-expanded",
    String(isOpen)
  );

  document.body.classList.toggle(
    "menu-open",
    isOpen
  );
});

mainNavigation?.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu(true);
  }
});

/* =========================================================
   CORRECTED STAFF TICKER

   Every class created here exactly matches style.css.
   ========================================================= */

const staffTicker = select(".staff-ticker");
const tickerTrack = select("#tickerTrack");
const tickerButton = select("#tickerButton");

function createTickerItem(item) {
  const itemElement = document.createElement("span");
  const badge = document.createElement("strong");
  const message = document.createElement("span");
  const separator = document.createElement("span");

  itemElement.className =
    `staff-ticker__item staff-ticker__item--${item.type}`;

  badge.className = "staff-ticker__badge";
  badge.textContent = item.label;

  message.className = "staff-ticker__message";
  message.textContent = item.message;

  separator.className = "staff-ticker__separator";
  separator.textContent = "•";
  separator.setAttribute("aria-hidden", "true");

  itemElement.append(
    badge,
    message,
    separator
  );

  return itemElement;
}

function createTickerGroup(isDuplicate = false) {
  const group = document.createElement("div");

  group.className = "staff-ticker__group";

  if (isDuplicate) {
    group.classList.add(
      "staff-ticker__group--duplicate"
    );

    group.setAttribute("aria-hidden", "true");
  }

  tickerItems.forEach((item) => {
    group.appendChild(
      createTickerItem(item)
    );
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
    const firstGroup =
      tickerTrack.querySelector(
        ".staff-ticker__group"
      );

    if (!firstGroup) {
      return;
    }

    /*
      Approximately 75 pixels per second.
    */

    const duration = Math.max(
      firstGroup.scrollWidth / 75,
      32
    );

    tickerTrack.style.setProperty(
      "--ticker-duration",
      `${duration}s`
    );
  });
}

function setTickerPaused(isPaused) {
  if (!staffTicker || !tickerButton) {
    return;
  }

  staffTicker.classList.toggle(
    "is-paused",
    isPaused
  );

  tickerButton.textContent =
    isPaused ? "Play" : "Pause";

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

tickerButton?.addEventListener("click", () => {
  const isPaused =
    staffTicker.classList.contains("is-paused");

  setTickerPaused(!isPaused);
});

if (reducedMotion.matches) {
  setTickerPaused(true);

  if (tickerButton) {
    tickerButton.hidden = true;
  }
}

/* Prototype links */

const prototypeToast = select("#prototypeToast");
const closePrototypeToast = select(
  "#closePrototypeToast"
);

let toastTimer;

function hidePrototypeMessage() {
  if (!prototypeToast) {
    return;
  }

  prototypeToast.hidden = true;
  window.clearTimeout(toastTimer);
}

function showPrototypeMessage() {
  if (!prototypeToast) {
    return;
  }

  prototypeToast.hidden = false;
  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(
    hidePrototypeMessage,
    6000
  );
}

selectAll("[data-demo]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPrototypeMessage();
  });
});

closePrototypeToast?.addEventListener(
  "click",
  hidePrototypeMessage
);

/* Resource carousel */

const resourceTrack = select("#resourceTrack");
const resourceCards = selectAll(".resource-card");
const previousButton = select("#resourcePrevious");
const nextButton = select("#resourceNext");
const counter = select("#resourceCounter");
const autoplayButton = select("#resourceAutoplay");

let resourceTimer;
let manualPause = false;
let interactionPause = false;

function cardDistance() {
  return (
    resourceCards[0]
      ?.getBoundingClientRect()
      .width + 18 || 328
  );
}

function currentCardIndex() {
  if (!resourceTrack) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      resourceCards.length - 1,
      Math.round(
        resourceTrack.scrollLeft /
        cardDistance()
      )
    )
  );
}

function updateCounter() {
  if (!counter) {
    return;
  }

  const current = String(
    currentCardIndex() + 1
  ).padStart(2, "0");

  const total = String(
    resourceCards.length
  ).padStart(2, "0");

  counter.textContent = `${current} / ${total}`;
}

function moveResources(direction) {
  resourceTrack?.scrollBy({
    left: cardDistance() * direction,
    behavior: "smooth"
  });
}

function moveNext() {
  if (!resourceTrack) {
    return;
  }

  const maximum =
    resourceTrack.scrollWidth -
    resourceTrack.clientWidth;

  if (resourceTrack.scrollLeft >= maximum - 8) {
    resourceTrack.scrollTo({
      left: 0,
      behavior: "smooth"
    });
  } else {
    moveResources(1);
  }
}

function stopAutoplay() {
  window.clearInterval(resourceTimer);
  resourceTimer = null;
}

function startAutoplay() {
  stopAutoplay();

  if (
    reducedMotion.matches ||
    manualPause ||
    interactionPause ||
    document.hidden
  ) {
    return;
  }

  resourceTimer = window.setInterval(
    moveNext,
    5000
  );
}

previousButton?.addEventListener("click", () => {
  moveResources(-1);
  startAutoplay();
});

nextButton?.addEventListener("click", () => {
  moveNext();
  startAutoplay();
});

resourceTrack?.addEventListener(
  "scroll",
  updateCounter,
  { passive: true }
);

resourceTrack?.addEventListener(
  "mouseenter",
  () => {
    interactionPause = true;
    stopAutoplay();
  }
);

resourceTrack?.addEventListener(
  "mouseleave",
  () => {
    interactionPause = false;
    startAutoplay();
  }
);

resourceTrack?.addEventListener(
  "focusin",
  () => {
    interactionPause = true;
    stopAutoplay();
  }
);

resourceTrack?.addEventListener(
  "focusout",
  (event) => {
    if (
      !resourceTrack.contains(
        event.relatedTarget
      )
    ) {
      interactionPause = false;
      startAutoplay();
    }
  }
);

autoplayButton?.addEventListener("click", () => {
  manualPause = !manualPause;

  autoplayButton.textContent = manualPause
    ? "Resume automatic movement"
    : "Pause automatic movement";

  autoplayButton.setAttribute(
    "aria-pressed",
    String(manualPause)
  );

  if (manualPause) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
});

if (reducedMotion.matches && autoplayButton) {
  autoplayButton.hidden = true;
}

updateCounter();
startAutoplay();

/* Resource search */

const searchForm = select("#searchForm");
const searchInput = select("#searchInput");
const searchStatus = select("#searchStatus");

function normalise(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clearMatches() {
  resourceCards.forEach((card) => {
    card.classList.remove("is-match");
  });
}

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  clearMatches();

  const query = searchInput.value.trim();

  if (!query) {
    searchStatus.textContent =
      "Enter a word or phrase.";

    searchInput.focus();
    return;
  }

  const words = normalise(query)
    .split(" ")
    .filter(Boolean);

  const matches = resourceCards.filter((card) => {
    const cardText = normalise(
      `${card.textContent} ${card.dataset.keywords || ""}`
    );

    return words.every((word) => {
      return cardText.includes(word);
    });
  });

  if (matches.length === 0) {
    searchStatus.textContent =
      `No resources found for “${query}”.`;

    return;
  }

  searchStatus.textContent =
    `${matches.length} resource` +
    `${matches.length === 1 ? "" : "s"} found.`;

  matches.forEach((card) => {
    card.classList.add("is-match");
  });

  resourceTrack.scrollTo({
    left:
      matches[0].offsetLeft -
      resourceTrack.offsetLeft,
    behavior: "smooth"
  });

  select("#resources")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  window.setTimeout(() => {
    matches[0].focus({
      preventScroll: true
    });
  }, 400);
});

searchInput?.addEventListener("input", () => {
  clearMatches();
  searchStatus.textContent = "";
});

/* Footer year */

const currentYear = select("#currentYear");

if (currentYear) {
  currentYear.textContent =
    new Date().getFullYear();
}
