HOW TO ADD THE REAL PHOTO
==========================

placeholder-photo.svg is a stand-in "old photo" so the page has
something to show out of the box.

To use a real photo:

1. Drop your image file in this /images folder (jpg or png works fine).
2. Open js/content.js and change:

     oldPhotoSrc: "images/placeholder-photo.svg"

   to, e.g.:

     oldPhotoSrc: "images/old-photo.jpg"

3. Optionally edit `oldPhotoCaption` in the same file.

A portrait-ish photo (taller than it is wide) fits the polaroid frame
best, but anything will work — it gets cropped to fit.
