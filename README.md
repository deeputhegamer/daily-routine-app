# Road to 78

A personal weight-gain tracker (71 → 78 kg) that installs on an iPhone as a Home Screen app.
There's no backend, no login and no build step: it's plain HTML, CSS and JS. All data stays on the phone,
in the browser's local storage.

## What's inside

| Tab | What it does |
|---|---|
| **Progress** | 7-day average weight, progress bar with a "where the plan expects you" marker, weekly rate, projected finish date, streak, workouts this week, weight chart (1M / 3M / full goal), calories and protein for the last 14 days, 5-week consistency heatmap |
| **Today** | Morning weight, 8 meals from the diet plan (tick to add calories and protein), extra foods, water glasses, and the day's workout with a kg/reps box plus your last value |
| **Plan** | The full weekly diet and workout plan, foods that suit you, foods to skip, tips |
| **Settings** | Goal and targets, gym/home workouts, backup and restore (JSON file), erase |

## Put it on GitHub Pages

```bash
cd ~/Desktop/road-to-78
git init && git add . && git commit -m "Road to 78 tracker"
gh repo create road-to-78 --public --source=. --push
gh api -X POST repos/{owner}/road-to-78/pages -f "source[branch]=main" -f "source[path]=/"
```

Or do it in the browser: create a repo on github.com, upload these files, then go to
**Settings → Pages → Deploy from branch → main / (root)**.

About a minute later the app is live at `https://<your-username>.github.io/road-to-78/`.
(GitHub Pages on a free account needs a **public** repo. That's fine, because the repo contains no personal data.)

## Install on iPhone

1. Open the link in **Safari**.
2. Tap **Share → Add to Home Screen → Add**.
3. From now on, always open it from the Home Screen icon. It works offline.

## Updating the app later

1. Edit the files.
2. Bump `CACHE` in `sw.js` (e.g. `road78-v2`).
3. Commit and push.

The phone picks up the new version the second time you open the app.
Your data isn't affected.

## Backups

The data lives only on the phone. Use **Settings → Back up** about once a week and save the file to Files / iCloud Drive.
**Restore** reads that file back in (for example on a new phone).

## Run locally

```bash
python3 -m http.server 4378 --directory ~/Desktop/road-to-78
```

Then open http://localhost:4378.
