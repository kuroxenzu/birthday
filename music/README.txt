HOW TO ADD MUSIC
================

1. Drop your .mp3 files into this /music folder.

2. Open js/content.js and edit the `musicTracks` array so the
   filenames match, e.g.:

     musicTracks: [
       { title: "Home",          src: "music/home.mp3" },
       { title: "Determination", src: "music/determination.mp3" }
     ]

   You can list as many tracks as you like — the player's «/» buttons
   step through whatever is in this array.

3. If a listed file is missing, the player just skips it quietly, so
   it's safe to leave placeholder entries in content.js while you
   collect the actual mp3s.

Note: browsers block audio from playing automatically. Music starts
the moment someone clicks the "BEGIN" button on the very first
screen, which counts as their permission.
