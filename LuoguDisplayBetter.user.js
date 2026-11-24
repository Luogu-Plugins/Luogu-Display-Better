// ==UserScript==
// @name         Luogu Display Better
// @namespace    https://github.com/Luogu-Plugins
// @version      1.5.0
// @description  Change your Luogu style what you like best
// @author       Luogu-Plugins
// @match        *://www.luogu.com.cn/*
// @match        *://www.luogu.com/*
// @connect      github.com
// @connect      raw.githubusercontent.com
// @connect      cdn.jsdelivr.net
// @connect      fastly.jsdelivr.net
// @connect      gcore.jsdelivr.net
// @connect      testingcf.jsdelivr.net
// @connect      purge.jsdelivr.net
// @connect      cdn.jsdmirror.com
// @connect      jsd.cdn.zzko.cn
// @connect      ghproxy.net
// @connect      ghfast.top
// @connect      gh-proxy.com
// @connect      ghproxy.homeboyc.cn
// @connect      ghp.ci
// @connect      moeyy.cn
// @connect      v6.gh-proxy.org
// @connect      ghfile.geekertao.top
// @connect      gh.geekertao.top
// @connect      github.dpik.top
// @connect      gh.felicity.ac.cn
// @connect      gh.llkk.cc
// @connect      raw.gitmirror.com
// @connect      raw.staticdn.net
// @connect      raw.githubusercontents.com
// @icon         https://fecdn.luogu.com.cn/columba/static.325908fec383795b.logo-single-color.svg
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const STYLE_IDS = {
        rounded: 'ldb-rounded-style',
        blur: 'ldb-blur-style',
        opacity: 'ldb-opacity-style',
        navOpacity: 'ldb-nav-opacity-style',
        editorLayout: 'ldb-editor-layout-style',
        bgFullscreen: 'ldb-bgfullscreen-style',
        bgFullscreenEarly: 'ldb-bgfullscreen-early-style',
        adBlock: 'ldb-adblock-style',
        customCSS: 'ldb-custom-style',
        idePadding: 'ldb-ide-padding-style',
        scrollbar: 'ldb-scrollbar-style',
        controls: 'ldb-controls-style'
    };

    const EDITOR_GAP = 10;
    const EDITOR_Z_INDEX = 1500;
    const DOM_POLL_INTERVAL = 200;
    const SETTINGS_PANEL_DELAY = 150;

    const SETTING_KEYS = [
        'cardborderRad',
        'picborderRad',
        'blur',
        'opacity',
        'topbarOpacity',
        'sidebarOpacity',
        'cardRounded',
        'picRounded',
        'adBlock',
        'bgFullscreen',
        'customCSS',
        'updateChannel'
    ].map(key => 'LuoguDisplayBetter-' + key);

    // ---- Lucide icons (inline, no external asset) ----
    const ICON_PATHS = {
        sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
        x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        refreshCw: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
        rotateCcw: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'
    };
    function icon(name, size = 16) {
        return `<svg class="ldb-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[name] || ''}</svg>`;
    }

    const UPDATE_URLS = {
        stable: [
            'https://cdn.jsdmirror.com/gh/Luogu-Plugins/Luogu-Display-Better@main/LuoguDisplayBetter.user.js',
            'https://jsd.cdn.zzko.cn/gh/Luogu-Plugins/Luogu-Display-Better@main/LuoguDisplayBetter.user.js',
            'https://ghproxy.net/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://ghfast.top/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://gh-proxy.com/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://gh.llkk.cc/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://ghproxy.homeboyc.cn/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://moeyy.cn/gh-proxy/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://v6.gh-proxy.org/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://ghfile.geekertao.top/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://gh.geekertao.top/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://github.dpik.top/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://gh.felicity.ac.cn/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://ghp.ci/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://raw.gitmirror.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://raw.staticdn.net/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://raw.githubusercontents.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js',
            'https://fastly.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@main/LuoguDisplayBetter.user.js',
            'https://gcore.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@main/LuoguDisplayBetter.user.js',
            'https://testingcf.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@main/LuoguDisplayBetter.user.js',
            'https://cdn.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@main/LuoguDisplayBetter.user.js',
            'https://github.com/Luogu-Plugins/Luogu-Display-Better/raw/main/LuoguDisplayBetter.user.js',
            'https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/main/LuoguDisplayBetter.user.js'
        ],
        latest: [
            'https://cdn.jsdmirror.com/gh/Luogu-Plugins/Luogu-Display-Better@dev/LuoguDisplayBetter.user.js',
            'https://jsd.cdn.zzko.cn/gh/Luogu-Plugins/Luogu-Display-Better@dev/LuoguDisplayBetter.user.js',
            'https://ghproxy.net/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://ghfast.top/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://gh-proxy.com/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://gh.llkk.cc/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://ghproxy.homeboyc.cn/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://moeyy.cn/gh-proxy/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://v6.gh-proxy.org/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://ghfile.geekertao.top/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://gh.geekertao.top/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://github.dpik.top/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://gh.felicity.ac.cn/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://ghp.ci/https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://raw.gitmirror.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://raw.staticdn.net/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://raw.githubusercontents.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js',
            'https://fastly.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@dev/LuoguDisplayBetter.user.js',
            'https://gcore.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@dev/LuoguDisplayBetter.user.js',
            'https://testingcf.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@dev/LuoguDisplayBetter.user.js',
            'https://cdn.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@dev/LuoguDisplayBetter.user.js',
            'https://github.com/Luogu-Plugins/Luogu-Display-Better/raw/dev/LuoguDisplayBetter.user.js',
            'https://raw.githubusercontent.com/Luogu-Plugins/Luogu-Display-Better/dev/LuoguDisplayBetter.user.js'
        ]
    };

    let cardborderRad, picborderRad, blurValue, opacityValue;
    let topbarOpacityValue, sidebarOpacityValue;
    let cardRounded, picRounded, bgFullscreen, adBlock, customCSS, updateChannel;

    let panelCreated = false;
    let panelElement = null;
    let customCssTextarea = null;

    let customCssSaveTimer = null;
    let layoutUpdateTimer = null;
    let domPollTimer = null;
    let bgObserver = null;
    let themeRefreshRaf = null;
    let themePageObserver = null;
    let observedThemePage = null;
    let lastThemeSignature = '';
    let lastSettingsSignature = '';
    let lastIdeLayoutSignature = '';

    function removeStyleElement(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function isDarkTheme() {
        const root = document.documentElement;
        const theme = root.dataset.lcolorTheme;
        if (theme === 'dark') return true;
        if (theme === 'light') return false;
        if (theme === 'auto' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        if (root.classList.contains('lcolor-theme-dark')) return true;
        if (document.body) {
            const scheme = getComputedStyle(document.body).colorScheme;
            if (scheme === 'dark') return true;
            if (scheme === 'light') return false;
        }
        return false;
    }

    function parseColorToRgb(value) {
        if (!value) return null;
        const color = value.trim();

        let match = color.match(/^#([0-9a-f]{3,8})$/i);
        if (match) {
            let hex = match[1];
            if (hex.length === 3 || hex.length === 4) {
                hex = hex.split('').map(ch => ch + ch).join('');
            }
            if (hex.length === 8) hex = hex.slice(0, 6);
            if (hex.length !== 6) return null;
            return [0, 2, 4]
                .map(i => parseInt(hex.slice(i, i + 2), 16))
                .join(', ');
        }

        match = color.match(/^rgba?\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)/i);
        if (match) {
            const channels = match.slice(1, 4).map(channel => {
                return channel.endsWith('%')
                    ? Math.round(parseFloat(channel) * 2.55)
                    : Math.round(parseFloat(channel));
            });
            if (channels.some(channel => isNaN(channel))) return null;
            return channels.join(', ');
        }

        match = color.match(/^([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)$/);
        if (match) {
            const channels = match.slice(1, 4).map(channel => Math.round(parseFloat(channel)));
            if (channels.some(channel => isNaN(channel))) return null;
            return channels.join(', ');
        }

        return null;
    }

    function resolveCardBaseColor() {
        const themePage = document.querySelector('.theme-page');
        if (themePage) {
            const themed = parseColorToRgb(
                getComputedStyle(themePage).getPropertyValue('--theme-card-background')
            );
            if (themed) return themed;
        }

        const rootStyle = getComputedStyle(document.documentElement);
        const container = parseColorToRgb(rootStyle.getPropertyValue('--lcolor--bg-container'));
        if (container) return container;

        const elevated = parseColorToRgb(rootStyle.getPropertyValue('--lcolor--bg-elevated'));
        if (elevated) return elevated;

        return isDarkTheme() ? '29, 32, 37' : '255, 255, 255';
    }

    function getThemeSignature() {
        const themePage = document.querySelector('.theme-page');
        const rootStyle = getComputedStyle(document.documentElement);
        const parts = [
            isDarkTheme() ? 'dark' : 'light',
            themePage ? 'theme-page' : 'no-theme-page',
            rootStyle.getPropertyValue('--lcolor--bg-container').trim(),
            rootStyle.getPropertyValue('--lcolor--bg-layout').trim()
        ];
        if (themePage) {
            const inline = themePage.style;
            parts.push(
                inline.getPropertyValue('--theme-body-image').trim(),
                inline.getPropertyValue('--theme-body-color').trim(),
                inline.getPropertyValue('--theme-body-back').trim(),
                inline.getPropertyValue('--theme-body-image-position').trim(),
                inline.getPropertyValue('--theme-body-image-size').trim(),
                inline.getPropertyValue('--theme-body-image-repeat').trim(),
                inline.getPropertyValue('--theme-body-color-filter').trim(),
                inline.getPropertyValue('--theme-card-background').trim(),
                inline.getPropertyValue('--theme-navi-back').trim()
            );
            const pageStyle = getComputedStyle(themePage);
            parts.push(
                pageStyle.getPropertyValue('--theme-card-background').trim(),
                pageStyle.getPropertyValue('--theme-navi-back').trim()
            );
        }
        return parts.join('|');
    }

    function refreshThemeStyles() {
        const signature = getThemeSignature();
        if (signature === lastThemeSignature) return;
        lastThemeSignature = signature;
        applyCardOpacity();
        applyFullscreenBackground();
        updatePanelStyle();
    }

    function computeCardColor() {
        const alpha = isNaN(opacityValue) ? 1 : opacityValue / 100;
        return `rgba(${resolveCardBaseColor()}, ${alpha})`;
    }

    function copyDataAttributes(source, target) {
        for (const attr of source.attributes) {
            if (attr.name.startsWith('data-v-')) {
                target.setAttribute(attr.name, attr.value);
            }
        }
    }

    function compareVersions(a, b) {
        const pa = a.split('.').map(Number);
        const pb = b.split('.').map(Number);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            const na = pa[i] || 0;
            const nb = pb[i] || 0;
            if (na > nb) return 1;
            if (na < nb) return -1;
        }
        return 0;
    }

    function getSettingsSignature() {
        return SETTING_KEYS.map(key => {
            const value = localStorage.getItem(key);
            return value == null ? '\u0000' : value;
        }).join('\u0001');
    }

    function clampPercent(value, fallback) {
        const parsed = parseFloat(value);
        const number = isNaN(parsed) ? fallback : parsed;
        return Math.min(100, Math.max(0, number));
    }

    function readPercent(key, fallback) {
        const raw = localStorage.getItem(key);
        return raw == null || raw === '' ? fallback : clampPercent(raw, fallback);
    }

    function loadSettings() {
        cardborderRad = parseFloat(localStorage.getItem("LuoguDisplayBetter-cardborderRad") ?? 15);
        picborderRad = parseFloat(localStorage.getItem("LuoguDisplayBetter-picborderRad") ?? 8);
        blurValue = parseFloat(localStorage.getItem("LuoguDisplayBetter-blur") ?? 10);
        opacityValue = parseFloat(localStorage.getItem("LuoguDisplayBetter-opacity") ?? 75);
        topbarOpacityValue = readPercent(
            "LuoguDisplayBetter-topbarOpacity",
            isNaN(opacityValue) ? 75 : opacityValue
        );
        sidebarOpacityValue = readPercent(
            "LuoguDisplayBetter-sidebarOpacity",
            isNaN(opacityValue) ? 75 : opacityValue
        );
        cardRounded = localStorage.getItem("LuoguDisplayBetter-cardRounded") !== 'false';
        picRounded = localStorage.getItem("LuoguDisplayBetter-picRounded") !== 'false';
        adBlock = localStorage.getItem("LuoguDisplayBetter-adBlock") === 'true';
        bgFullscreen = localStorage.getItem("LuoguDisplayBetter-bgFullscreen") !== 'false';
        customCSS = localStorage.getItem("LuoguDisplayBetter-customCSS") ?? '';
        updateChannel = localStorage.getItem("LuoguDisplayBetter-updateChannel") ?? 'stable';
        lastSettingsSignature = getSettingsSignature();
    }

    function writeDefaultSettings() {
        const defaults = {
            "LuoguDisplayBetter-cardborderRad": 15,
            "LuoguDisplayBetter-picborderRad": 8,
            "LuoguDisplayBetter-blur": 10,
            "LuoguDisplayBetter-cardRounded": true,
            "LuoguDisplayBetter-picRounded": true,
            "LuoguDisplayBetter-adBlock": false,
            "LuoguDisplayBetter-bgFullscreen": true,
            "LuoguDisplayBetter-opacity": 75,
            "LuoguDisplayBetter-topbarOpacity": 75,
            "LuoguDisplayBetter-sidebarOpacity": 75,
            "LuoguDisplayBetter-customCSS": '',
            "LuoguDisplayBetter-updateChannel": 'stable'
        };
        for (const [key, value] of Object.entries(defaults)) {
            localStorage.setItem(key, value);
        }
    }

    function saveAndApply(key, value) {
        localStorage.setItem(key, value);
        loadSettings();
        applyAll();
    }

    function applyRoundedCorners() {
        removeStyleElement(STYLE_IDS.rounded);
        if (isNaN(cardborderRad) && isNaN(picborderRad)) return;

        const cardRadius = cardborderRad + 'px';
        const picRadius = picborderRad + 'px';
        let css = '';

        if (cardRounded) {
            css = `.l-card, .lg-article, .card { border-radius: ${cardRadius} !important; }
                .swal2-popup { border-radius: ${cardRadius} !important; }
                .l-form-layout, .am-panel { border-radius: ${cardRadius} !important; }
                .author[data-v-5562c764], .meta {
                    border-top-left-radius: ${cardRadius} !important;
                    border-top-right-radius: ${cardRadius} !important;
                    border-bottom-left-radius: 0px !important;
                    border-bottom-right-radius: 0px !important;
                }
                .dropdown .center, .cs-dialog { border-radius: ${cardRadius} !important; }
                .user-header-top { border-top-left-radius: ${cardRadius}; border-top-right-radius: ${cardRadius}; }
                .user-header-bottom { border-bottom-left-radius: ${cardRadius}; border-bottom-right-radius: ${cardRadius}; }
                .user-nav { border-bottom-left-radius: ${cardRadius}; border-bottom-right-radius: ${cardRadius}; }
                .test-case { border-radius: 10px; }
                html.ldb-bgfullscreen .article-banner.article-banner { border-top-left-radius: ${cardRadius} !important; border-top-right-radius: ${cardRadius} !important; }
                html.ldb-bgfullscreen .article-content.article-content { border-bottom-left-radius: ${cardRadius} !important; border-bottom-right-radius: ${cardRadius} !important; }
                html.ldb-bgfullscreen .toc.toc { border-radius: .5em !important; }
                .ide-container { border-radius: ${cardRadius} !important; }
                .ide-textarea[readonly].lfe-code { border-bottom-right-radius: ${cardRadius} !important; }
                .am-viewport { border-radius: ${cardRadius} !important; }
                .am-slider-default {
                    background-color: transparent !important;
                    -webkit-box-shadow: 0 0 0px rgba(0,0,0,0) !important;
                    box-shadow: 0 0 0px rgba(0,0,0,0) !important;
                }
                .casket.cs-full-screen {
                    border-radius: ${cardRadius} !important;
                    overflow: hidden !important;
                }`;
        }
        if (picRounded) css += `img { border-radius: ${picRadius} !important; }`;

        const style = document.createElement('style');
        style.id = STYLE_IDS.rounded;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function applyCardBlur() {
        removeStyleElement(STYLE_IDS.blur);
        if (isNaN(blurValue)) return;

        const val = blurValue === 0 ? 'none' : `blur(${blurValue}px)`;

        const style = document.createElement('style');
        style.id = STYLE_IDS.blur;
        style.textContent = `.lg-article, .card:not(:has(canvas)), .l-card:not(:has(canvas)) { backdrop-filter: ${val} !important; -webkit-backdrop-filter: ${val} !important; }
            .dropdown .center, .popup { backdrop-filter: ${val} !important; -webkit-backdrop-filter: ${val} !important; }
            .am-comment-hd, .am-comment-bd { backdrop-filter: ${val} !important; -webkit-backdrop-filter: ${val} !important; }
            .article-banner { backdrop-filter: ${val} !important; -webkit-backdrop-filter: ${val} !important; }
            .top-bar, .sidebar, .lside, nav.lfe-body, .user-nav.rside, .wrapper.wrapped.lfe-body.header-layout.tiny { backdrop-filter: ${val} !important; -webkit-backdrop-filter: ${val} !important; }
            .dropdown, .dropdown .center, .popup,
            .lfe-dropdown, .el-dropdown-menu,
            .el-popper, .dropdown-menu,
            .ant-dropdown, .ant-select-dropdown {
                z-index: 999999 !important;
                transform: translateZ(0) !important;
            }
            .dropdown-container, .el-popper, .el-dropdown-menu,
            .lfe-dropdown, .ant-dropdown, .ant-select-dropdown,
            .dropdown-menu { overflow: visible !important; }
            .header-layout, .top-bar { z-index: 1000 !important; }
            .theme-page.theme-frosted .l-card::before,
            .theme-page.theme-frosted > footer {
                -webkit-backdrop-filter: none !important;
                backdrop-filter: none !important;
            }`;
        document.head.appendChild(style);
    }

    function applyCardOpacity() {
        removeStyleElement(STYLE_IDS.opacity);
        if (isNaN(opacityValue)) return;

        const cardColor = computeCardColor();

        const style = document.createElement('style');
        style.id = STYLE_IDS.opacity;
        style.textContent = `.lg-article, .l-card, .card { background-color: ${cardColor} !important; }
            .theme-page.theme-frosted .l-card::before { background-color: transparent !important; }
            .dropdown .center, .popup { background-color: ${cardColor} !important; }
            .am-comment-hd, .am-comment-bd { background-color: ${cardColor} !important; }
            .user-header-bottom { background-color: transparent !important; }
            .ide-container { background-color: ${cardColor} !important; }
            .panel-layout>.panel-divider.with-icon { background-color: transparent !important; }
            .panel-layout>.panel-divider.dragging { background-color: var(--lfe-color--primary) !important; }
            .ͼ2 .cm-gutters, .ide-toolbar { background-color: transparent !important; border: 0px solid transparent !important; }
            .refined-input { background-color: transparent !important; }
            .panel-divider, .layout-horizontal>.panel-divider { background-color: transparent !important; }
            .combo-wrapper>.text, .lform-size-middle.block-item.tag-button,
            .casket.cs-main:not(.cs-full-screen),
            .casket:not(.cs-full-screen) .cs-header,
            .casket:not(.cs-full-screen) .cs-footer,
            code[class*=language-], pre[class*=language-], .lfe-code { background-color: transparent !important; }
            main > div[data-v-c8fe480a][data-v-e9b0168c-s] { background-color: transparent !important; }
            .cm-editor, .inner-card, .cm-gutters { background-color: transparent !important; }`;
        document.head.appendChild(style);
    }

    function applyNavOpacity() {
        removeStyleElement(STYLE_IDS.navOpacity);

        const topAlpha = clampPercent(topbarOpacityValue, 100);
        const sideAlpha = clampPercent(sidebarOpacityValue, 100);
        if (topAlpha >= 100 && sideAlpha >= 100) return;

        const navColor = 'var(--theme-navi-back, rgb(var(--lcolor--bg-container, 255, 255, 255)))';
        const tint = alpha => alpha <= 0
            ? 'transparent'
            : `color-mix(in srgb, ${navColor} ${alpha}%, transparent)`;

        let css = '';
        if (topAlpha < 100) {
            css += `.top-bar, .user-nav.rside, .wrapper.wrapped.lfe-body.header-layout.tiny { background-color: ${tint(topAlpha)} !important; }\n`;
        }
        if (sideAlpha < 100) {
            css += `nav.sidebar, nav.lside, nav.lfe-body { background-color: ${tint(sideAlpha)} !important; }\n`;
        }

        const style = document.createElement('style');
        style.id = STYLE_IDS.navOpacity;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function relocateEditorToBody() {
        const editors = document.querySelectorAll('.casket.cs-full-screen');
        if (!editors.length) return false;
        editors.forEach(el => {
            if (el.parentElement !== document.body) {
                document.body.appendChild(el);
            }
        });
        return true;
    }

    function measureEditorRect() {
        const topBar = document.querySelector('.top-bar');
        const topH = topBar ? Math.round(topBar.getBoundingClientRect().height) : 48;

        let sideW = 0;
        const sidebar = document.querySelector('nav.sidebar');
        if (sidebar) {
            const rect = sidebar.getBoundingClientRect();
            const cs = getComputedStyle(sidebar);
            if (rect.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden') {
                sideW = Math.round(rect.width);
            }
        }

        const docEl = document.documentElement;
        const vw = docEl.clientWidth || window.innerWidth;
        const vh = docEl.clientHeight || window.innerHeight;
        const gap = EDITOR_GAP;

        return {
            top: topH + gap,
            left: sideW + gap,
            width: Math.max(200, vw - sideW - gap * 2),
            height: Math.max(200, vh - topH - gap * 2)
        };
    }

    function applyFullscreenEditorLayout() {
        removeStyleElement(STYLE_IDS.editorLayout);
        if (!relocateEditorToBody()) return;

        const rect = measureEditorRect();
        const cardColor = computeCardColor();

        const style = document.createElement('style');
        style.id = STYLE_IDS.editorLayout;
        style.textContent = `.casket.cs-full-screen,
            .casket.cs-full-screen .cs-header,
            .casket.cs-full-screen .cs-footer {
                background-color: ${cardColor} !important;
            }

            .casket.cs-main.cs-full-screen {
                position: fixed !important;
                top: ${rect.top}px !important;
                left: ${rect.left}px !important;
                right: auto !important;
                bottom: auto !important;
                width: ${rect.width}px !important;
                height: ${rect.height}px !important;
                max-width: none !important;
                max-height: none !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                z-index: ${EDITOR_Z_INDEX} !important;
                display: flex !important;
                flex-direction: column !important;
                overflow: hidden !important;
                box-sizing: border-box !important;
            }

            .casket.cs-full-screen > * {
                min-height: 0 !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
            }
            .casket.cs-full-screen .cs-content {
                flex: 1 1 auto !important;
                height: auto !important;
                overflow: hidden !important;
            }
            .casket.cs-full-screen .cs-editor,
            .casket.cs-full-screen .cs-viewer,
            .casket.cs-full-screen .cm-editor {
                min-height: 0 !important;
                height: 100% !important;
                overflow: hidden !important;
            }
            .casket.cs-full-screen .cm-scroller {
                overflow-y: auto !important;
                max-height: 100% !important;
            }`;
        document.head.appendChild(style);
    }

    function scheduleEditorLayoutUpdate() {
        if (layoutUpdateTimer) return;
        layoutUpdateTimer = requestAnimationFrame(() => {
            layoutUpdateTimer = null;
            applyFullscreenEditorLayout();
        });
    }

    function readInlineThemeVar(themePage, name) {
        if (!themePage) return '';
        return themePage.style.getPropertyValue(name).trim();
    }

    function buildThemeGradient(bodyData) {
        const colors = bodyData && Array.isArray(bodyData.color)
            ? bodyData.color.filter(Boolean)
            : [];
        if (!colors.length) return '';
        if (colors.length === 1) {
            return `linear-gradient(${colors[0]}, ${colors[0]})`;
        }
        const midOpts = bodyData.midOpts || {};
        const degree = typeof midOpts.degree === 'number' ? midOpts.degree : 0;
        return `linear-gradient(${degree}deg, ${colors.join(', ')})`;
    }

    function resolveFullscreenSize(size) {
        if (!size || size === 'auto') return 'cover';
        return size;
    }

    function resolveBackgroundImage(themePage) {
        if (themePage) {
            const inlineImage = readInlineThemeVar(themePage, '--theme-body-image');
            const inlineColor = readInlineThemeVar(themePage, '--theme-body-color');
            const inlineBack = readInlineThemeVar(themePage, '--theme-body-back');
            if (inlineImage || inlineColor || inlineBack) {
                return {
                    image: inlineImage && inlineImage !== 'none' ? inlineImage : '',
                    color: inlineColor && inlineColor !== 'none' ? inlineColor : '',
                    back: inlineBack && inlineBack !== 'transparent' ? inlineBack : '',
                    repeat: readInlineThemeVar(themePage, '--theme-body-image-repeat') || 'no-repeat',
                    size: resolveFullscreenSize(readInlineThemeVar(themePage, '--theme-body-image-size')),
                    position: readInlineThemeVar(themePage, '--theme-body-image-position') || 'center',
                    filter: readInlineThemeVar(themePage, '--theme-body-color-filter') || 'none'
                };
            }
        }

        const themeScript = document.getElementById('luogu-theme');
        if (themeScript) {
            try {
                const data = JSON.parse(themeScript.textContent);
                const bodyData = isDarkTheme() && data && data.dBody
                    ? data.dBody
                    : data && data.lBody;
                if (bodyData) {
                    const midOpts = bodyData.midOpts || {};
                    let position = 'center';
                    if (Array.isArray(midOpts.position) && midOpts.position.length >= 2) {
                        position = `${midOpts.position[0]}% ${midOpts.position[1]}%`;
                    }
                    let filter = 'none';
                    if (typeof midOpts.brightness === 'number' && midOpts.brightness !== 0) {
                        filter = `brightness(${Math.max(0, Math.min(200, 100 + midOpts.brightness))}%)`;
                    }
                    return {
                        image: bodyData.image ? `url("${bodyData.image}")` : '',
                        color: buildThemeGradient(bodyData),
                        back: bodyData.back || '',
                        repeat: midOpts.repeat === 'all'
                            ? 'repeat'
                            : midOpts.repeat === 'x'
                                ? 'repeat-x'
                                : midOpts.repeat === 'y' ? 'repeat-y' : 'no-repeat',
                        size: resolveFullscreenSize(midOpts.size),
                        position: position,
                        filter: filter
                    };
                }
            } catch (e) {
            }
        }

        if (themePage) {
            const cs = getComputedStyle(themePage);
            const img = cs.getPropertyValue('--theme-body-image').trim();
            const color = cs.getPropertyValue('--theme-body-color').trim();
            const back = cs.getPropertyValue('--theme-body-back').trim();
            if ((img && img !== 'none') || (color && color !== 'none') || (back && back !== 'transparent')) {
                return {
                    image: img && img !== 'none' ? img : '',
                    color: color && color !== 'none' ? color : '',
                    back: back && back !== 'transparent' ? back : '',
                    repeat: cs.getPropertyValue('--theme-body-image-repeat').trim() || 'no-repeat',
                    size: resolveFullscreenSize(cs.getPropertyValue('--theme-body-image-size').trim()),
                    position: cs.getPropertyValue('--theme-body-image-position').trim() || 'center',
                    filter: cs.getPropertyValue('--theme-body-color-filter').trim() || 'none'
                };
            }
        }

        const bgDiv = document.querySelector('.header-layout .background');
        if (bgDiv) {
            const style = getComputedStyle(bgDiv);
            if (style.backgroundImage && style.backgroundImage !== 'none') {
                return {
                    image: style.backgroundImage,
                    color: '',
                    back: '',
                    repeat: style.backgroundRepeat || 'no-repeat',
                    size: style.backgroundSize || 'cover',
                    position: style.backgroundPosition || 'center',
                    filter: 'none'
                };
            }
        }

        return null;
    }

    function applyFullscreenBackground() {
        removeStyleElement(STYLE_IDS.bgFullscreen);
        removeStyleElement(STYLE_IDS.bgFullscreenEarly);

        const root = document.documentElement;
        const themePage = document.querySelector('.theme-page');

        if (!bgFullscreen) {
            root.classList.remove('ldb-bgfullscreen');
            return;
        }

        const bg = resolveBackgroundImage(themePage);
        if (!bg || (!bg.image && !bg.color && !bg.back)) {
            root.classList.remove('ldb-bgfullscreen');
            return;
        }

        const layers = [];
        const positions = [];
        const repeats = [];
        const sizes = [];
        if (bg.image) {
            layers.push(bg.image);
            positions.push(bg.position);
            repeats.push(bg.repeat);
            sizes.push(bg.size);
        }
        if (bg.color) {
            layers.push(bg.color);
            positions.push('center');
            repeats.push('no-repeat');
            sizes.push('100% 100%');
        }

        const alpha = Math.min(1, Math.max(0, (isNaN(opacityValue) ? 100 : opacityValue) / 100));
        const filter = bg.filter && bg.filter !== 'none' ? bg.filter : 'none';
        const backColor = bg.back || 'transparent';

        root.classList.add('ldb-bgfullscreen');

        const styleEl = document.createElement('style');
        styleEl.id = STYLE_IDS.bgFullscreen;
        styleEl.textContent = `html.ldb-bgfullscreen {
                background-color: ${backColor} !important;
                background-image: none !important;
            }
            html.ldb-bgfullscreen::before {
                content: '' !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                z-index: -1 !important;
                pointer-events: none !important;
                background-image: ${layers.length ? layers.join(', ') : 'none'} !important;
                background-repeat: ${repeats.length ? repeats.join(', ') : 'no-repeat'} !important;
                background-position: ${positions.length ? positions.join(', ') : 'center'} !important;
                background-size: ${sizes.length ? sizes.join(', ') : 'cover'} !important;
                filter: ${filter} !important;
                -webkit-filter: ${filter} !important;
            }
            html.ldb-bgfullscreen .theme-page {
                --theme-body-image: none !important;
                --theme-body-color: none !important;
                --theme-body-mid-mask: none !important;
                --theme-body-color-filter: none !important;
                --theme-body-back: transparent !important;
            }
            .header-layout.tiny[data-v-7ddab1d5], .lfe-body[data-v-12f19ddc] { background: transparent !important; }
            .article-banner + div[data-v-fc349d1c] { background: transparent !important; }
            html.ldb-bgfullscreen .lcolor-bg-background { background: transparent !important; }
            html.ldb-bgfullscreen .article-banner.article-banner {
                background: rgba(var(--lcolor--bg-layout, 245, 245, 245), ${alpha}) !important;
            }
            html.ldb-bgfullscreen .article-content.article-content {
                background: rgba(var(--lcolor--bg-container, 255, 255, 255), ${alpha}) !important;
            }
            html.ldb-bgfullscreen .toc.toc {
                background: rgb(var(--lcolor--bg-container, 255, 255, 255)) !important;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .15), 0 0 1px 0 rgba(0, 0, 0, .5) inset;
                padding: 3px 8px;
            }
            html.ldb-bgfullscreen[data-lcolor-theme="dark"] .toc.toc {
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .5), 0 0 1px 0 rgba(255, 255, 255, .15) inset;
            }
            html.ldb-bgfullscreen body {
                background: transparent !important;
                background-image: none !important;
            }
            html.ldb-bgfullscreen main,
            html.ldb-bgfullscreen .main-container > main {
                background: transparent !important;
                background-color: transparent !important;
            }
            html.ldb-bgfullscreen .main-container,
            html.ldb-bgfullscreen #app-old,
            html.ldb-bgfullscreen .lg-index-content,
            html.ldb-bgfullscreen .lg-index-content .am-g,
            html.ldb-bgfullscreen .am-panel {
                background: transparent !important;
                background-color: transparent !important;
            }
            html.ldb-bgfullscreen .header-layout .background { opacity: 0; }
            html.ldb-bgfullscreen .wrapper.wrapped:not(.header-layout) .background { display: none; }
            html.ldb-bgfullscreen .wrapper.wrapped:not(.header-layout) { background: transparent !important; }
            html.ldb-bgfullscreen .footer { background: transparent !important; }
            html.ldb-bgfullscreen .theme-page { background: transparent !important; }
            html.ldb-bgfullscreen nav.lfe-body > div { background-color: transparent !important; }
            html.ldb-bgfullscreen .header-layout {
                background: transparent !important;
                background-color: transparent !important;
            }
            html.ldb-bgfullscreen body::before,
            html.ldb-bgfullscreen body::after,
            html.ldb-bgfullscreen #app::before,
            html.ldb-bgfullscreen #app::after {
                background: none !important;
                background-image: none !important;
            }
            html.ldb-bgfullscreen #app { background: transparent !important; }`;
        document.head.appendChild(styleEl);
    }

    const EARLY_FULLSCREEN_CSS = `html.ldb-bgfullscreen .theme-page {
            --theme-body-image: none !important;
            --theme-body-color: none !important;
            --theme-body-mid-mask: none !important;
        }
        html.ldb-bgfullscreen .theme-page::before { background-image: none !important; }
        html.ldb-bgfullscreen body,
        html.ldb-bgfullscreen #app,
        html.ldb-bgfullscreen .main-container,
        html.ldb-bgfullscreen .theme-page {
            background-image: none !important;
        }
        html.ldb-bgfullscreen .header-layout .background,
        html.ldb-bgfullscreen .wrapper.wrapped:not(.header-layout) .background {
            display: none !important;
            opacity: 0 !important;
        }`;

    function injectEarlyFullscreenStyle() {
        if (!bgFullscreen) return;
        const root = document.documentElement;
        if (!root) {
            document.addEventListener('readystatechange', function retry() {
                if (!document.documentElement) return;
                document.removeEventListener('readystatechange', retry);
                injectEarlyFullscreenStyle();
            });
            return;
        }
        if (document.getElementById(STYLE_IDS.bgFullscreenEarly)) return;
        root.classList.add('ldb-bgfullscreen');
        const style = document.createElement('style');
        style.id = STYLE_IDS.bgFullscreenEarly;
        style.textContent = EARLY_FULLSCREEN_CSS;
        (document.head || root).appendChild(style);
    }

    function scheduleThemeRefresh() {
        if (themeRefreshRaf) return;
        themeRefreshRaf = requestAnimationFrame(() => {
            themeRefreshRaf = null;
            refreshThemeStyles();
        });
    }

    function observeThemePage() {
        const themePage = document.querySelector('.theme-page');
        if (!themePage || themePage === observedThemePage) return;
        if (themePageObserver) themePageObserver.disconnect();
        observedThemePage = themePage;
        themePageObserver = new MutationObserver(scheduleThemeRefresh);
        themePageObserver.observe(themePage, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    function syncSettingsFromStorage() {
        const signature = getSettingsSignature();
        if (signature === lastSettingsSignature) return;
        loadSettings();
        if (document.readyState === 'loading') {
            if (bgFullscreen) {
                injectEarlyFullscreenStyle();
            } else {
                removeStyleElement(STYLE_IDS.bgFullscreenEarly);
                document.documentElement.classList.remove('ldb-bgfullscreen');
            }
            return;
        }
        applyAll();
        syncPanelControls();
    }

    function syncPanelControls() {
        if (!panelElement) return;
        const byId = id => document.getElementById(id);
        const syncSlider = (sliderId, displayId, value, suffix) => {
            const slider = byId(sliderId);
            const display = byId(displayId);
            const text = String(value);
            if (slider && slider.value !== text) slider.value = text;
            if (display) display.textContent = text + suffix;
        };
        const syncChecked = (id, value) => {
            const checkbox = byId(id);
            if (checkbox) checkbox.checked = !!value;
        };

        syncSlider('ldb-panel-blur', 'blur-value', blurValue, 'px');
        syncSlider('ldb-panel-opacity', 'opacity-value', opacityValue, '%');
        syncSlider('ldb-panel-topbar-opacity', 'topbar-opacity-value', topbarOpacityValue, '%');
        syncSlider('ldb-panel-sidebar-opacity', 'sidebar-opacity-value', sidebarOpacityValue, '%');
        syncSlider('ldb-panel-rounded-card', 'rounded-value-card', cardborderRad, 'px');
        syncSlider('ldb-panel-rounded-pic', 'rounded-value-pic', picborderRad, 'px');
        syncChecked('ldb-panel-card-rounded', cardRounded);
        syncChecked('ldb-panel-pic-rounded', picRounded);
        syncChecked('ldb-panel-bgfullscreen', bgFullscreen);
        syncChecked('ldb-panel-adblock', adBlock);

        const channel = byId('ldb-panel-updateChannel');
        if (channel && channel.value !== updateChannel) channel.value = updateChannel;

        if (customCssTextarea && document.activeElement !== customCssTextarea) {
            if (customCssTextarea.value !== customCSS) customCssTextarea.value = customCSS;
        }
    }

    function applyAdBlock() {
        const existing = document.getElementById(STYLE_IDS.adBlock);
        if (!adBlock) {
            if (existing) existing.remove();
            return;
        }
        if (existing) return;

        const style = document.createElement('style');
        style.id = STYLE_IDS.adBlock;
        style.textContent = `.side div[data-v-04a8de04] { display: none !important; }`;
        document.head.appendChild(style);
    }

    function applyControlStyles() {
        removeStyleElement(STYLE_IDS.controls);

        const style = document.createElement('style');
        style.id = STYLE_IDS.controls;
        style.textContent = `:root {
                --ldb-control-bg: rgba(255, 255, 255, 0.78);
                --ldb-control-bg-hover: rgba(255, 255, 255, 0.96);
                --ldb-control-border: #dfe4ea;
                --ldb-control-border-hover: #c7d0d9;
                --ldb-control-text: #2f3542;
                --ldb-control-placeholder: #9aa4ad;
                --ldb-control-accent: #3498db;
                --ldb-control-accent-soft: rgba(52, 152, 219, 0.14);
                --ldb-control-radius: 7px;
                --ldb-control-chevron: #7f8c8d;
                --ldb-control-menu-bg: #ffffff;
                --ldb-control-menu-border: #e5e7eb;
                --ldb-control-menu-shadow: 0 16px 40px -14px rgba(15, 23, 42, 0.28),
                                          0 2px 8px rgba(15, 23, 42, 0.06);
                --ldb-control-item-hover: rgba(52, 152, 219, 0.08);
                --ldb-control-btn-bg: #f1f4f7;
                --ldb-control-btn-hover: #e7ecf1;
                --ldb-control-btn-text: #4b5563;
            }

            html[data-lcolor-theme="dark"],
            html.lcolor-theme-dark,
            body.lcolor-theme-dark {
                --ldb-control-bg: rgba(255, 255, 255, 0.055);
                --ldb-control-bg-hover: rgba(255, 255, 255, 0.085);
                --ldb-control-border: #3f444b;
                --ldb-control-border-hover: #555c66;
                --ldb-control-text: #e8e8e8;
                --ldb-control-placeholder: #8f969e;
                --ldb-control-accent: #4aa3e0;
                --ldb-control-accent-soft: rgba(74, 163, 224, 0.18);
                --ldb-control-chevron: #a0a6ad;
                --ldb-control-menu-bg: #1d2025;
                --ldb-control-menu-border: #3a3d42;
                --ldb-control-menu-shadow: 0 16px 40px -14px rgba(0, 0, 0, 0.65),
                                           0 0 0 1px rgba(255, 255, 255, 0.03);
                --ldb-control-item-hover: rgba(74, 163, 224, 0.12);
                --ldb-control-btn-bg: #282b30;
                --ldb-control-btn-hover: #303339;
                --ldb-control-btn-text: #d9d9d9;
            }

            input:where(:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]):not([type="color"]):not([aria-hidden="true"]):not([hidden]):not(.lfe-code):not(.cm-textfield):not(.inputarea):not([style*="display: none"]):not([style*="display:none"]):not([style*="opacity: 0"])),
            textarea:where(:not(.lfe-code):not(.ide-textarea):not(.cm-textfield):not(.inputarea):not([aria-hidden="true"]):not([hidden]):not([style*="display: none"]):not([style*="display:none"]):not([style*="opacity: 0"])),
            select:where(:not([multiple]):not([size]):not([aria-hidden="true"]):not([hidden]):not([style*="display: none"]):not([style*="display:none"])) {
                background-color: var(--ldb-control-bg) !important;
                color: var(--ldb-control-text) !important;
                border-color: transparent !important;
                border-radius: var(--ldb-control-radius) !important;
                box-sizing: border-box !important;
                box-shadow: inset 0 0 0 1px var(--ldb-control-border) !important;
                outline: none !important;
                caret-color: var(--ldb-control-accent) !important;
                transition: background-color 0.15s ease, box-shadow 0.15s ease !important;
            }

            :is(input, textarea, select):where(:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]):not([type="color"]):not([aria-hidden="true"]):not([hidden]):not(.lfe-code):not(.cm-textfield):not(.inputarea):not([style*="display: none"]):not([style*="display:none"]):not([style*="opacity: 0"]):not(:disabled):not(:focus)):hover {
                background-color: var(--ldb-control-bg-hover) !important;
                box-shadow: inset 0 0 0 1px var(--ldb-control-border-hover) !important;
            }

            :is(input, textarea, select):where(:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]):not([type="color"]):not([aria-hidden="true"]):not([hidden]):not(.lfe-code):not(.cm-textfield):not(.inputarea):not([style*="display: none"]):not([style*="display:none"]):not([style*="opacity: 0"]):not(:disabled)):focus {
                background-color: var(--ldb-control-bg-hover) !important;
                box-shadow: inset 0 0 0 1px var(--ldb-control-accent),
                            0 0 0 3px var(--ldb-control-accent-soft) !important;
            }

            :is(input, textarea, select):where(:not([type="range"]):not([type="checkbox"]):not([type="radio"]):not([type="hidden"]):not([type="file"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"]):not([type="color"]):not([aria-hidden="true"]):not([hidden]):not(.lfe-code):not(.cm-textfield):not(.inputarea):not([style*="display: none"]):not([style*="display:none"]):not([style*="opacity: 0"])):disabled {
                opacity: 0.6 !important;
                cursor: not-allowed !important;
            }
            body input::placeholder,
            body textarea::placeholder {
                color: var(--ldb-control-placeholder) !important;
                opacity: 1 !important;
            }

            html[data-lcolor-theme="dark"] body :is(input, textarea, select),
            html.lcolor-theme-dark body :is(input, textarea, select),
            body.lcolor-theme-dark :is(input, textarea, select) {
                color-scheme: dark !important;
            }

            body input[type="checkbox"],
            body input[type="radio"] {
                accent-color: var(--ldb-control-accent) !important;
            }

            body input[type="range"] {
                accent-color: var(--ldb-control-accent) !important;
            }

            body input[type="file"] {
                color: var(--ldb-control-text) !important;
            }
            body input[type="file"]::file-selector-button {
                margin: 0 8px 0 0 !important;
                padding: 6px 12px !important;
                border: 0 !important;
                border-radius: 6px !important;
                background: var(--ldb-control-btn-bg) !important;
                color: var(--ldb-control-btn-text) !important;
                font-family: inherit !important;
                font-size: 12px !important;
                cursor: pointer !important;
                transition: background-color 0.15s ease !important;
            }
            body input[type="file"]::file-selector-button:hover {
                background: var(--ldb-control-btn-hover) !important;
            }

            select:where(:not([multiple]):not([size]):not([aria-hidden="true"]):not([hidden])) {
                -webkit-appearance: none !important;
                appearance: none !important;
                padding-right: 30px !important;
                background-image:
                    linear-gradient(45deg, transparent 50%, var(--ldb-control-chevron) 50%),
                    linear-gradient(135deg, var(--ldb-control-chevron) 50%, transparent 50%) !important;
                background-position:
                    calc(100% - 15px) calc(50% + 1px),
                    calc(100% - 10px) calc(50% + 1px) !important;
                background-size: 6px 6px, 6px 6px !important;
                background-repeat: no-repeat !important;
                cursor: pointer !important;
            }
            select:where(:not([multiple]):not([size])) option {
                background-color: var(--ldb-control-menu-bg) !important;
                color: var(--ldb-control-text) !important;
            }

            body .dropdown .center {
                border: 1px solid var(--ldb-control-menu-border) !important;
                box-shadow: var(--ldb-control-menu-shadow) !important;
            }

            body .am-dropdown-content,
            body .am-selected-list,
            body .lfe-dropdown,
            body .el-dropdown-menu,
            body .ant-dropdown,
            body .ant-select-dropdown,
            body .dropdown-menu {
                border: 1px solid var(--ldb-control-menu-border) !important;
                border-radius: 9px !important;
                background-color: var(--ldb-control-menu-bg) !important;
                box-shadow: var(--ldb-control-menu-shadow) !important;
            }

            body .am-dropdown-content li > a,
            body .am-selected-list li,
            body .lfe-dropdown-item,
            body .el-dropdown-menu__item,
            body .ant-dropdown-menu-item,
            body .ant-select-item,
            body .dropdown-menu > li > a {
                border-radius: 6px !important;
                transition: background-color 0.12s ease !important;
            }
            body .am-dropdown-content li > a:hover,
            body .am-selected-list li:hover,
            body .lfe-dropdown-item:hover,
            body .el-dropdown-menu__item:hover,
            body .ant-dropdown-menu-item:hover,
            body .ant-select-item:hover,
            body .dropdown-menu > li > a:hover {
                background-color: var(--ldb-control-item-hover) !important;
            }

            body .am-btn,
            body .lfe-btn,
            body .l-btn {
                border-radius: var(--ldb-control-radius) !important;
                transition: background-color 0.15s ease, border-color 0.15s ease,
                            color 0.15s ease !important;
            }`;
        document.head.appendChild(style);
    }

    function applyCustomCSS() {
        removeStyleElement(STYLE_IDS.customCSS);
        if (!customCSS || customCSS.trim() === '') return;

        const style = document.createElement('style');
        style.id = STYLE_IDS.customCSS;
        style.textContent = customCSS;
        document.head.appendChild(style);
    }

    function applyIdeLayout() {
        const mainContainer = document.querySelector('.main-container.lside-nav');
        const isIdePage = !!mainContainer && !!mainContainer.querySelector('.panel-layout.ide-container');
        const topBar = document.querySelector('.top-bar');
        const topH = Math.round(topBar ? topBar.getBoundingClientRect().height : 48);
        const signature = mainContainer
            ? `${isIdePage ? 'ide' : 'page'}|${topH}`
            : 'none';
        const hasStyle = !!document.getElementById(STYLE_IDS.idePadding);
        if (signature === lastIdeLayoutSignature && (hasStyle || signature === 'none')) return;
        lastIdeLayoutSignature = signature;

        removeStyleElement(STYLE_IDS.idePadding);
        if (!mainContainer) return;

        let css = `.main-container.lside-nav {
                padding: 10px !important;
                box-sizing: border-box !important;
                background: transparent !important;
            }`;

        if (isIdePage) {
            css += `.main-container.lside-nav {
                    height: calc(100vh - ${topH}px) !important;
                    max-height: calc(100vh - ${topH}px) !important;
                    display: flex !important;
                    flex-direction: column !important;
                }
                .main-container.lside-nav > .panel-layout.ide-container {
                    flex: 1 1 auto !important;
                    height: 100% !important;
                    min-height: 0 !important;
                    min-width: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                    box-sizing: border-box !important;
                }
                .main-container.lside-nav .panel-layout,
                .main-container.lside-nav .panel {
                    min-height: 0 !important;
                    min-width: 0 !important;
                    box-sizing: border-box !important;
                }
                .ide-textarea.lfe-code {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                    box-sizing: border-box !important;
                    max-width: 100% !important;
                }
                .ide-textarea.lfe-code::-webkit-scrollbar {
                    display: none !important;
                    width: 0 !important;
                    height: 0 !important;
                }
                .ide-textarea.lfe-code::-webkit-scrollbar-corner {
                    display: none !important;
                    background: transparent !important;
                }`;
        }

        const style = document.createElement('style');
        style.id = STYLE_IDS.idePadding;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function applyScrollbarStyle() {
        removeStyleElement(STYLE_IDS.scrollbar);

        const style = document.createElement('style');
        style.id = STYLE_IDS.scrollbar;
        style.textContent = `* { scrollbar-color: rgb(139, 139, 139) transparent; }
            nav.sidebar::-webkit-scrollbar,
            .dropdown::-webkit-scrollbar { width: 8px; }
            nav.sidebar::-webkit-scrollbar-thumb,
            .dropdown::-webkit-scrollbar-thumb {
                background: rgb(139, 139, 139);
                border-radius: 4px;
            }`;
        document.head.appendChild(style);
    }

    function panelSliderMarkup(id, displayId, label, min, max, value, suffix) {
        return `<div class="ldb-slider">
                <div class="ldb-slider-head">
                    <label for="${id}">${label}</label>
                    <span class="ldb-value" id="${displayId}">${value}${suffix}</span>
                </div>
                <input id="${id}" type="range" min="${min}" max="${max}" value="${value}" />
            </div>`;
    }

    function panelSwitchMarkup(id, title, desc, checked) {
        return `<label class="ldb-switch-row">
                <span class="ldb-switch-copy">
                    <span class="ldb-switch-title">${title}</span>
                    <span class="ldb-switch-desc">${desc}</span>
                </span>
                <input id="${id}" type="checkbox" ${checked ? 'checked' : ''} />
                <span class="ldb-switch"></span>
            </label>`;
    }

    function buildPanelHTML() {
        return `<div id="ldb-panel" class="hidden">
                <div class="ldb-head">
                    <span class="ldb-head-title">${icon('sliders', 16)}<span>插件设置</span></span>
                    <button type="button" id="ldb-panel-close" aria-label="关闭">${icon('x', 16)}</button>
                </div>
                <div class="ldb-body">
                    <div class="ldb-section-label">卡片</div>
                    ${panelSliderMarkup('ldb-panel-blur', 'blur-value', '模糊度', 0, 30, blurValue, 'px')}
                    ${panelSliderMarkup('ldb-panel-opacity', 'opacity-value', '不透明度', 0, 100, opacityValue, '%')}

                    <div class="ldb-section-label">导航栏透明度</div>
                    ${panelSliderMarkup('ldb-panel-topbar-opacity', 'topbar-opacity-value', '顶栏', 0, 100, topbarOpacityValue, '%')}
                    ${panelSliderMarkup('ldb-panel-sidebar-opacity', 'sidebar-opacity-value', '侧栏', 0, 100, sidebarOpacityValue, '%')}

                    <div class="ldb-section-label">圆角</div>
                    ${panelSliderMarkup('ldb-panel-rounded-card', 'rounded-value-card', '卡片', 0, 30, cardborderRad, 'px')}
                    ${panelSliderMarkup('ldb-panel-rounded-pic', 'rounded-value-pic', '图片', 0, 16, picborderRad, 'px')}
                    ${panelSwitchMarkup('ldb-panel-card-rounded', '卡片圆角', '应用到卡片、文章与面板', cardRounded)}
                    ${panelSwitchMarkup('ldb-panel-pic-rounded', '图片圆角', '应用到图片与头像', picRounded)}

                    <div class="ldb-section-label">功能</div>
                    <div class="ldb-switch-row">
                        <span class="ldb-switch-copy">
                            <span class="ldb-switch-title">背景全屏</span>
                            <span class="ldb-switch-desc">需在 <a href="/theme" target="_blank" rel="noopener">主题</a> 中启用中景图片</span>
                        </span>
                        <label class="ldb-switch-control" aria-label="背景全屏">
                            <input id="ldb-panel-bgfullscreen" type="checkbox" aria-label="背景全屏" ${bgFullscreen ? 'checked' : ''} />
                            <span class="ldb-switch"></span>
                        </label>
                    </div>
                    ${panelSwitchMarkup('ldb-panel-adblock', '关闭广告', '隐藏侧栏广告卡片', adBlock)}

                    <div class="ldb-section-label">自定义 CSS</div>
                    <textarea id="ldb-panel-customCSS" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="/* 在这里写自定义 CSS */"></textarea>

                    <div class="ldb-section-label">更新</div>
                    <div class="ldb-select-row">
                        <label for="ldb-panel-updateChannel">更新通道</label>
                        <select id="ldb-panel-updateChannel">
                            <option value="stable" ${updateChannel === 'stable' ? 'selected' : ''}>稳定版</option>
                            <option value="latest" ${updateChannel === 'latest' ? 'selected' : ''}>最新版</option>
                        </select>
                    </div>
                    <div class="ldb-actions">
                        <button type="button" id="ldb-panel-checkUpdate">${icon('refreshCw', 14)}检查更新</button>
                        <button type="button" id="ldb-panel-reset">${icon('rotateCcw', 14)}还原设置</button>
                    </div>
                    <div id="ldb-updateStatus"></div>
                </div>
            </div>`;
    }

    function injectPanelStyle() {
        const existing = document.getElementById('ldb-panel-style');
        if (existing) existing.remove();

        const panelOpacity = isNaN(opacityValue)
            ? 0.96
            : Math.min(1, Math.max(0.96, opacityValue / 100));
        const panelBlur = isNaN(blurValue)
            ? 10
            : Math.min(30, Math.max(0, blurValue));

        const style = document.createElement('style');
        style.id = 'ldb-panel-style';
        style.textContent = `#ldb-panel {
                --ldb-panel-bg-rgb: 255, 255, 255;
                --ldb-panel-opacity: ${panelOpacity};
                --ldb-panel-blur: blur(${panelBlur}px);
                --ldb-panel-text: #333;
                --ldb-panel-heading: #2c3e50;
                --ldb-panel-muted: #7f8c8d;
                --ldb-panel-label: #555;
                --ldb-panel-border: #e5e7eb;
                --ldb-panel-border-strong: #d7dbe0;
                --ldb-panel-field-bg: #fbfcfd;
                --ldb-panel-slider-track: #e2e6ea;
                --ldb-panel-accent: #3498db;
                --ldb-panel-accent-hover: #2f89c5;
                --ldb-panel-accent-soft: rgba(52, 152, 219, 0.14);
                --ldb-panel-btn-bg: #f5f6f7;
                --ldb-panel-btn-hover: #ebedf0;
                --ldb-panel-btn-text: #555;
                --ldb-panel-btn-border: #dcdee2;
                --ldb-panel-shadow: 0 18px 48px -14px rgba(15, 23, 42, 0.32),
                                    0 2px 8px rgba(15, 23, 42, 0.06);
                color-scheme: light;

                position: fixed !important;
                right: 24px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                z-index: 2147483000 !important;
                display: flex !important;
                flex-direction: column !important;
                width: 330px !important;
                max-width: calc(100vw - 48px) !important;
                max-height: min(84vh, 780px) !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                box-sizing: border-box !important;
                background: rgba(var(--ldb-panel-bg-rgb), var(--ldb-panel-opacity)) !important;
                backdrop-filter: var(--ldb-panel-blur) !important;
                -webkit-backdrop-filter: var(--ldb-panel-blur) !important;
                border: 1px solid var(--ldb-panel-border) !important;
                border-radius: 12px !important;
                box-shadow: var(--ldb-panel-shadow) !important;
                color: var(--ldb-panel-text) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                             "PingFang SC", "Microsoft YaHei", sans-serif !important;
                font-size: 13px !important;
                line-height: 1.45 !important;
                text-align: left !important;
                transition: opacity 0.24s ease, transform 0.24s ease,
                            visibility 0.24s ease !important;
            }

            html[data-lcolor-theme="dark"] #ldb-panel,
            html.lcolor-theme-dark #ldb-panel,
            body.lcolor-theme-dark #ldb-panel {
                --ldb-panel-bg-rgb: 29, 32, 37;
                --ldb-panel-text: #e8e8e8;
                --ldb-panel-heading: #f2f2f2;
                --ldb-panel-muted: #a0a6ad;
                --ldb-panel-label: #c9cdd2;
                --ldb-panel-border: #3a3d42;
                --ldb-panel-border-strong: #4a4d52;
                --ldb-panel-field-bg: rgba(40, 43, 48, 0.9);
                --ldb-panel-slider-track: #3a3d42;
                --ldb-panel-accent: #4aa3e0;
                --ldb-panel-accent-hover: #3d93cf;
                --ldb-panel-accent-soft: rgba(74, 163, 224, 0.18);
                --ldb-panel-btn-bg: #282b30;
                --ldb-panel-btn-hover: #303339;
                --ldb-panel-btn-text: #d9d9d9;
                --ldb-panel-btn-border: #4a4d52;
                --ldb-panel-shadow: 0 18px 48px -14px rgba(0, 0, 0, 0.65),
                                    0 0 0 1px rgba(255, 255, 255, 0.03);
                color-scheme: dark;
            }

            #ldb-panel, #ldb-panel * { box-sizing: border-box !important; }

            #ldb-panel.hidden {
                opacity: 0 !important;
                visibility: hidden !important;
                transform: translateY(-50%) translateX(calc(100% + 48px)) !important;
                pointer-events: none !important;
            }

            #ldb-panel .ldb-head {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                flex: 0 0 auto !important;
                padding: 11px 12px 11px 14px !important;
                border-bottom: 1px solid var(--ldb-panel-border) !important;
            }
            #ldb-panel .ldb-head-title {
                display: flex !important;
                align-items: center !important;
                gap: 7px !important;
                min-width: 0 !important;
                color: var(--ldb-panel-heading) !important;
                font-size: 13.5px !important;
                font-weight: 600 !important;
                line-height: 1.3 !important;
            }
            #ldb-panel .ldb-head-title .ldb-icon {
                color: var(--ldb-panel-accent) !important;
            }
            #ldb-panel .ldb-icon {
                display: block !important;
                flex: 0 0 auto !important;
            }
            #ldb-panel .ldb-head-title .ldb-icon,
            #ldb-panel-close .ldb-icon {
                width: 16px !important;
                height: 16px !important;
            }

            #ldb-panel-close {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                flex: 0 0 auto !important;
                width: 28px !important;
                height: 28px !important;
                margin: 0 0 0 auto !important;
                padding: 0 !important;
                border: 1px solid transparent !important;
                border-radius: 6px !important;
                background: transparent !important;
                color: var(--ldb-panel-muted) !important;
                font-size: 0 !important;
                line-height: 1 !important;
                cursor: pointer !important;
                outline: none !important;
                box-shadow: none !important;
                transition: background-color 0.15s, color 0.15s !important;
            }
            #ldb-panel-close:hover {
                background: var(--ldb-panel-btn-hover) !important;
                color: var(--ldb-panel-heading) !important;
            }
            #ldb-panel-close:active { transform: none !important; }
            #ldb-panel-close:focus-visible {
                outline: 2px solid var(--ldb-panel-accent) !important;
                outline-offset: 1px !important;
            }

            #ldb-panel .ldb-body {
                flex: 1 1 auto !important;
                min-height: 0 !important;
                padding: 12px 14px 14px !important;
                overflow-y: auto !important;
                overscroll-behavior: contain !important;
                scrollbar-width: thin !important;
                scrollbar-color: var(--ldb-panel-slider-track) transparent !important;
            }
            #ldb-panel .ldb-body::-webkit-scrollbar { width: 6px !important; }
            #ldb-panel .ldb-body::-webkit-scrollbar-thumb {
                background: var(--ldb-panel-slider-track) !important;
                border-radius: 3px !important;
            }
            #ldb-panel .ldb-body::-webkit-scrollbar-track { background: transparent !important; }

            #ldb-panel .ldb-section-label {
                margin: 4px 0 0 !important;
                padding: 9px 0 6px !important;
                border-top: 1px solid var(--ldb-panel-border) !important;
                color: var(--ldb-panel-muted) !important;
                font-size: 11.5px !important;
                font-weight: 600 !important;
                line-height: 1.3 !important;
                letter-spacing: 0.02em !important;
            }
            #ldb-panel .ldb-section-label:first-child {
                margin-top: 0 !important;
                padding-top: 0 !important;
                border-top: 0 !important;
            }

            #ldb-panel .ldb-slider { margin: 0 0 10px !important; }
            #ldb-panel .ldb-slider-head {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 10px !important;
                margin: 8px 0 6px !important;
            }
            #ldb-panel .ldb-slider-head label {
                color: var(--ldb-panel-label) !important;
                font-size: 12.5px !important;
                font-weight: 400 !important;
                line-height: 1.3 !important;
                cursor: default !important;
            }
            #ldb-panel .ldb-value {
                min-width: 38px !important;
                padding: 1px 6px !important;
                border: 1px solid var(--ldb-panel-border) !important;
                border-radius: 4px !important;
                background: var(--ldb-panel-btn-bg) !important;
                color: var(--ldb-panel-muted) !important;
                font-size: 11px !important;
                font-variant-numeric: tabular-nums !important;
                text-align: center !important;
                line-height: 1.4 !important;
            }

            #ldb-panel input[type="range"] {
                -webkit-appearance: none !important;
                appearance: none !important;
                display: block !important;
                width: 100% !important;
                height: 16px !important;
                margin: 0 !important;
                padding: 0 !important;
                border: 0 !important;
                background: transparent !important;
                cursor: pointer !important;
                outline: none !important;
            }
            #ldb-panel input[type="range"]::-webkit-slider-runnable-track {
                height: 4px !important;
                border-radius: 2px !important;
                background: var(--ldb-panel-slider-track) !important;
            }
            #ldb-panel input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                width: 14px !important;
                height: 14px !important;
                margin-top: -5px !important;
                border: 2px solid var(--ldb-panel-accent) !important;
                border-radius: 50% !important;
                background: #fff !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
                cursor: pointer !important;
            }
            #ldb-panel input[type="range"]::-moz-range-track {
                height: 4px !important;
                border-radius: 2px !important;
                background: var(--ldb-panel-slider-track) !important;
            }
            #ldb-panel input[type="range"]::-moz-range-thumb {
                width: 10px !important;
                height: 10px !important;
                border: 2px solid var(--ldb-panel-accent) !important;
                border-radius: 50% !important;
                background: #fff !important;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
                cursor: pointer !important;
            }
            #ldb-panel input[type="range"]:focus-visible::-webkit-slider-thumb {
                box-shadow: 0 0 0 3px var(--ldb-panel-accent-soft) !important;
            }
            #ldb-panel input[type="range"]:focus-visible::-moz-range-thumb {
                box-shadow: 0 0 0 3px var(--ldb-panel-accent-soft) !important;
            }

            #ldb-panel .ldb-switch-row {
                position: relative !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 12px !important;
                padding: 9px 0 !important;
                border-top: 1px solid var(--ldb-panel-border) !important;
                cursor: pointer !important;
            }
            #ldb-panel .ldb-switch-copy {
                display: flex !important;
                flex-direction: column !important;
                gap: 2px !important;
                min-width: 0 !important;
            }
            #ldb-panel .ldb-switch-title {
                color: var(--ldb-panel-label) !important;
                font-size: 12.5px !important;
                font-weight: 400 !important;
                line-height: 1.35 !important;
            }
            #ldb-panel .ldb-switch-desc {
                color: var(--ldb-panel-muted) !important;
                font-size: 11px !important;
                font-weight: 400 !important;
                line-height: 1.4 !important;
            }
            #ldb-panel .ldb-switch-row input[type="checkbox"] {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                margin: 0 !important;
                padding: 0 !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            #ldb-panel .ldb-switch-control {
                display: inline-flex !important;
                align-items: center !important;
                flex: 0 0 auto !important;
                cursor: pointer !important;
            }
            #ldb-panel .ldb-switch {
                position: relative !important;
                display: block !important;
                flex: 0 0 auto !important;
                width: 34px !important;
                height: 20px !important;
                border-radius: 10px !important;
                background: var(--ldb-panel-slider-track) !important;
                transition: background-color 0.18s !important;
                cursor: pointer !important;
            }
            #ldb-panel .ldb-switch::after {
                content: "" !important;
                position: absolute !important;
                top: 2px !important;
                left: 2px !important;
                width: 16px !important;
                height: 16px !important;
                border-radius: 50% !important;
                background: #fff !important;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25) !important;
                transition: transform 0.18s !important;
            }
            #ldb-panel input[type="checkbox"]:checked + .ldb-switch {
                background: var(--ldb-panel-accent) !important;
            }
            #ldb-panel input[type="checkbox"]:checked + .ldb-switch::after {
                transform: translateX(14px) !important;
            }
            #ldb-panel input[type="checkbox"]:focus-visible + .ldb-switch {
                box-shadow: 0 0 0 3px var(--ldb-panel-accent-soft) !important;
            }

            #ldb-panel-customCSS {
                display: block !important;
                width: 100% !important;
                height: 120px !important;
                margin: 2px 0 0 !important;
                padding: 9px 10px !important;
                border: 1px solid var(--ldb-panel-border-strong) !important;
                border-radius: 7px !important;
                background-color: var(--ldb-panel-field-bg) !important;
                color: var(--ldb-panel-text) !important;
                box-shadow: none !important;
                font-family: var(--lfe-code-font, ui-monospace, SFMono-Regular, Consolas, monospace) !important;
                font-size: 12px !important;
                line-height: 1.55 !important;
                resize: none !important;
                outline: none !important;
                overflow: auto !important;
                tab-size: 2 !important;
                -moz-tab-size: 2 !important;
                white-space: pre !important;
                transition: border-color 0.15s, box-shadow 0.15s !important;
            }
            #ldb-panel-customCSS::placeholder {
                color: var(--ldb-panel-muted) !important;
                opacity: 0.8 !important;
            }
            #ldb-panel-customCSS:focus {
                border-color: var(--ldb-panel-accent) !important;
                box-shadow: 0 0 0 3px var(--ldb-panel-accent-soft) !important;
            }

            #ldb-panel .ldb-select-row {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 10px !important;
                margin: 8px 0 10px !important;
            }
            #ldb-panel .ldb-select-row > label {
                color: var(--ldb-panel-label) !important;
                font-size: 12.5px !important;
                font-weight: 400 !important;
            }
            #ldb-panel-updateChannel {
                flex: 0 0 128px !important;
                width: 128px !important;
                height: 32px !important;
                margin: 0 !important;
                padding: 0 30px 0 9px !important;
                border: 1px solid var(--ldb-panel-border-strong) !important;
                border-radius: 7px !important;
                background-color: var(--ldb-panel-field-bg) !important;
                background-image:
                    linear-gradient(45deg, transparent 50%, var(--ldb-control-chevron, #7f8c8d) 50%),
                    linear-gradient(135deg, var(--ldb-control-chevron, #7f8c8d) 50%, transparent 50%) !important;
                background-position:
                    calc(100% - 15px) calc(50% + 1px),
                    calc(100% - 10px) calc(50% + 1px) !important;
                background-size: 6px 6px, 6px 6px !important;
                background-repeat: no-repeat !important;
                color: var(--ldb-panel-text) !important;
                font-family: inherit !important;
                font-size: 12.5px !important;
                line-height: 1 !important;
                -webkit-appearance: none !important;
                appearance: none !important;
                cursor: pointer !important;
                outline: none !important;
                box-shadow: none !important;
                transition: border-color 0.15s, box-shadow 0.15s !important;
            }
            #ldb-panel-updateChannel:hover {
                border-color: var(--ldb-panel-accent) !important;
            }
            #ldb-panel-updateChannel:focus {
                border-color: var(--ldb-panel-accent) !important;
                box-shadow: 0 0 0 3px var(--ldb-panel-accent-soft) !important;
            }

            #ldb-panel .ldb-actions {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 8px !important;
                margin: 2px 0 0 !important;
            }
            #ldb-panel .ldb-actions button {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 6px !important;
                height: 32px !important;
                margin: 0 !important;
                padding: 0 10px !important;
                border: 1px solid var(--ldb-panel-btn-border) !important;
                border-radius: 7px !important;
                background: var(--ldb-panel-btn-bg) !important;
                color: var(--ldb-panel-btn-text) !important;
                font-family: inherit !important;
                font-size: 12px !important;
                font-weight: 500 !important;
                line-height: 1 !important;
                cursor: pointer !important;
                outline: none !important;
                box-shadow: none !important;
                transition: background-color 0.15s, color 0.15s, border-color 0.15s !important;
            }
            #ldb-panel .ldb-actions button:hover {
                background: var(--ldb-panel-btn-hover) !important;
                color: var(--ldb-panel-heading) !important;
            }
            #ldb-panel .ldb-actions button:active { transform: none !important; }
            #ldb-panel .ldb-actions button:focus-visible {
                outline: 2px solid var(--ldb-panel-accent) !important;
                outline-offset: 1px !important;
            }
            #ldb-panel .ldb-actions button .ldb-icon {
                width: 14px !important;
                height: 14px !important;
            }
            #ldb-panel #ldb-panel-checkUpdate {
                background: var(--ldb-panel-accent) !important;
                border-color: var(--ldb-panel-accent) !important;
                color: #fff !important;
            }
            #ldb-panel #ldb-panel-checkUpdate:hover {
                background: var(--ldb-panel-accent-hover) !important;
                border-color: var(--ldb-panel-accent-hover) !important;
                color: #fff !important;
            }

            #ldb-panel #ldb-updateStatus {
                display: block !important;
                margin: 8px 0 0 !important;
                padding: 0 !important;
                color: var(--ldb-panel-muted) !important;
                font-size: 11.5px !important;
                line-height: 1.5 !important;
                text-align: left !important;
                word-break: break-all !important;
            }
            #ldb-panel #ldb-updateStatus:empty {
                display: none !important;
                margin: 0 !important;
            }

            #ldb-panel a {
                color: var(--ldb-panel-accent) !important;
                text-decoration: none !important;
            }
            #ldb-panel a:hover { text-decoration: underline !important; }

            @media (max-width: 520px) {
                #ldb-panel {
                    right: 12px !important;
                    width: calc(100vw - 24px) !important;
                    max-height: 86vh !important;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                #ldb-panel,
                #ldb-panel .ldb-switch,
                #ldb-panel .ldb-switch::after,
                #ldb-panel-customCSS {
                    transition: none !important;
                }
            }`;
        document.head.appendChild(style);
    }

    function applyEditorFont() {
        if (!customCssTextarea) return;
        let fontFamily = '';
        try {
            fontFamily = getComputedStyle(document.body).getPropertyValue('--lfe-code-font').trim();
        } catch (e) {
        }
        customCssTextarea.style.setProperty('font-family', fontFamily || 'Monospace', 'important');
    }

    function bindPanelEvents() {
        const $ = id => document.getElementById(id);

        const cardroundedSlider = $('ldb-panel-rounded-card');
        const cardroundedDisplay = $('rounded-value-card');
        const picroundedSlider = $('ldb-panel-rounded-pic');
        const picroundedDisplay = $('rounded-value-pic');
        const closeBtn = $('ldb-panel-close');
        const blurSlider = $('ldb-panel-blur');
        const blurDisplay = $('blur-value');
        const opacitySlider = $('ldb-panel-opacity');
        const opacityDisplay = $('opacity-value');
        const topbarOpacitySlider = $('ldb-panel-topbar-opacity');
        const topbarOpacityDisplay = $('topbar-opacity-value');
        const sidebarOpacitySlider = $('ldb-panel-sidebar-opacity');
        const sidebarOpacityDisplay = $('sidebar-opacity-value');
        const cardRoundedCb = $('ldb-panel-card-rounded');
        const picRoundedCb = $('ldb-panel-pic-rounded');
        const bgFullscreenCb = $('ldb-panel-bgfullscreen');
        const adBlockCb = $('ldb-panel-adblock');
        const updateChannelSel = $('ldb-panel-updateChannel');
        const checkUpdateBtn = $('ldb-panel-checkUpdate');
        const updateStatus = $('ldb-updateStatus');
        const resetBtn = $('ldb-panel-reset');

        customCssTextarea = $('ldb-panel-customCSS');
        applyEditorFont();

        if (customCssTextarea) {
            customCssTextarea.value = customCSS || '';
            customCssTextarea.addEventListener('input', function() {
                if (customCssSaveTimer) clearTimeout(customCssSaveTimer);
                customCssSaveTimer = setTimeout(function() {
                    customCssSaveTimer = null;
                    if (!customCssTextarea) return;
                    customCSS = customCssTextarea.value;
                    saveAndApply("LuoguDisplayBetter-customCSS", customCSS);
                }, 300);
            });
        }

        closeBtn.addEventListener('click', () => panelElement.classList.add('hidden'));

        blurSlider.addEventListener('input', function() {
            blurDisplay.textContent = this.value + 'px';
            saveAndApply("LuoguDisplayBetter-blur", this.value);
        });
        opacitySlider.addEventListener('input', function() {
            opacityDisplay.textContent = this.value + '%';
            saveAndApply("LuoguDisplayBetter-opacity", this.value);
        });
        topbarOpacitySlider.addEventListener('input', function() {
            topbarOpacityDisplay.textContent = this.value + '%';
            saveAndApply("LuoguDisplayBetter-topbarOpacity", this.value);
        });
        sidebarOpacitySlider.addEventListener('input', function() {
            sidebarOpacityDisplay.textContent = this.value + '%';
            saveAndApply("LuoguDisplayBetter-sidebarOpacity", this.value);
        });
        cardroundedSlider.addEventListener('input', function() {
            cardroundedDisplay.textContent = this.value + 'px';
            saveAndApply("LuoguDisplayBetter-cardborderRad", this.value);
        });
        picroundedSlider.addEventListener('input', function() {
            picroundedDisplay.textContent = this.value + 'px';
            saveAndApply("LuoguDisplayBetter-picborderRad", this.value);
        });

        cardRoundedCb.addEventListener('change', function() {
            saveAndApply("LuoguDisplayBetter-cardRounded", this.checked);
        });
        picRoundedCb.addEventListener('change', function() {
            saveAndApply("LuoguDisplayBetter-picRounded", this.checked);
        });
        bgFullscreenCb.addEventListener('change', function() {
            saveAndApply("LuoguDisplayBetter-bgFullscreen", this.checked);
        });
        adBlockCb.addEventListener('change', function() {
            saveAndApply("LuoguDisplayBetter-adBlock", this.checked);
        });

        updateChannelSel.addEventListener('change', function() {
            if (updateStatus._ldbTimer) {
                clearTimeout(updateStatus._ldbTimer);
                updateStatus._ldbTimer = null;
            }
            saveAndApply("LuoguDisplayBetter-updateChannel", this.value);
            updateStatus.textContent = '';
        });

        checkUpdateBtn.addEventListener('click', function() {
            checkForUpdate(updateStatus);
        });

        resetBtn.addEventListener('click', function() {
            if (updateStatus._ldbTimer) {
                clearTimeout(updateStatus._ldbTimer);
                updateStatus._ldbTimer = null;
            }
            writeDefaultSettings();
            loadSettings();

            blurSlider.value = blurValue;
            cardroundedSlider.value = cardborderRad;
            picroundedSlider.value = picborderRad;
            blurDisplay.textContent = blurValue + 'px';
            opacitySlider.value = 75;
            opacityDisplay.textContent = '75%';
            topbarOpacitySlider.value = topbarOpacityValue;
            topbarOpacityDisplay.textContent = topbarOpacityValue + '%';
            sidebarOpacitySlider.value = sidebarOpacityValue;
            sidebarOpacityDisplay.textContent = sidebarOpacityValue + '%';
            cardroundedDisplay.textContent = '15px';
            picroundedDisplay.textContent = '8px';
            cardRoundedCb.checked = true;
            picRoundedCb.checked = true;
            bgFullscreenCb.checked = true;
            adBlockCb.checked = false;

            if (customCssSaveTimer) {
                clearTimeout(customCssSaveTimer);
                customCssSaveTimer = null;
            }
            if (customCssTextarea) customCssTextarea.value = '';
            customCSS = '';
            updateChannelSel.value = 'stable';
            updateStatus.textContent = '';
            applyAll();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !panelElement.classList.contains('hidden')) {
                panelElement.classList.add('hidden');
            }
        });
    }

    function createSettingsPanel() {
        if (panelCreated) return;
        panelCreated = true;

        const container = document.createElement('div');
        container.innerHTML = buildPanelHTML();
        panelElement = container.firstElementChild;
        document.body.appendChild(panelElement);

        injectPanelStyle();
        bindPanelEvents();
    }

    function updatePanelStyle() {
        if (!panelElement) return;
        const bv = blurValue != null && !isNaN(blurValue) ? blurValue : 10;
        const ov = opacityValue != null && !isNaN(opacityValue) ? opacityValue : 75;
        panelElement.style.setProperty('--ldb-panel-blur', `blur(${bv}px)`);
        // Keep the settings panel readable even when cards are made very transparent.
        panelElement.style.setProperty('--ldb-panel-opacity', String(Math.min(1, Math.max(0.96, ov / 100))));
    }

    function toggleSettingsPanel() {
        if (!panelElement) createSettingsPanel();
        if (!panelElement) return;
        panelElement.classList.toggle('hidden');
    }

    function ensurePanelInDom() {
        if (!panelElement) return;
        if (!document.body.contains(panelElement)) {
            document.body.appendChild(panelElement);
        }
    }

    function addSettingsNavButton() {
        const sidebar = document.querySelector('nav.lside') || document.querySelector('nav.sidebar');
        if (sidebar) {
            if (document.getElementById('stylePluginSettingButton')) return;

            const groups = Array.from(sidebar.querySelectorAll('.nav-group'));
            const regularGroups = groups.filter(group => {
                return !group.classList.contains('on-expand') && group.querySelector('ul li');
            });
            const targetGroup = regularGroups.length
                ? regularGroups[regularGroups.length - 1]
                : groups.find(group => group.querySelector('ul li'));
            const ul = targetGroup && targetGroup.querySelector('ul');
            if (!ul) return;

            const sampleLi = ul.querySelector('li');
            if (!sampleLi) return;

            const newLi = document.createElement('li');
            copyDataAttributes(sampleLi, newLi);
            newLi.setAttribute('title', '美化插件设置');

            const newA = document.createElement('a');
            const sampleA = sampleLi.querySelector('a');
            if (sampleA) {
                copyDataAttributes(sampleA, newA);
                newA.className = sampleA.className;
                newA.setAttribute('disabled', sampleA.getAttribute('disabled') || 'false');
            }
            newA.href = 'javascript:void(0);';
            newA.id = 'stylePluginSettingButton';
            newA.setAttribute('aria-label', '美化插件设置');

            const icon = document.createElement('span');
            const sampleIcon = sampleLi.querySelector('span.icon') || sampleLi;
            copyDataAttributes(sampleIcon, icon);
            icon.className = 'icon';
            const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            iconSvg.setAttribute('viewBox', '0 0 24 24');
            iconSvg.setAttribute('width', '1em');
            iconSvg.setAttribute('height', '1em');
            iconSvg.setAttribute('fill', 'currentColor');
            iconSvg.setAttribute('aria-hidden', 'true');
            const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            iconPath.setAttribute('d', 'M3 17v2h6v-2H3zm0-12v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z');
            iconSvg.appendChild(iconPath);
            icon.appendChild(iconSvg);
            newA.appendChild(icon);

            const span = document.createElement('span');
            const sampleSpan = sampleLi.querySelector('span.title');
            if (sampleSpan) {
                copyDataAttributes(sampleSpan, span);
                span.className = sampleSpan.className;
            } else {
                span.className = 'title';
            }
            span.textContent = '美化插件设置';

            newA.appendChild(span);
            newLi.appendChild(newA);
            newA.addEventListener('click', e => { e.preventDefault(); toggleSettingsPanel(); });

            ul.appendChild(newLi);
            return;
        }

        const appsContainer = document.querySelector('.apps');
        if (!appsContainer) return;
        if (appsContainer.querySelector('#stylePluginSettingButton')) return;

        const sample = appsContainer.querySelector('a');
        if (!sample) return;

        const newLink = document.createElement('a');
        copyDataAttributes(sample, newLink);
        newLink.setAttribute('colorscheme', sample.getAttribute('colorscheme') || 'none');
        newLink.className = sample.className;
        newLink.href = 'javascript:void(0);';
        newLink.innerText = '美化插件设置';
        newLink.id = 'stylePluginSettingButton';
        newLink.addEventListener('click', e => { e.preventDefault(); toggleSettingsPanel(); });
        appsContainer.appendChild(newLink);
    }

    function purgeJsdelivr(rawUrl, callback) {
        if (!rawUrl.includes('jsdelivr.net')) {
            callback();
            return;
        }

        const purgeUrl = rawUrl
            .replace('cdn.jsdelivr.net', 'purge.jsdelivr.net')
            .replace('fastly.jsdelivr.net', 'purge.jsdelivr.net')
            .replace('gcore.jsdelivr.net', 'purge.jsdelivr.net')
            .replace('testingcf.jsdelivr.net', 'purge.jsdelivr.net');

        if (purgeUrl === rawUrl) {
            callback();
            return;
        }

        let called = false;
        const done = () => {
            if (called) return;
            called = true;
            callback();
        };

        GM_xmlhttpRequest({
            method: 'GET',
            url: purgeUrl,
            timeout: 5000,
            onload: done,
            onerror: done,
            ontimeout: done
        });
    }

    function checkForUpdate(statusEl) {
        if (statusEl._ldbTimer) {
            clearTimeout(statusEl._ldbTimer);
            statusEl._ldbTimer = null;
        }

        const urls = UPDATE_URLS[updateChannel];
        if (!urls || !urls.length) {
            statusEl.textContent = '未知通道';
            return;
        }

        const localVersion = GM_info.script.version;
        let index = 0;

        function fetchUrl(rawUrl) {
            const sep = rawUrl.includes('?') ? '&' : '?';
            const url = `${rawUrl}${sep}t=${Date.now()}`;

            statusEl.textContent = `检查中... (${index}/${urls.length})`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: { 'Cache-Control': 'no-cache' },
                timeout: 10000,
                onload(response) {
                    if (response.status !== 200) {
                        tryNext();
                        return;
                    }
                    const match = response.responseText.match(/\/\/\s*@version\s+([\d.]+)/);
                    if (!match) {
                        tryNext();
                        return;
                    }
                    const remoteVersion = match[1];
                    if (compareVersions(remoteVersion, localVersion) > 0) {
                        statusEl.innerHTML = '发现新版本 v' + remoteVersion + '，' +
                            '<a href="' + rawUrl + '" target="_blank" rel="noopener" class="ldb-update-link">点击安装</a>';
                    } else {
                        statusEl.textContent = '已是最新版本 v' + localVersion;
                        statusEl._ldbTimer = setTimeout(() => {
                            statusEl.textContent = '';
                            statusEl._ldbTimer = null;
                        }, 2000);
                    }
                },
                onerror: tryNext,
                ontimeout: tryNext
            });
        }

        function tryNext() {
            if (index >= urls.length) {
                statusEl.textContent = '网络请求失败';
                return;
            }

            const rawUrl = urls[index++];

            if (rawUrl.includes('jsdelivr.net')) {
                statusEl.textContent = `刷新缓存中... (${index}/${urls.length})`;
                purgeJsdelivr(rawUrl, () => fetchUrl(rawUrl));
            } else {
                fetchUrl(rawUrl);
            }
        }

        tryNext();
    }

    function applyAll() {
        applyRoundedCorners();
        applyCardBlur();
        applyCardOpacity();
        applyNavOpacity();
        applyFullscreenBackground();
        applyFullscreenEditorLayout();
        applyAdBlock();
        applyControlStyles();
        applyCustomCSS();
        applyIdeLayout();
        applyScrollbarStyle();
        updatePanelStyle();
        lastThemeSignature = getThemeSignature();
    }

    function pollDomState() {
        addSettingsNavButton();
        ensurePanelInDom();
        observeThemePage();
        syncSettingsFromStorage();

        if (relocateEditorToBody()) {
            scheduleEditorLayoutUpdate();
        }

        applyAdBlock();
        applyIdeLayout();
        refreshThemeStyles();
    }

    function startDomPolling() {
        if (domPollTimer) return;
        pollDomState();
        domPollTimer = setInterval(pollDomState, DOM_POLL_INTERVAL);
    }

    function startThemeBackgroundObserver() {
        if (bgObserver) return;

        bgObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                for (const node of m.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (
                        node.matches?.('.theme-page, #luogu-theme') ||
                        node.querySelector?.('.theme-page, #luogu-theme')
                    ) {
                        observeThemePage();
                        scheduleThemeRefresh();
                        return;
                    }
                }
                if (m.type === 'characterData' || m.type === 'childList') {
                    const t = m.target;
                    if (
                        t.id === 'luogu-theme' ||
                        t.parentElement?.id === 'luogu-theme'
                    ) {
                        scheduleThemeRefresh();
                        return;
                    }
                }
            }
        });

        bgObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function startResizeObserver() {
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => {
                if (document.querySelector('.casket.cs-full-screen')) {
                    scheduleEditorLayoutUpdate();
                }
            });
            ro.observe(document.documentElement);
        }

        window.addEventListener('resize', () => {
            if (document.querySelector('.casket.cs-full-screen')) {
                scheduleEditorLayoutUpdate();
            }
        });
    }

    function startSettingsWatcher() {
        window.addEventListener('storage', event => {
            if (event.storageArea && event.storageArea !== localStorage) return;
            if (event.key !== null && !event.key.startsWith('LuoguDisplayBetter-')) return;
            syncSettingsFromStorage();
        });
    }

    function init() {
        const firstUsed = localStorage.getItem("LuoguDisplayBetter-FirstUsed") == null;
        if (firstUsed) {
            localStorage.setItem("LuoguDisplayBetter-FirstUsed", false);
            writeDefaultSettings();
        }

        loadSettings();
        startThemeBackgroundObserver();
        addSettingsNavButton();
        observeThemePage();
        applyAll();

        setTimeout(() => {
            createSettingsPanel();
            ensurePanelInDom();
            syncPanelControls();
            if (firstUsed && panelElement && panelElement.classList.contains('hidden')) toggleSettingsPanel();
        }, SETTINGS_PANEL_DELAY);

        startDomPolling();
        startResizeObserver();
    }

    loadSettings();
    injectEarlyFullscreenStyle();
    startSettingsWatcher();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
