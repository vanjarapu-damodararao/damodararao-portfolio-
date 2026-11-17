# Damodara Rao: Portfolio ("The Drawing Set")

A light, paper-and-ink portfolio whose hero is an interactive 3D drawing of
**a website shown as a building**, one storey per layer of the web stack.

Built with **React 18 + Vite**, **Three.js / React Three Fiber**, and **GSAP + ScrollTrigger**.
No Tailwind, no paid libraries, no backend.

---

## 1. Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
cd damodara-portfolio
npm install        # first time only: downloads the libraries
npm run dev        # starts the site at http://localhost:5173
```

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Makes the optimised, final site in the `dist/` folder |
| `npm run preview` | Shows that final build locally, to check it before deploying |

---

## 2. Where everything lives

```
public/                 files served as-is (favicon, your images)
  favicon.svg           placeholder icon: replace any time
  projects/             put project screenshots here (create the folder)
  images/               put your portrait here (create the folder)
src/
  data/                 ← YOU EDIT THESE: all your content
    site.js             name, email, social links, availability
    projects.js         your projects
    expertise.js        services
    skills.js           tools + honest level (practised/familiar/learning)
    experience.js       timeline entries
    testimonials.js     genuine quotes only (section hides while empty)
  sections/             one file per page section (Hero, About, ...)
  components/           reusable pieces (Navbar, Footer, ProjectCard, ...)
  three/                the 3D: buildModel.js (geometry), Building.jsx (animation),
                        HeroScene.jsx (camera/canvas), HeroFallback.jsx (no-WebGL image)
  hooks/                small helpers (reduced motion, in-view, screen size)
  styles/               variables.css (colours, fonts), global, sections,
                        animations, responsive
```

**Rule of thumb:** to change *content*, edit `src/data/`. To change *look*, edit `src/styles/`.

---

## 3. Updating your content

### Your details, email and social links
Open `src/data/site.js`:
- `email`: your real email, then set `emailIsPlaceholder: false`
- `location`: your city
- `socials`: replace each `url: null` with the full link, e.g. `'https://github.com/yourname'`.
  A link left as `null` shows as "link to be added" instead of a broken link.
- `available: false` hides the "Available for new projects" badge.

### Adding or editing a project
Open `src/data/projects.js`. Each project is one `{ ... }` block. Copy one, change the values.

1. Put images in `public/projects/` (e.g. `public/projects/bakery-full.jpg`).
2. Reference them **without** `public`: `thumbnail: '/projects/bakery-full.jpg'`.
3. Choose a `layout`:
   - `'elevation'`: big browser frame that scrolls the full page on hover. Use a **tall full-page screenshot**
     (tip: Chrome DevTools → Ctrl+Shift+P → "Capture full size screenshot"). Best for WordPress/Shopify sites.
   - `'cut'`: code beside its result. Edit the `cut.lines` and `cut.preview` lists. Best for hand-coded work.
   - `'motion'`: three frames that fan out. Add `frames: ['/projects/a.jpg','/projects/b.jpg','/projects/c.jpg']`. Best for Framer.
   - `'list'`: a row in "More projects" with a floating hover preview.
4. Set `liveUrl` / `caseStudyUrl` (or leave `null`).
5. Set `placeholder: false` to remove the orange "Placeholder" stamp.
6. Set `experimental: true` for personal experiments (adds the "Experiment" badge).

Image tips: export as **.jpg or .webp**, max ~1600px wide, under ~400 KB each.

### Your portrait
Save it as `public/images/portrait.jpg`, then in `src/sections/About.jsx` change
`const PORTRAIT = null;` to `const PORTRAIT = '/images/portrait.jpg';`

### About text, timeline, skills, testimonials
- About paragraphs: `src/sections/About.jsx` (the `facets` list near the top).
- Timeline: `src/data/experience.js`. Replace the `[YYYY]` placeholders, set `placeholder: false`.
- Skills: `src/data/skills.js`. Please check the lines marked `VERIFY`.
- Testimonials: add real quotes to `src/data/testimonials.js` and the section appears automatically.

### Colours and fonts
`src/styles/variables.css`. Change a value once and it updates everywhere.

### Social sharing image
Add a 1200×630 image at `public/og-image.jpg`, then in `index.html` replace
`your-site.netlify.app` with your real address and uncomment the two `og:image` lines.

---

## 4. Contact form (Netlify Forms, free)

The form works **once deployed on Netlify**. There's nothing to set up in code.
- Messages appear in **Netlify → your site → Forms**.
- To get them by email: **Forms → Form notifications → Add notification → Email**.
- On your own computer (`npm run dev`) the form can't send. It shows a message with your email
  address instead, which is expected.
- Spam protection: a hidden "honeypot" field. You can also enable reCAPTCHA in Netlify.

If you ever rename a form field, update **both** `src/sections/Contact.jsx` and the hidden form in `index.html`.

---

## 5. Put it on GitHub

1. Create a free account at github.com, then **New repository** → name it `damodara-portfolio` →
   leave "Add README" unticked → **Create**.
2. In the project folder:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/damodara-portfolio.git
git push -u origin main
```

## 6. Deploy on Netlify (free)

1. Sign in at netlify.com with your GitHub account.
2. **Add new site → Import an existing project → GitHub** → pick `damodara-portfolio`.
3. Netlify reads `netlify.toml` automatically (build: `npm run build`, publish: `dist`). Click **Deploy**.
4. After a minute you get an address like `something.netlify.app`. Rename it in
   **Site configuration → Change site name**, or add your own domain under **Domain management**.

## 7. Updating the live site later

Edit files → then:

```bash
git add .
git commit -m "Add new project"
git push
```

Netlify rebuilds and publishes automatically within a minute or two.

---

## How it works (in plain English)

- **The 3D building** (`src/three/buildModel.js`) is made entirely from code (boxes, cylinders and lines),
  with no 3D model file to download. It uses flat "drawing" colours instead of lights, which makes it
  very cheap for the graphics card.
- **Lazy loading:** Three.js is large, so it downloads *after* the text appears (`React.lazy` in `Hero.jsx`).
  The first screen is readable immediately.
- **Pausing:** the 3D stops drawing when you scroll past it, and the experiment demos only start
  when they're on screen.
- **Phones:** lower pixel ratio, the building sits above the name, and dragging rotates it while
  vertical swipes still scroll the page.
- **No WebGL?** A static SVG drawing of the same building is shown instead (`HeroFallback.jsx`).
- **Reduced motion:** if a visitor's device has "reduce motion" on, the intro, floating and scroll
  reveals are switched off. All content is in the HTML regardless, so it's readable and indexable.
- **GSAP cleanup:** every animation is created inside `gsap.context()` and removed with `ctx.revert()`
  when a component unmounts, so nothing leaks or runs twice.

The `prototype/` folder is the earlier single-file visual prototype, kept for reference. It isn't part of the built site.
