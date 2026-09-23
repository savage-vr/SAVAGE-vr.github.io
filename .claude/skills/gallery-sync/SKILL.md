---
name: gallery-sync
description: Crawl the #SAVAGE_vr hashtag on X in Chrome and add or update Gallery images (public/slide + slides.json) with photographer credits. Use when asked to update the gallery, import #SAVAGE_vr photos, or remove an imported photo.
---

# Gallery sync from #SAVAGE_vr

Gallery shows every image in `public/slide/`, listed in `src/app/_data/slides.json`.
Images imported from X are named `x_<tweetId>_<n>.{jpg,webp}` and their credits
live in `src/app/_data/gallery-sources.json`:

- `imported`: basename → `{ tweetId, author, url, postedAt }`. Shown as "Photo by @author" linking to the post.
- `skipped`: tweet IDs the user rejected. Never propose these again.

`scripts/import-x-images.js` does all file work. Never download or edit
`slides.json` by hand.

Photos belong to the people who posted them. **Only import images the user
picked** in this run; never import in bulk without that choice.

## 1. Crawl X in Chrome

Invoke the `claude-in-chrome` skill, then in one ToolSearch load `tabs_context_mcp`,
`tabs_create_mcp`, `navigate`, `javascript_tool`, `computer`, `tabs_close_mcp`.

1. `tabs_context_mcp`, then open a new tab and navigate to
   `https://x.com/search?q=%23SAVAGE_vr%20filter%3Aimages&src=typed_query&f=live`
   (latest posts with images). If X shows a login screen, stop and ask the user to log in.
2. X keeps only the visible posts in the DOM, so collect while scrolling. Run this
   with `javascript_tool`, repeating it until it reports `done` or ~15 rounds:

   ```js
   (async () => {
     const store = (window.__savage ??= new Map())
     for (const article of document.querySelectorAll('article[data-testid="tweet"]')) {
       const time = article.querySelector('a[href*="/status/"] time')
       if (!time) continue
       const url = new URL(time.closest('a').href)
       const [, handle, , tweetId] = url.pathname.split('/')
       // Skip reposts: the hashtag must be in this post's own text
       const text = article.querySelector('[data-testid="tweetText"]')?.innerText ?? ''
       if (!/#SAVAGE_vr/i.test(text)) continue
       const images = [...article.querySelectorAll('[data-testid="tweetPhoto"] img')]
         .map(img => img.src)
         .filter(src => src.includes('pbs.twimg.com/media/'))
       if (images.length === 0) continue
       store.set(tweetId, {
         tweetId,
         url: `https://x.com/${handle}/status/${tweetId}`,
         author: `@${handle}`,
         postedAt: time.dateTime,
         images,
       })
     }
     const before = document.documentElement.scrollHeight
     window.scrollBy(0, window.innerHeight * 2)
     await new Promise(r => setTimeout(r, 2000))
     const done = document.documentElement.scrollHeight === before
     return JSON.stringify({ count: store.size, done })
   })()
   ```

   Also stop early once the crawl reaches posts that are already in
   `gallery-sources.json` (`imported` or `skipped`), since everything older has been reviewed.
3. Read the result with `javascript_tool`: `JSON.stringify([...window.__savage.values()])`.
   Write it to `<scratchpad>/candidates.json`, then close the tab.

## 2. Let the user pick

```bash
node scripts/import-x-images.js preview <scratchpad>/candidates.json
open <scratchpad>/candidates.html
```

`preview` drops posts already imported or skipped and numbers the rest.
If there are no new images, say so and stop. Otherwise ask the user which
numbers to add (e.g. `1,3,5`), or `none`.

## 3. Import

```bash
node scripts/import-x-images.js import <scratchpad>/candidates.json --pick 1,3,5
```

This downloads the originals (max 2560px) as jpg + webp into `public/slide/`,
records credits, adds the posts that weren't picked to `skipped`, and regenerates `slides.json`.
Pass `--keep-rest` when the user wants to decide on the others later.
For `none`, run with `--pick 0` so the posts are all marked skipped.

## Removing a photo

When the user asks to take a photo down (for example, the photographer asked):

```bash
node scripts/import-x-images.js remove <tweetId or basename>
```

This deletes the files, moves the post to `skipped`, and regenerates `slides.json`.

## Adjusting the framing

Gallery crops every image to 16:9 around its center. To show a different part
(e.g. a portrait photo), add `"position": "50% 30%"` (CSS `object-position`;
0% = top/left, 50% = center) to that image's entry in `gallery-sources.json`
and run `npm run generate-slides`.

## 4. Check and report

- `npx tsc --noEmit`, and load `http://localhost:3000` if the dev server is running (200 means `slides.json` passed the schema).
- Report which images were added (author + post URL) and the new total.
- Do not commit or push unless the user asks.
