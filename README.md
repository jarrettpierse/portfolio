# Portfolio — File Structure

A vintage macOS-themed portfolio site. Fully static — no build step, no npm, no dependencies.

---

## Folder structure

```
portfolio/
├── index.html        ← Base HTML shell (rarely needs editing)
├── content.js        ← ✏️  YOUR CONTENT — edit this file only
├── css/
│   └── mac.css       ← All styles (desktop + mobile)
└── js/
    └── mac-engine.js ← UI engine: reads content.js and builds everything
```

---

## How to update your content

**Open `content.js`.** That's it. Everything is clearly labelled:

| Section           | What to edit                                   |
|-------------------|------------------------------------------------|
| `site`            | Your name, location, status, browser tab title |
| `about.portraitUrl` | Paste a photo URL to replace the placeholder |
| `about.bio`       | The full text shown in the "about me.txt" modal |
| `about.skills`    | Your skill pill tags                           |
| `workExperience`  | Add/remove jobs, fill in case study `body` HTML|
| `services`        | Add/remove services, update descriptions       |
| `contact`         | Your email, LinkedIn, GitHub, website links    |

### Adding a new work experience entry

Copy and paste this block inside the `workExperience: [ ]` array in `content.js`:

```js
{
  id:      "newjob",           // unique ID, no spaces
  company: "Company Name",
  role:    "Your Role",
  period:  "2024–Present",
  tags:    ["Tag 1", "Tag 2"],
  body: `
    <h2>Company Name</h2>
    <span class="cs-tag">Tag 1</span>
    <p>Describe what you did here.</p>
  `,
},
```

### Adding a new service

Copy and paste this block inside the `services: [ ]` array:

```js
{
  icon:   "🔧",
  title:  "Service Name",
  desc:   "One or two sentence description shown on the card.",
  detail: "Longer description shown when clicked.",
},
```

### Updating your portrait

In `content.js`, set:
```js
portraitUrl: "https://your-image-hosting.com/your-photo.jpg",
```

---

## Deploying to GitHub Pages

1. Create a repo named `your-username.github.io`
2. Push this entire `portfolio/` folder contents to the **root** of the repo
3. Go to **Settings → Pages**, set source to `main` / `/ (root)`
4. Your site will be live at `https://your-username.github.io`

> ⚠️ Make sure `index.html` is at the root of the repo, not inside a subfolder.

---

## Files you should never need to edit

- `index.html` — just a shell that loads everything
- `css/mac.css` — all the styling
- `js/mac-engine.js` — all the logic
