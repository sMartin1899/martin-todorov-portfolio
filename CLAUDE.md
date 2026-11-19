# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

- Static personal portfolio for Martin Todorov. Content comes from `Martin Todorov's Resume.pdf`, plus `about me.md`.
- Sections: header (photo `1713176150553.jpg`), About, Experience, Skills, Projects, Education, Beyond Work, Contact.
- The "Download CV" buttons link to the resume PDF.
- Contact email on the site is `scar_man@abv.bg`. Don't use the phone, address or email from the PDF.
- No build step. Open `index.html` in a browser to run it.
- `index.html`: all page markup.
- `style.css`: all styles. Colour tokens sit on `:root` (Midnight & Coral palette).
- `app.js`: vanilla JS. Handles the mobile menu, scroll reveal, rotating hero word, count-up, card spotlight and copy-email.
- Fonts: Space Grotesk and Inter from Google Fonts. The user approved this external resource.
- Software logos: Simple Icons from jsDelivr, pinned to `simple-icons@16.36.0`. The user approved this. Adobe and Microsoft logos aren't in Simple Icons, so they use CSS letter tiles.




## Environment

- Windows 11, PowerShell 5.1 (no `&&`/`||` chaining; use `;` or `if ($?) { ... }`).
- The user's PowerShell profile defines `claude-danger` as a shortcut for `claude --dangerously-skip-permissions`. It must be run from a terminal, not typed into a Claude prompt.

Update this file with build, test and architecture notes once real code is added.

## Conventions

- One file per concern: `index.html`, `style.css`, `app.js`
- Write in short sentences. One idea each.
- If anything is unclear, ask me a question before making assumptions.

## Prohibitions

- Don't add any external libraries or packages without asking me first.
- Do not delete any files without asking me first.
- Do not commit any secrets — no API keys, passwords, or tokens in the files.
