(() => {
  "use strict";

  const CONTENT = window.CARD_CONTENT || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------
     Small helpers
  ------------------------------------------------------------ */
  const $ = (sel) => document.querySelector(sel);
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  /* --------------------------------------------------------
     Keyword highlighting — colors specific words (FIGHT, ACT,
     MERCY, determined, perseverant, ...) wherever they appear
     in dialogue text. Edit HIGHLIGHT_WORDS below to add more.
  -------------------------------------------------------- */
  const HIGHLIGHT_WORDS = [
    { word: "FIGHT",        className: "hl-fight" },
    { word: "ACT",          className: "hl-act" },
    { word: "MERCY",        className: "hl-mercy" },
    { word: "ITEM",         className: "hl-item" },
    { word: "happy birthday",className: "hl-greeting" },
    { word: "perseverant",  className: "hl-perseverant" },
    { word: "save point",  className: "hl-savepoint" },
  ];
  // Longest word first so e.g. "determination" matches before "determined"
  // can't accidentally clip it, and to keep the regex deterministic.
  const HIGHLIGHT_RE = new RegExp(
    "\\b(" +
      HIGHLIGHT_WORDS
        .map((w) => w.word)
        .sort((a, b) => b.length - a.length)
        .join("|") +
      ")\\b",
    "g"
  );
  const HIGHLIGHT_CLASS_BY_WORD = HIGHLIGHT_WORDS.reduce((map, w) => {
    map[w.word] = w.className;
    return map;
  }, {});

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /** Escapes text and wraps any highlight keywords in colored spans. */
  function renderHighlighted(text) {
    return escapeHtml(text).replace(HIGHLIGHT_RE, (match) => {
      const cls = HIGHLIGHT_CLASS_BY_WORD[match];
      return `<span class="hl-word ${cls}">${match}</span>`;
    });
  }

  /**
   * Reveals `text` into `el` one character at a time (via innerHTML,
   * so keyword highlighting applies as words complete), and returns
   * an object with the promise plus a `cancel()` to stop mid-type.
   * Cancelling stops the pending timeout AND prevents any further
   * characters from being written, so a skipped/cancelled run can
   * never bleed into whatever gets typed into the element next —
   * that missing guarantee was the source of the jumbled-text bug.
   */
  function typewriter(el, text, speed = 26) {
    let cancelled = false;
    let timeoutId = null;
    let resolvePromise = null;

    const promise = new Promise((resolve) => {
      resolvePromise = resolve;

      el.innerHTML = "";

      if (reduceMotion) {
        el.innerHTML = renderHighlighted(text);
        resolve();
        return;
      }

      let i = 0;

      const tick = () => {
        if (cancelled) {
          resolve();
          return;
        }

        if (i < text.length) {
          i++;
          el.innerHTML = renderHighlighted(text.slice(0, i));
          timeoutId = setTimeout(tick, speed);
        } else {
          resolve();
        }
      };

      tick();
    });

    promise.cancel = () => {
      if (cancelled) return;

      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // IMPORTANT:
      // A cancelled typewriter must still resolve its promise.
      // Otherwise any `await currentRun` can remain stuck forever.
      if (resolvePromise) {
        resolvePromise();
        resolvePromise = null;
      }
    };

    return promise;
  }

  /** Screen wipe transition: fade to black, run `during`, fade back in. */
  async function wipeTo(during) {
    const wipe = $("#wipe");
    wipe.classList.add("active");
    await wait(reduceMotion ? 10 : 420);
    await during();
    await wait(30);
    wipe.classList.remove("active");
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => {
      s.classList.remove("active");
      s.hidden = s.id === id ? false : s.hidden;
    });
    const target = document.getElementById(id);
    target.hidden = false;
    target.classList.add("active");
  }

  /* ------------------------------------------------------------
     Ambient floating hearts
  ------------------------------------------------------------ */
  function spawnHeart() {
    const decor = $("#bgDecor");
    if (!decor || reduceMotion) return;
    const span = document.createElement("span");
    span.textContent = Math.random() > 0.5 ? "♥" : "✦";
    span.style.left = Math.random() * 100 + "%";
    const duration = 10 + Math.random() * 12;
    span.style.animationDuration = duration + "s";
    span.style.fontSize = 0.8 + Math.random() * 1.4 + "rem";
    decor.appendChild(span);
    setTimeout(() => span.remove(), duration * 1000);
  }
  if (!reduceMotion) setInterval(spawnHeart, 1800);

  /* ------------------------------------------------------------
     Dialogue pager — drives intro / main / secret text boxes
  ------------------------------------------------------------ */
  function createPager({ pages, textEl, advanceEl, boxEl, onComplete }) {
    let index = 0;
    let typing = false;
    let currentRun = null; // the in-flight cancellable typewriter promise
    let completed = false; // guards onComplete from firing more than once

    // Fires as soon as the LAST page finishes typing (or is skipped to
    // its end) — no extra click needed to "confirm" you're done reading.
    function finish() {
      if (completed) return;
      completed = true;
      advanceEl.hidden = true;
      if (onComplete) onComplete();
    }

    async function renderCurrent() {
      typing = true;
      advanceEl.hidden = true;
      currentRun = typewriter(textEl, pages[index]);
      await currentRun;
      currentRun = null;
      typing = false;
      if (index === pages.length - 1) {
        finish();
      } else {
        advanceEl.hidden = false;
      }
    }

    async function advance() {
      if (typing) {
        // Skip to end of current line: cancel the in-flight run FIRST so
        // its pending timeout can never write another character into
        // textEl after we've jumped ahead — this is what previously let
        // leftover characters from the old page bleed into the next one.
        if (currentRun && currentRun.cancel) currentRun.cancel();
        currentRun = null;
        textEl.innerHTML = renderHighlighted(pages[index]);
        typing = false;
        if (index === pages.length - 1) {
          finish();
        } else {
          advanceEl.hidden = false;
        }
        return;
      }
      if (index < pages.length - 1) {
        index++;
        await renderCurrent();
      }
      // Already on the last, fully-typed page — onComplete already
      // fired the moment typing finished, so there's nothing left
      // to advance to here.
    }

    if (boxEl) boxEl.addEventListener("click", advance);
    const keyHandler = (e) => {
      // Ignore key presses while this pager's box isn't actually on
      // screen (its .screen isn't the active one) — otherwise a pager
      // set up ahead of time (like the main-message pager, created at
      // boot) would silently consume Z/Enter/Space presses meant for
      // whatever screen the reader is currently looking at.
      if (boxEl && boxEl.offsetParent === null) return;
      if (["Enter", " ", "z", "Z"].includes(e.key)) {
        e.preventDefault();
        advance();
      }
    };
    document.addEventListener("keydown", keyHandler);

    return {
      start: renderCurrent,
      destroyKeys: () => document.removeEventListener("keydown", keyHandler),
    };
  }

  /* ------------------------------------------------------------
     Music player
  ------------------------------------------------------------ */
  function initMusicPlayer() {
    const tracks = (CONTENT.musicTracks || []).filter((t) => t && t.src);
    const bgm = $("#bgm");
    const toggleBtn = $("#btnMusicToggle");
    const panel = $("#musicPanel");
    const nameEl = $("#musicTrackName");
    const playPauseBtn = $("#btnPlayPause");
    const prevBtn = $("#btnPrevTrack");
    const nextBtn = $("#btnNextTrack");
    const volumeSlider = $("#volumeSlider");

    let i = 0;
    bgm.volume = parseFloat(volumeSlider.value);

    function load(idx, autoplay) {
      if (!tracks.length) {
        nameEl.textContent = "add mp3s to /music";
        return;
      }
      i = (idx + tracks.length) % tracks.length;
      bgm.src = tracks[i].src;
      nameEl.textContent = tracks[i].title || tracks[i].src;
      if (autoplay) {
        bgm.play().catch(() => {
          /* browser blocked autoplay until further interaction — ignore */
        });
      }
    }

    bgm.addEventListener("error", () => {
      // Missing/placeholder mp3 — quietly skip to the next track once.
      if (tracks.length > 1) load(i + 1, true);
      else nameEl.textContent = "(track file missing)";
    });

    toggleBtn.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
    });

    playPauseBtn.addEventListener("click", () => {
      if (!bgm.src) load(0, false);
      if (bgm.paused) {
        bgm.play().catch(() => {});
        playPauseBtn.textContent = "⏸";
      } else {
        bgm.pause();
        playPauseBtn.textContent = "▶";
      }
    });

    bgm.addEventListener("play", () => (playPauseBtn.textContent = "⏸"));
    bgm.addEventListener("pause", () => (playPauseBtn.textContent = "▶"));

    // When a track finishes naturally, move on to the next one
    // (wrapping back to the first after the last), autoplaying it.
    bgm.addEventListener("ended", () => {
      if (tracks.length > 1) load(i + 1, true);
      else bgm.play().catch(() => {}); // only one track — just replay it
    });

    prevBtn.addEventListener("click", () => load(i - 1, !bgm.paused || bgm.currentTime === 0));
    nextBtn.addEventListener("click", () => load(i + 1, !bgm.paused || bgm.currentTime === 0));

    volumeSlider.addEventListener("input", () => {
      bgm.volume = parseFloat(volumeSlider.value);
    });

    if (tracks.length) {
      // Just preload the first track — playback only begins once the
      // reader clicks BEGIN (see startForBoot(), invoked from the boot
      // button handler below). No autoplay-on-load, no starting on any
      // arbitrary click/key/touch elsewhere on the page.
      load(0, false);
    } else {
      nameEl.textContent = "add mp3s to /music";
    }

    return {
      startForBoot: () => {
        if (tracks.length && bgm.paused) load(i, true);
      },
    };
  }

  /* ------------------------------------------------------------
     Boot
  ------------------------------------------------------------ */
  function boot() {
    // photo + caption from content.js
    const photo = $("#oldPhoto");
    photo.src = CONTENT.oldPhotoSrc || "images/placeholder-photo.svg";
    $("#oldPhotoCaption").textContent = CONTENT.oldPhotoCaption || "";

    const newPhoto = $("#newPhoto");
    newPhoto.src = CONTENT.newPhotoSrc || "images/placeholder-photo.svg";
    $("#newPhotoCaption").textContent = CONTENT.newPhotoCaption || "";

    const music = initMusicPlayer();

    $("#btnBoot").addEventListener("click", async () => {
      music.startForBoot();
      await wipeTo(async () => {
        showScreen("screen-intro");
      });
      runIntroSequence();
    }, { once: true });

    setupMainPager();
    setupSecretWordFlow();
  }

  /* ------------------------------------------------------------
     Intro sequence orchestration
  ------------------------------------------------------------ */
  async function runIntroSequence() {
  const oldPhotoFig = $("#screen-intro .old-photo");
  const newPhotoFig = $("#screen-intro .new-photo");
  const introText = $("#introText");
  const introAdvance = $("#introAdvance");
  const introBox = $("#introBox");
  const startBtn = $("#btnStart");

  const pages = [
    CONTENT.introLineOne || "* ... it's you!",
    CONTENT.introLineTwo || "* Despite everything, it's still you.",
  ];

  await wait(600);
  oldPhotoFig.classList.add("visible");
  await wait(400);

  let index = 0;
  let typing = false;
  let currentRun = null;

  // Prevent multiple advance operations from running simultaneously.
  let advancing = false;

  // Used to invalidate old/cancelled typewriter runs.
  let sequenceId = 0;

  async function revealDone() {
    introAdvance.hidden = true;
    startBtn.classList.remove("pending");
    introBox.classList.add("done");
  }

  async function renderCurrent() {
    const mySequence = ++sequenceId;

    typing = true;
    introAdvance.hidden = true;

    const run = typewriter(introText, pages[index]);
    currentRun = run;

    await run;

    // This render was cancelled/replaced.
    if (mySequence !== sequenceId) {
      return;
    }

    currentRun = null;
    typing = false;

    if (index === pages.length - 1) {
      await revealDone();
    } else {
      introAdvance.hidden = false;
    }
  }

  async function advance() {

    /*
     * If text is currently typing:
     * finish the current line immediately.
     */
    if (typing) {
      sequenceId++;

      if (currentRun && currentRun.cancel) {
        currentRun.cancel();
      }

      currentRun = null;

      introText.innerHTML = renderHighlighted(pages[index]);

      typing = false;

      if (index === pages.length - 1) {
        await revealDone();
      } else {
        introAdvance.hidden = false;
      }

      return;
    }

    /*
     * Ignore clicks that arrive while we're already moving
     * from one completed line to the next.
     */
    if (advancing) {
      return;
    }

    if (index < pages.length - 1) {
      advancing = true;

      try {
        index++;

        if (index === 1) {
          newPhotoFig.classList.add("visible");
        }

        await renderCurrent();

      } finally {
        // VERY IMPORTANT:
        // This always unlocks the sequence, even if the
        // typewriter was cancelled by a spam click.
        advancing = false;
      }

      return;
    }

    // Last line is already complete.
    // Nothing happens here; START handles the transition.
  }

  introBox.addEventListener("click", advance);

  const keyHandler = (e) => {
    if (introBox.offsetParent === null) {
      return;
    }

    if (["Enter", " ", "z", "Z"].includes(e.key)) {
      e.preventDefault();
      advance();
    }
  };

  document.addEventListener("keydown", keyHandler);

  await renderCurrent();

  startBtn.addEventListener(
    "click",
    async () => {
      document.removeEventListener("keydown", keyHandler);

      await wipeTo(async () => {
        showScreen("screen-main");
      });

      mainPager.start();
    },
    { once: true }
  );
}

  /* ------------------------------------------------------------
     Main dialogue pager
  ------------------------------------------------------------ */
  let mainPager;
  function setupMainPager() {
    const pages = CONTENT.mainMessage && CONTENT.mainMessage.length
      ? CONTENT.mainMessage
      : ["* (Edit mainMessage in content.js to write your message.)"];

    mainPager = createPager({
      pages,
      textEl: $("#mainText"),
      advanceEl: $("#mainAdvance"),
      boxEl: $("#mainBox"),
      onComplete: () => {
        $("#mainAdvance").hidden = true;
        $("#savePoint").classList.remove("pending");
      },
    });
  }

  /* ------------------------------------------------------------
     Secret word prompt + secret dialogue
  ------------------------------------------------------------ */
  function setupSecretWordFlow() {
    const star = $("#savePointStar");
    const prompt = $("#wordPrompt");
    const form = $("#wordForm");
    const input = $("#wordInput");
    const feedback = $("#wordFeedback");
    const closeBtn = $("#btnCloseWord");
    const wordBox = $(".word-box");

    function openPrompt() {
      prompt.hidden = false;
      feedback.textContent = "";
      feedback.classList.remove("correct");
      input.value = "";
      input.focus();
    }
    function closePrompt() {
      prompt.hidden = true;
    }

    star.addEventListener("click", openPrompt);
    star.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPrompt();
      }
    });
    closeBtn.addEventListener("click", closePrompt);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const guess = input.value.trim().toLowerCase();
      const answer = (CONTENT.magicWord || "").trim().toLowerCase();

      if (answer && guess === answer) {
        feedback.classList.add("correct");
        feedback.textContent = "* ... !";
        await wait(500);
        closePrompt();
        await wipeTo(async () => {
          document.getElementById("screen-secret").hidden = false;
          showScreen("screen-secret");
        });
        startSecretPager();
      } else {
        feedback.classList.remove("correct");
        feedback.textContent = CONTENT.wrongWordLine || "* ... nothing happens.";
        wordBox.classList.remove("shake");
        void wordBox.offsetWidth; // restart animation
        wordBox.classList.add("shake");
      }
    });
  }

  function startSecretPager() {
    const pages = CONTENT.secretMessage && CONTENT.secretMessage.length
      ? CONTENT.secretMessage
      : ["* ... (Add secretMessage lines in content.js.)"];

    const closeBtn = $("#btnCloseSecret");
    closeBtn.classList.add("pending");

    const pager = createPager({
      pages,
      textEl: $("#secretText"),
      advanceEl: $("#secretAdvance"),
      boxEl: $("#secretBox"),
      onComplete: () => {
        $("#secretAdvance").hidden = true;
        closeBtn.classList.remove("pending");
      },
    });
    pager.start();

    closeBtn.addEventListener(
      "click",
      async () => {
        pager.destroyKeys();

        // Replace the hidden-secret hint with your new line
        CONTENT.mainMessage[CONTENT.mainMessage.length - 1] =
          "* I love you.";

        // Update the displayed text immediately
        $("#mainText").innerHTML =
          renderHighlighted(CONTENT.mainMessage[CONTENT.mainMessage.length - 1]);

        await wipeTo(async () => {
          document.getElementById("screen-secret").classList.remove("active");
          showScreen("screen-main");
        });
      },
      { once: true }
    );
  }

  /* ------------------------------------------------------------
     Init
  ------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", boot);
})();
