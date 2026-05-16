1. ~~Wire the homepage to Sanity data. Right now the homepage has placeholder skeleton cards. The query and types are already written — it just needs to fetch featured pieces and render real PieceCard components instead of the grey pulses.~~
2. ~~Wire the About page to Sanity data. The schema is ready, the page currently just shows a placeholder note. Once you've added your story and photos in the studio, the page needs to actually fetch and render that content.~~
3. Make the contact form work. The form UI is built and looks good, but submitting it does nothing. This means writing a Next.js API route (app/api/contact/route.ts) that saves the inquiry to Sanity and sends an email notification via Resend.
4. ~~Pre-fill the contact form from piece pages. The "Inquire about this piece" button already passes ?piece=... in the URL, but the form doesn't read it yet. A small client-side addition so the piece field populates automatically when someone clicks through.~~
5. ~~Scroll animations with GSAP. The parallax hero, card reveal cascade, gold line draw, and text fade-ups we planned at the start. This is the layer of polish that makes the site feel premium.~~
6. ~~Want to when inside a piece and pressing a image I want them all to popup bigger and being able to "scroll"/"change" between them~~
7. ~~Make swedish first language and english second~~
  1. ~~need to let the user enter both when they write title, desc and such~~
  2. however seems like i dont have both lang on pieces
8. ~~Deploy~~
  1. ~~kind of feel like sanity should be its own repository?~~
9. I am thinking that about page as all workshop pictures when they are creating different pieces and such

