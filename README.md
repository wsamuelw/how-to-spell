# How to Spell

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![No Dependencies](https://img.shields.io/badge/dependencies-none-success)]()
[![Content Filter](https://img.shields.io/badge/content-kid--safe-blue)](#-content-filter)
[![Status](https://img.shields.io/badge/status-active-success)]()

> Say, how to spell ... ?

Kids ask "how do you spell [word]?" a hundred times a day. In the car. At the dinner table. When you're busy. It's not annoying because you don't care — it's annoying because you can't always drop everything. This app gives them the answer on their own. Tap the button, say the word, see the spelling. Done.

<img align="left" width="400" height="700" alt="IMG_1723" src="https://github.com/user-attachments/assets/1ec65231-66b9-49d7-8af0-b396e2282626" />
<img width="400" height="700" alt="IMG_1726" src="https://github.com/user-attachments/assets/567bc2d0-69ca-4009-9215-0bc7f8e23d29" />

## 🎯 Live Demo

Try it now: **[wsamuelw.github.io/how-to-spell](https://wsamuelw.github.io/how-to-spell)** 

## ✨ Features

- **Voice Recognition** - Say "how to spell [word]" or just the word itself
- **Real-time Waveform** - Visual feedback when listening to your voice
- **Content Filter** - Blocks profanity, hate speech, slurs, and inappropriate words with fuzzy matching for obfuscated spellings
- **Kid-Friendly Errors** - Error messages written for children, not developers
- **No-Troll Design** - Every rejection looks identical (no "blocked!" scoreboard), words display letter-spaced (`D I N O S A U R`), mumbled speech is asked again rather than guessed, and all recognition candidates are screened before anything shows
- **Mobile Optimized** - Works perfectly on phones and tablets
- **Zero Setup** - No accounts, no passwords, no configuration
- **No Install** - Just open the link, no app store needed
- **Privacy First** - No voice recordings, no accounts, no word tracking (see [Privacy & Analytics](#-privacy--analytics))

## 📱 Use Cases

**1. Homework time**  
Your kid is writing a sentence and gets stuck on a word. Instead of yelling from the other room, they tap the mic, say the word, and get the spelling instantly. They stay in the flow. You stay sane.

**2. Road trips**  
"How do you spell 'dinosaur'?" for the fifth time in twenty minutes. Hand them the phone. Problem solved for the rest of the drive.

**3. Bedtime reading**  
Your kid finds a new word in their book and wants to know how to spell it. No need to stop reading. Just tap, say, see.

## 🚀 How It Works

1. Tap the microphone button (Allow to access the microphone)
2. Say "how to spell [word]" (or just say the word)
3. See the spelling on screen with visual waveform feedback
4. Tap anywhere to try another word

That's it. No accounts. No settings. No distractions.

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome (Android/Desktop) | ✅ Full | Best experience |
| Safari (iOS/macOS) | ✅ Full | iOS 14.3+ required |
| Firefox | ⚠️ Limited | May require flags |
| Edge | ✅ Full | Chromium-based |
| Samsung Internet | ✅ Full | Android only |

## 🛠️ Troubleshooting

### "Microphone access denied"
- **Cause**: Browser blocked microphone permission
- **Fix**: Go to browser settings → Site permissions → Microphone → Allow for this site

### "No microphone found"
- **Cause**: No microphone connected or detected
- **Fix**: Connect a microphone or use a device with built-in mic

### "No speech detected"
- **Cause**: Silence or background noise during recording
- **Fix**: Speak clearly within 2-3 seconds of tapping the mic

### "Network error"
- **Cause**: No internet connection (required for speech recognition)
- **Fix**: Check your internet connection and try again

### "Audio capture failed"
- **Cause**: Another app is using the microphone
- **Fix**: Close other apps using the microphone and refresh the page

## 💻 Tech Stack

- **Vanilla HTML, CSS, JavaScript** — No frameworks, no dependencies, no build step
- **Web Speech API** — Native browser speech recognition
- **Web Audio API** — Real-time waveform visualization
- **Google Analytics 4** — Anonymous usage tracking
- **Static Site** — Deployable anywhere (GitHub Pages, Netlify, Vercel, even a USB stick)

## 🛡️ Content Filter

The app includes a content filter to prevent displaying inappropriate words to children. The word lists are inlined in `index.html` (so filtering works instantly, with no network dependency); `blocked-words.json` mirrors them as a human-editable reference. It covers six categories:

| Category | Examples | Count |
|----------|----------|-------|
| Profanity | fuck, shit, bitch, asshole, cunt, wanker | 23 |
| Slurs | nigger, fag, chink, spic | 18 |
| Hate speech | racist, bigot, sexist | 7 |
| Sexual content | porn, nude, dildo | 19 |
| Bullying | loser, stupid, moron | 14 |
| Self-harm | suicide, kys, "want to die" | 14 |

**How it works:**
- Direct word matching via a normalised `Set` lookup (O(1))
- Symbol-to-letter mapping before normalisation (`@` → `a`, `!` → `i`, `$` → `s`)
- Fuzzy regex patterns for obfuscated spellings (missing vowels, repeated letters)
- Leetspeak substitution detection (0 → o, 1 → i, 3 → e, etc.)
- An allow-list for real words that would otherwise trip fuzzy patterns (e.g. Dickens, Dickinson)

### Limitations

The content filter is a **best-effort client-side check**, not a security boundary. It has known gaps:

- **Speech recognition output** — the Web Speech API returns what it hears, which is usually clean speech. A child saying "eff you" won't be caught because the API transcribes it as "f you" or "eff you", not the spelled-out word.
- **Novel obfuscation** — the fuzzy patterns cover common tricks (missing vowels, leetspeak, symbol substitution), but a motivated user can always find new ways to bypass client-side filtering.
- **Substring matching** — the filter checks whole words, not substrings. "ass" is blocked but "class" and "grass" pass through. This is intentional to avoid false positives on legitimate words.
- **Over-blocking trade-off** — some common words are blocked (e.g., "sex" in "sexual health", "anal" in "analogy"). The filter prioritises safety over completeness for a children's app.
- **No server-side validation** — the filter runs entirely in the browser. If you fork this repo, you can edit the word lists out of it.
- **Language limited** — currently English only. The Web Speech API's `lang` is set to `en-US`.

Contributions to improve the filter are welcome — see `blocked-words.json` for the word lists.

## 🔒 Privacy & Analytics

This app uses **Google Analytics 4** to track anonymous usage statistics:
- Page views with browser/device type
- Voice recognition events (success/failure)

**What we DON'T track:**
- Personal information
- Voice recordings
- Specific words searched (only word length)
- User identity, location, or raw user agent strings

You can view the implementation in the `gtag` script tag near the top of `index.html`.

## 🏃 Running Locally

```bash
# Clone the repo
git clone https://github.com/wsamuelw/how-to-spell.git
cd how-to-spell

# Option 1: Open directly in browser
open index.html

# Option 2: Use a local server (recommended for mobile testing)
python3 -m http.server 8000
# Then visit: http://localhost:8000
```

That's it. No build step. No `npm install`. Just open the file.

## 🧪 Tests

```bash
node test/test.js
```

Runs the app's inline scripts headlessly and asserts content-filter behaviour, word extraction, and that the blocklists inlined in `index.html` stay identical to `blocked-words.json`. Runs automatically on every push via GitHub Actions. No dependencies.

## 📦 Deployment Options

### GitHub Pages (Recommended)
```bash
# Enable GitHub Pages in repo settings
# Your site will be live at: username.github.io/repo-name
```

### Netlify
1. Drag & drop the folder to [netlify.com](https://netlify.com)
2. Or connect your GitHub repo for auto-deploy

### Vercel
```bash
npm i -g vercel
vercel
```

## 🤝 Contributing

PRs welcome! Keep it simple — this app works because it does one thing well.

**Before submitting:**
- Test on mobile devices (iOS Safari + Android Chrome)
- Ensure no new dependencies are added
- Keep bundle size minimal
- Open an issue first if your change adds complexity

**Development guidelines:**
- No frameworks or build tools
- Vanilla JS only
- Mobile-first design
- Accessibility matters

## ❓ FAQ

**Q: Does it work offline?**  
A: The UI works offline, but voice recognition requires an internet connection in most browsers.

**Q: Is it free?**  
A: Yes, completely free and open source (MIT license).

**Q: Can I use it for other languages?**  
A: Currently optimized for English. Multi-language support would require additional development.

**Q: Why Google Analytics?**  
A: To understand usage patterns and improve the app. All data is anonymous and aggregated.

**Q: My kid broke it!**  
A: Just refresh the page. Nothing can break permanently — it's just HTML!

## 📄 License

MIT License — feel free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

Made with ❤️ for parents everywhere
