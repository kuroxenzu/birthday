/* ============================================================
   EDIT ME
   Everything you'd want to personalize lives in this one file.
   ============================================================ */

window.CARD_CONTENT = {

  // The "old photo" shown in the first sequence.
  // Drop your own image in /images and point this at it, e.g. "images/old-photo.jpg"
  oldPhotoSrc: "images/placeholder-photo.svg",
  oldPhotoCaption: "( a photo from before. )",

  // The second "now" photo shown next to the old photo, once the
  // reader clicks/presses through to the second intro line.
  // Drop your own image in /images and point this at it too, e.g. "images/new-photo.jpg"
  newPhotoSrc: "images/placeholder-photo.svg",
  newPhotoCaption: "( and now. )",

  // The two lines that open the card, shown one at a time.
  introLineOne: "* ... it's you!",
  introLineTwo: "* Despite everything, it's still you.",

  // The main birthday message. Each entry is one dialogue "page" —
  // the reader clicks / presses Z, Enter, or Space to advance, just
  // like a real Undertale text box. Keep lines short; that's the style.
  mainMessage: [
    "* Every world needs a save point. Somewhere safe, where all the resets and do-overs stop mattering for a second, and you can just... breathe.",

    "* Today, you get to be in that place for once, instead of giving it to everyone else.",

    "* I've watched you carry more than you show anyone. Loading screens nobody sees. Fights you didn't pick, but finished anyway.",

    "* And somehow, at the end of every long save file, you're still soft. Still funny. Still exactly the kind of person worth keeping a save for.",

    "* This isn't a FIGHT, so there's no ACT that says the right thing, and no ITEM that fixes everything at once.",

    "* So I'll just use MERCY, and tell you plainly: happy birthday.",

    "You've made this timeline so much better than the ones without you in it.",

    "* Somewhere out there is a version of this year where nobody ever said any of this to you.",

    "* And I like this one better.",
    
    "* I hope this trip around the sun is loud where you want it loud, quiet where you need it quiet, and kind to you the way you're kind to everyone else.",

    "* Stay perseverant. Stay exactly, stubbornly, wonderfully you.",

    "* (...also, I left something hidden further down, if you're curious. You know how to find secrets.)"
  ],

  // The word that unlocks the secret dialogue. Not case sensitive.
  magicWord: "perseverance",

  // Shown if someone tries the wrong word.
  wrongWordLine: "* ... nothing happens.",

  // Revealed once the correct word is entered. Same paging behavior as mainMessage.
  secretMessage: [
    "* You found it.",
    "* This is the part underneath the part. The thing I mean even on the days I don't say it.",
    "* [ Replace this line in content.js with the real, private thing you want to say. ]",
    "* Happy birthday. I mean it more than pixels can really show.",
    "* ...",
    "* Stay perseverant. <3"
  ],

  // Background music. Drop matching .mp3 files into /music — the
  // player below lists whatever's in this array. Missing files are
  // skipped quietly, so you can leave placeholders in here.
  musicTracks: [
    { title: "Home",  src: "music/home.mp3" }
  ]

};
