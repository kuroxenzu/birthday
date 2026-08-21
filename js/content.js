/* ============================================================
   EDIT ME
   Everything you'd want to personalize lives in this one file.
   ============================================================ */

window.CARD_CONTENT = {

  // The "old photo" shown in the first sequence.
  // Drop your own image in /images and point this at it, e.g. "images/old-photo.jpg"
  oldPhotoSrc: "images/old-photo.png",
  oldPhotoCaption: "( a photo from before. )",

  // The second "now" photo shown next to the old photo, once the
  // reader clicks/presses through to the second intro line.
  // Drop your own image in /images and point this at it too, e.g. "images/new-photo.jpg"
  newPhotoSrc: "images/new-photo.png",
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

    "* You've made this timeline so much better than the ones without you in it.",

    "* Somewhere out there is a version of this year where nobody ever said any of this to you.",

    "* And I like this one better.",
    
    "* I hope this trip around the sun is loud where you want it loud, quiet where you need it quiet, and kind to you the way you're kind to everyone else.",

    "* Stay perseverant. Stay exactly, stubbornly, wonderfully you."
  ],

  // The word that unlocks the secret dialogue. Not case sensitive.
  magicWord: "perseverance",

  // Shown if someone tries the wrong word.
  wrongWordLine: "* ... nothing happens.",

  // Revealed once the correct word is entered. Same paging behavior as mainMessage.
  secretMessage: [
    "* You've finally found me.",
    "* If you're reading this, then today is not just another birthday.",
    "* Today marks the moment when something ancient passes from one soul to another.",
    "* Long ago, I carried the Soul of Perseverance.",
    "* It was not a power that made me fearless. It was the power that taught me to keep moving even when I was afraid.",
    "* To stand again after falling. To take one more step when the path ahead seemed impossible.",
    "* And now, that power belongs to you.",
    "* You may wonder if you're worthy of it.",
    "* You may face days when you feel lost, tired, or convinced that you've reached the end of your strength.",
    "* When that happens, remember this:",
    "* Perseverance does not mean you never fall.\n* It means you choose to rise again.",
    "* You don't have to be the strongest. You don't have to know every answer. You only have to take the next step.",
    "* There will be moments when the world tells you to give up. There will be battles you cannot win by force, and paths that seem to have no ending.",
    "* But you have something greater than strength.",
    "* You have the determination to try again.",
    "* So take this Soul, not as a burden, but as a promise.",
    "* A promise that no matter how many times you fall, your story does not end there.",
    "* Your journey is yours to write.",
    "* And if someday you find yourself standing where I once stood, wondering whether you can continue...",
    "* Remember that someone believed you could.",
    "* I did.",
    "* Happy Birthday, heir of Perseverance.",
    "* Your turn begins now.",
    "* Don't give up.\n* Not today.\n* Not tomorrow.\n* Not ever.",
    "The Ancient Soul of Perseverance has been added to your inventory.",
    "You feel a strange warmth in your chest.",
    "It feels familiar.",
    "It feels like perseverance.",
    "* Stay perseverant, young one..."
  ],

  // Background music. Drop matching .mp3 files into /music — the
  // player below lists whatever's in this array. Missing files are
  // skipped quietly, so you can leave placeholders in here.
  musicTracks: [
    { title: "Undertale - Toby Fox",  src: "music/undertale.mp3" },
    { title: "Home - Toby Fox",  src: "music/home.mp3" }
  ]

};
