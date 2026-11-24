Language: English | [简体中文](https://github.com/Luogu-Plugins/Luogu-Display-Better/blob/main/README/Chinese.md) | [繁體中文](https://github.com/Luogu-Plugins/Luogu-Display-Better/blob/main/README/Chinese-Traditional.md)

<h1 align="center">Luogu Display Better</h1>
<p align="center">Lightweight user script for Luogu — customize your interface freely.</p>

<p align="center">
  <a href="https://github.com/Luogu-Plugins/Luogu-Display-Better/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Luogu-Plugins/Luogu-Display-Better" alt="GitHub license" />
  </a>
  <a href="https://github.com/Luogu-Plugins/Luogu-Display-Better">
    <img src="https://img.shields.io/github/languages/code-size/Luogu-Plugins/Luogu-Display-Better" alt="GitHub code size" />
  </a>
  <a href="https://github.com/Luogu-Plugins/Luogu-Display-Better/issues">
    <img src="https://img.shields.io/github/issues/Luogu-Plugins/Luogu-Display-Better" alt="GitHub issues" />
  </a>
  <a href="https://github.com/Luogu-Plugins/Luogu-Display-Better/pulls">
    <img src="https://img.shields.io/github/issues-pr/Luogu-Plugins/Luogu-Display-Better" alt="GitHub pull requests" />
  </a>
  <a href="https://github.com/Luogu-Plugins/Luogu-Display-Better/releases/latest">
    <img src="https://img.shields.io/github/v/release/Luogu-Plugins/Luogu-Display-Better" alt="GitHub release" />
  </a>
  <a href="https://github.com/Luogu-Plugins/Luogu-Display-Better/stargazers">
    <img src="https://img.shields.io/github/stars/Luogu-Plugins/Luogu-Display-Better" alt="GitHub stars" />
  </a>
  <a href="https://github.com/Luogu-Plugins/Luogu-Display-Better/forks">
    <img src="https://img.shields.io/github/forks/Luogu-Plugins/Luogu-Display-Better" alt="GitHub forks" />
  </a>
</p>

---

## Project Overview

Luogu Display Better is a lightweight user script for [Luogu](https://www.luogu.com.cn) that provides visual improvements and per-user customization through a settings panel. It supports card blur, card/top bar/sidebar opacity, rounded corners, fullscreen backgrounds, ad hiding, custom CSS injection, and update channel switching.

## Highlights

- **Card Blur**: Add frosted-glass blur effects to cards, overlays, pop-ups, and comments.
- **Card Opacity**: Adjust card background transparency for a lighter, more transparent, or cleaner look.
- **Top Bar Opacity**: Adjust the transparency of the top navigation bar independently from cards.
- **Sidebar Opacity**: Adjust the transparency of the sidebar independently from cards.
- **Card Radius**: Customize the corner radius for cards, article areas, panels, and other elements.
- **Image Radius**: Apply rounded corners to images for improved aesthetics.
- **Fullscreen Background**: Extend the midground image, gradient, or solid color configured on Luogu's Theme page to cover the entire page while keeping its repeat and position settings.
- **Ad Blocker**: Hide sidebar ad cards to reduce visual noise.
- **Custom CSS**: Inject custom CSS directly to quickly personalize the interface.
- **Update Channel**: Switch between the stable and latest update channels and check for updates right from the settings panel.
- **Refined Controls**: Theme-aware inputs, textareas, selects, dropdown menus, checkboxes, and buttons for a consistent look.

## Installation

1. Install a user script manager such as Tampermonkey, Violentmonkey, or Greasemonkey.
2. Import [`LuoguDisplayBetter.user.js`](https://github.com/Luogu-Plugins/Luogu-Display-Better/releases/download/latest/LuoguDisplayBetter.user.js) into the manager.
3. Open or refresh [Luogu](https://www.luogu.com.cn); the script will run automatically.

## Usage

- On first run, the script initializes default settings automatically.
- After the page loads, a “Style Plugin Settings” button appears in the sidebar. Click it to open the settings panel.
- Move sliders and toggle switches in the panel to preview changes in real time; changes apply immediately.
- Card, top bar, and sidebar opacity each have their own slider and can be tuned independently.
- Custom CSS entered in the panel is injected into the page instantly.
- Settings are stored locally and stay in sync across all open Luogu tabs, and the panel controls refresh automatically.
- The panel also provides an update channel selector, a check-for-updates button, and a reset button to restore default settings.
- Press <kbd>Esc</kbd> or click the close button in the top-right corner to close the settings panel.

## Contributing & Feedback

- Issues and pull requests are welcome — feel free to report compatibility problems, suggest style improvements, or propose new features.
- Join us to build a better script together.

## License

This project is licensed under the MIT License. See [LICENSE](https://github.com/Luogu-Plugins/Luogu-Display-Better/blob/main/LICENSE) for details.
