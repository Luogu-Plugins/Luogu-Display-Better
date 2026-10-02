// ==UserScript==
// @name         Luogu Display Better
// @namespace    https://github.com/Luogu-Plugins
// @version      1.4.2
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
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const STYLE_IDS = {
        rounded: 'ldb-rounded-style',
        blur: 'ldb-blur-style',
        opacity: 'ldb-opacity-style',
        editorLayout: 'ldb-editor-layout-style',
        bgFullscreen: 'ldb-bgfullscreen-style',
        adBlock: 'ldb-adblock-style',
        customCSS: 'ldb-custom-style',
        idePadding: 'ldb-ide-padding-style',
        scrollbar: 'ldb-scrollbar-style'
    };

    const EDITOR_GAP = 10;
    const EDITOR_Z_INDEX = 1500;
    const DOM_POLL_INTERVAL = 200;
    const SETTINGS_PANEL_DELAY = 150;

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
    let cardRounded, picRounded, bgFullscreen, adBlock, customCSS, updateChannel;

    let panelCreated = false;
    let panelElement = null;
    let customCssTextarea = null;

    let customCssSaveTimer = null;
    let layoutUpdateTimer = null;
    let domPollTimer = null;
    let bgUpdateRaf = null;
    let bgObserver = null;

    function removeStyleElement(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function computeCardColor() {
        const alpha = opacityValue / 100;
        const themePage = document.querySelector('.theme-page');
        let baseColor = '255, 255, 255';

        if (themePage) {
            const native = getComputedStyle(themePage).getPropertyValue('--theme-card-background').trim();
            if (native) {
                const m = native.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
                if (m) baseColor = `${m[1]}, ${m[2]}, ${m[3]}`;
            }
        }
        return `rgba(${baseColor}, ${alpha})`;
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

    function loadSettings() {
        cardborderRad = parseFloat(localStorage.getItem("LuoguDisplayBetter-cardborderRad") ?? 15);
        picborderRad = parseFloat(localStorage.getItem("LuoguDisplayBetter-picborderRad") ?? 8);
        blurValue = parseFloat(localStorage.getItem("LuoguDisplayBetter-blur") ?? 10);
        opacityValue = parseFloat(localStorage.getItem("LuoguDisplayBetter-opacity") ?? 75);
        cardRounded = localStorage.getItem("LuoguDisplayBetter-cardRounded") !== 'false';
        picRounded = localStorage.getItem("LuoguDisplayBetter-picRounded") !== 'false';
        adBlock = localStorage.getItem("LuoguDisplayBetter-adBlock") === 'true';
        bgFullscreen = localStorage.getItem("LuoguDisplayBetter-bgFullscreen") !== 'false';
        customCSS = localStorage.getItem("LuoguDisplayBetter-customCSS") ?? '';
        updateChannel = localStorage.getItem("LuoguDisplayBetter-updateChannel") ?? 'stable';
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
                .author, .meta {
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
            .top-bar, .sidebar, .nav-group, nav.lfe-body, .user-nav, .wrapper.wrapped.lfe-body.header-layout.tiny { backdrop-filter: ${val} !important; -webkit-backdrop-filter: ${val} !important; }
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
            .header-layout, .top-bar { z-index: 1000 !important; }`;
        document.head.appendChild(style);
    }

    function applyCardOpacity() {
        removeStyleElement(STYLE_IDS.opacity);
        if (isNaN(opacityValue)) return;

        const cardColor = computeCardColor();

        const style = document.createElement('style');
        style.id = STYLE_IDS.opacity;
        style.textContent = `.lg-article, .l-card, .card { background-color: ${cardColor} !important; }
            .dropdown .center, .popup { background-color: ${cardColor} !important; }
            .am-comment-hd, .am-comment-bd { background-color: ${cardColor} !important; }
            nav.lfe-body > div { background-color: ${cardColor} !important; }
            .user-header-bottom { background-color: transparent !important; }
            .ide-container { background-color: ${cardColor} !important; }
            .panel-layout>.panel-divider.with-icon { background-color: transparent !important; }
            .panel-layout>.panel-divider.dragging { background-color: var(--lfe-color--primary) !important; }
            .ͼ2 .cm-gutters, .ide-toolbar { background-color: transparent !important; border: 0px solid transparent !important; }
            input:not([type=range]), textarea, .refined-input { background-color: transparent !important; }
            .panel-divider, .layout-horizontal>.panel-divider { background-color: transparent !important; }
            .combo-wrapper>.text, .lform-size-middle.block-item.tag-button,
            .casket.cs-main:not(.cs-full-screen),
            .casket:not(.cs-full-screen) .cs-header,
            .casket:not(.cs-full-screen) .cs-footer,
            code[class*=language-], pre[class*=language-], .lfe-code { background-color: transparent !important; }`;
        document.head.appendChild(style);

        const themePage = document.querySelector('.theme-page');
        if (themePage) {
            themePage.style.setProperty('--theme-card-background', cardColor);
        }
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

    function restoreThemeVars(themePage) {
        if (!themePage || !themePage._ldbSavedVars) return;
        for (const [key, value] of Object.entries(themePage._ldbSavedVars)) {
            if (value) {
                themePage.style.setProperty(key, value);
            } else {
                themePage.style.removeProperty(key);
            }
        }
        delete themePage._ldbSavedVars;
    }

    function resolveBackgroundImage(themePage) {
        if (themePage) {
            const cs = getComputedStyle(themePage);
            const img = cs.getPropertyValue('--theme-body-image').trim();
            if (img && img !== 'none') {
                const urlMatch = img.match(/url\(["']?([^"')]+)["']?\)/);
                return {
                    image: urlMatch ? `url("${urlMatch[1]}")` : `url("${img.replace(/^["']|["']$/g, '')}")`,
                    repeat: cs.getPropertyValue('--theme-body-image-repeat').trim() || 'no-repeat',
                    size: cs.getPropertyValue('--theme-body-image-size').trim() || 'cover',
                    position: cs.getPropertyValue('--theme-body-image-position').trim() || 'center',
                    filter: cs.getPropertyValue('--theme-body-color-filter').trim() || 'none'
                };
            }
        }

        const themeScript = document.getElementById('luogu-theme');
        if (themeScript) {
            try {
                const data = JSON.parse(themeScript.textContent);
                if (data && data.lBody && data.lBody.image) {
                    const midOpts = data.lBody.midOpts || {};
                    let position = 'center';
                    if (Array.isArray(midOpts.position) && midOpts.position.length >= 2) {
                        position = `${midOpts.position[0]}% ${midOpts.position[1]}%`;
                    }
                    let filter = 'none';
                    if (typeof midOpts.brightness === 'number' && midOpts.brightness !== 0) {
                        filter = `brightness(${100 + midOpts.brightness}%)`;
                    }
                    return {
                        image: `url("${data.lBody.image}")`,
                        repeat: midOpts.notEmpty === false ? 'repeat' : 'no-repeat',
                        size: midOpts.size || 'cover',
                        position: position,
                        filter: filter
                    };
                }
            } catch (e) {
            }
        }

        const bgDiv = document.querySelector('.header-layout .background');
        if (bgDiv) {
            const style = getComputedStyle(bgDiv);
            if (style.backgroundImage && style.backgroundImage !== 'none') {
                return {
                    image: style.backgroundImage,
                    repeat: style.backgroundRepeat || 'no-repeat',
                    size: style.backgroundSize || 'cover',
                    position: style.backgroundPosition || 'center',
                    filter: 'none'
                };
            }
        }

        return null;
    }

    function forceMainTransparent() {
        const list = document.querySelectorAll('.main-container > main, main');
        list.forEach(el => {
            const bgc = el.style.getPropertyValue('background-color').trim();
            const bg = el.style.getPropertyValue('background').trim();
            if (bgc && bgc !== 'transparent' && bgc !== 'rgba(0, 0, 0, 0)') {
                el.style.setProperty('background-color', 'transparent', 'important');
            }
            if (bg && bg !== 'transparent' && bg !== 'none') {
                el.style.setProperty('background', 'transparent', 'important');
            }
        });
    }

    function applyFullscreenBackground() {
        removeStyleElement(STYLE_IDS.bgFullscreen);
        document.documentElement.classList.remove('ldb-bgfullscreen');

        const themePage = document.querySelector('.theme-page');
        restoreThemeVars(themePage);

        if (!bgFullscreen) return;

        const bg = resolveBackgroundImage(themePage);
        if (!bg) return;

        if (themePage) {
            const varsToOverride = [
                '--theme-body-image',
                '--theme-body-color',
                '--theme-body-mid-mask',
                '--theme-body-color-filter',
                '--theme-body-back'
            ];
            const saved = {};
            for (const v of varsToOverride) {
                saved[v] = themePage.style.getPropertyValue(v);
            }
            themePage._ldbSavedVars = saved;

            themePage.style.setProperty('--theme-body-image', 'none');
            themePage.style.setProperty('--theme-body-color', 'none');
            themePage.style.setProperty('--theme-body-mid-mask', 'none');
            themePage.style.setProperty('--theme-body-color-filter', 'none');
            themePage.style.setProperty('--theme-body-back', 'transparent');
        }

        const nav = document.querySelector('.container nav');
        if (nav && location.pathname === '/') nav.classList.remove('user-nav');

        document.documentElement.classList.add('ldb-bgfullscreen');

        const styleEl = document.createElement('style');
        styleEl.id = STYLE_IDS.bgFullscreen;
        styleEl.textContent = `html.ldb-bgfullscreen {
                background: transparent !important;
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
                background-image: ${bg.image} !important;
                background-repeat: ${bg.repeat} !important;
                background-position: ${bg.position} !important;
                background-size: ${bg.size} !important;
                filter: ${bg.filter} !important;
                -webkit-filter: ${bg.filter} !important;
            }
            .header-layout.tiny[data-v-7ddab1d5], .lfe-body[data-v-12f19ddc] { background: transparent !important; }
            .article-banner + div[data-v-fc349d1c] { background: transparent !important; }
            html.ldb-bgfullscreen .lcolor-bg-background { background: transparent !important; }
            html.ldb-bgfullscreen .article-banner.article-banner {
                background: rgba(245, 245, 245, ${opacityValue / 100}) !important;
            }
            html.ldb-bgfullscreen .article-content.article-content {
                background: rgba(255, 255, 255, ${opacityValue / 100}) !important;
            }
            html.ldb-bgfullscreen .toc.toc {
                background: white !important;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .15), 0 0 1px 0 rgba(0, 0, 0, .5) inset;
                padding: 3px 8px;
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
            html.ldb-bgfullscreen .top-bar,
            html.ldb-bgfullscreen .sidebar,
            html.ldb-bgfullscreen .nav-group,
            html.ldb-bgfullscreen nav.lfe-body,
            html.ldb-bgfullscreen nav.lfe-body > div,
            html.ldb-bgfullscreen .user-nav,
            html.ldb-bgfullscreen .header-layout {
                background: transparent !important;
                background-color: transparent !important;
            }
            html.ldb-bgfullscreen .top-bar { --theme-navi-back: transparent !important; }
            html.ldb-bgfullscreen body::before,
            html.ldb-bgfullscreen body::after,
            html.ldb-bgfullscreen #app::before,
            html.ldb-bgfullscreen #app::after {
                background: none !important;
                background-image: none !important;
            }
            html.ldb-bgfullscreen #app { background: transparent !important; }`;
        document.head.appendChild(styleEl);

        forceMainTransparent();
    }

    function cleanThemeBackground() {
        document.querySelectorAll('.theme-page').forEach(el => {
            if (el.classList.contains('theme-frosted')) {
                el.classList.remove('theme-frosted');
            }
            if (el.hasAttribute('style')) {
                el.removeAttribute('style');
            }
        });
    }

    const BG_VAR_OVERRIDES = [
        ['--theme-body-image', 'none'],
        ['--theme-body-color', 'none'],
        ['--theme-body-mid-mask', 'none'],
        ['--theme-body-color-filter', 'none'],
        ['--theme-body-back', 'transparent']
    ];

    function isFullscreenBackgroundApplied() {
        if (!document.documentElement.classList.contains('ldb-bgfullscreen')) return false;
        if (!document.getElementById(STYLE_IDS.bgFullscreen)) return false;

        const themePage = document.querySelector('.theme-page');
        if (!themePage) return true;
        if (themePage.classList.contains('theme-frosted')) return false;
        if (!themePage._ldbSavedVars) return false;

        for (const [name, value] of BG_VAR_OVERRIDES) {
            if (themePage.style.getPropertyValue(name) !== value) return false;
        }
        return true;
    }

    function refreshThemeBackground(force) {
        if (bgUpdateRaf) return;
        bgUpdateRaf = requestAnimationFrame(() => {
            bgUpdateRaf = null;
            if (!force && bgFullscreen && isFullscreenBackgroundApplied()) return;
            cleanThemeBackground();
            if (bgFullscreen) {
                applyFullscreenBackground();
            }
        });
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
        style.textContent = `.side div[data-v-ce0b4304] { display: none !important; }`;
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
        removeStyleElement(STYLE_IDS.idePadding);

        const mainContainer = document.querySelector('.main-container.lside-nav');
        if (!mainContainer) return;

        const isIdePage = !!mainContainer.querySelector('.panel-layout.ide-container');
        const topBar = document.querySelector('.top-bar');
        const topH = topBar ? topBar.getBoundingClientRect().height : 48;

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

    function buildPanelHTML() {
        return `<div id="ldb-panel" class="l-card hidden">
                <button id="ldb-panel-close" aria-label="关闭">×</button>
                <h2>插件设置</h2>
                <h3>卡片模糊度</h3>
                <p>
                    <input id="ldb-panel-blur" type="range" min="0" max="30" value="${blurValue}" />
                    <span id="blur-value">${blurValue}px</span>
                </p>
                <h3>卡片不透明度</h3>
                <p>
                    <input id="ldb-panel-opacity" type="range" min="0" max="100" value="${opacityValue}" />
                    <span id="opacity-value">${opacityValue}%</span>
                </p>
                <h3>卡片圆角曲度</h3>
                <p>
                    <input id="ldb-panel-rounded-card" type="range" min="0" max="30" value="${cardborderRad}" />
                    <span id="rounded-value-card">${cardborderRad}px</span>
                </p>
                <h3>图片圆角曲度</h3>
                <p>
                    <input id="ldb-panel-rounded-pic" type="range" min="0" max="16" value="${picborderRad}" />
                    <span id="rounded-value-pic">${picborderRad}px</span>
                </p>
                <p>
                    <input id="ldb-panel-card-rounded" type="checkbox" ${cardRounded ? 'checked' : ''} />
                    <label for="ldb-panel-card-rounded">卡片圆角</label>
                </p>
                <p>
                    <input id="ldb-panel-pic-rounded" type="checkbox" ${picRounded ? 'checked' : ''} />
                    <label for="ldb-panel-pic-rounded">图片圆角</label>
                </p>
                <p>
                    <input id="ldb-panel-bgfullscreen" type="checkbox" ${bgFullscreen ? 'checked' : ''} />
                    <label for="ldb-panel-bgfullscreen">背景全屏（在 <a href="/theme" target="_blank">主题</a> 内启用中景图片进行设置）</label>
                </p>
                <p>
                    <input id="ldb-panel-adblock" type="checkbox" ${adBlock ? 'checked' : ''} />
                    <label for="ldb-panel-adblock">关闭广告</label>
                </p>
                <h3>自定义 CSS</h3>
                <textarea id="ldb-panel-customCSS" spellcheck="false" autocomplete="off" autocapitalize="off"></textarea>
                <h3>更新通道</h3>
                <p>
                    <select id="ldb-panel-updateChannel">
                        <option value="stable" ${updateChannel === 'stable' ? 'selected' : ''}>稳定版</option>
                        <option value="latest" ${updateChannel === 'latest' ? 'selected' : ''}>最新版</option>
                    </select>
                </p>
                <p>
                    <button id="ldb-panel-checkUpdate">检查更新</button>
                    <button id="ldb-panel-reset">还原设置</button>
                </p>
                <p id="ldb-updateStatus"></p>
            </div>`;
    }

    function injectPanelStyle() {
        const style = document.createElement('style');
        style.textContent = `#ldb-panel {
                position: fixed !important;
                right: 35px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                padding: 28px 24px 24px !important;
                background: rgba(255, 255, 255, ${opacityValue / 100}) !important;
                backdrop-filter: blur(${blurValue}px) !important;
                -webkit-backdrop-filter: blur(${blurValue}px) !important;
                border-radius: 24px !important;
                box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
                color: #1e1e2f !important;
                transition: opacity .3s ease, visibility .3s ease, transform .3s ease !important;
                z-index: 2147483000 !important;
                box-sizing: border-box !important;
                width: min(400px, 50vw) !important;
                max-width: calc(100vw - 70px) !important;
                max-height: calc(100vh - 40px) !important;
                overflow-y: auto !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                             "PingFang SC", "Microsoft YaHei", sans-serif !important;
                font-size: 14px !important;
                line-height: 1.4 !important;
                text-align: left !important;
            }
            #ldb-panel.hidden {
                opacity: 0 !important;
                visibility: hidden !important;
                transform: translateY(-50%) scale(0.96) !important;
                pointer-events: none !important;
            }
            #ldb-panel-close {
                position: absolute !important;
                top: 12px !important;
                right: 12px !important;
                width: 32px !important;
                height: 32px !important;
                padding: 1px 0 0 0 !important;
                margin: 0 !important;
                border: none !important;
                border-radius: 50% !important;
                background: #ff4d4f !important;
                box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
                color: #fff !important;
                font-family: Arial, Helvetica, sans-serif !important;
                font-size: 22px !important;
                font-weight: 400 !important;
                line-height: 1 !important;
                text-align: center !important;
                box-sizing: border-box !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
                cursor: pointer !important;
                transition: background .2s, transform .2s !important;
            }
            #ldb-panel-close:hover { background: #e04345 !important; transform: scale(1.06) !important; }
            #ldb-panel-close:active { transform: scale(0.92) !important; }
            #ldb-panel h2 { margin: 0 0 16px 0 !important; font-size: 22px !important;
                            font-weight: 600 !important; color: #2c3e50 !important; line-height: 1.3 !important; }
            #ldb-panel h3 { margin: 18px 0 6px 0 !important; font-size: 15px !important;
                            font-weight: 500 !important; color: #34495e !important; line-height: 1.3 !important; }
            #ldb-panel p {
                margin: 6px 0 12px 0 !important;
                padding: 0 !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                font-size: 14px !important;
                line-height: 1.4 !important;
            }
            #ldb-panel p > input[type="checkbox"] {
                flex: 0 0 auto !important;
                width: 18px !important;
                height: 18px !important;
                margin: 0 !important;
                padding: 0 !important;
                accent-color: #000 !important;
                cursor: pointer !important;
                vertical-align: middle !important;
            }
            #ldb-panel p > label {
                display: inline-block !important;
                margin: 0 !important;
                padding: 0 !important;
                cursor: pointer !important;
                user-select: none !important;
                font-size: 14px !important;
                font-weight: 400 !important;
                line-height: 1 !important;
                color: #1e1e2f !important;
                vertical-align: middle !important;
            }
            #ldb-panel input[type="range"] {
                flex: 1 !important;
                accent-color: #000 !important;
                height: 4px !important;
                border-radius: 2px !important;
                background: #dce3e8 !important;
                cursor: pointer !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            #ldb-panel input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none !important;
                width: 16px !important;
                height: 16px !important;
                border-radius: 50% !important;
                background: #000 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2) !important;
                cursor: pointer !important;
            }
            #ldb-panel-customCSS {
                display: block !important;
                width: 100% !important;
                height: clamp(100px, calc(100vh - 700px), 160px) !important;
                margin: 0 !important;
                padding: 8px 10px !important;
                border: 1px solid #ccc !important;
                border-radius: 4px !important;
                box-sizing: border-box !important;
                background: transparent !important;
                color: #1e1e2f !important;
                font-family: var(--lfe-code-font, Monospace) !important;
                font-size: 13px !important;
                line-height: 1.5 !important;
                resize: none !important;
                -webkit-appearance: none !important;
                overflow: auto !important;
                outline: none !important;
                tab-size: 2 !important;
                -moz-tab-size: 2 !important;
                white-space: pre !important;
                transition: border-color .2s, box-shadow .2s !important;
            }
            #ldb-panel-customCSS::placeholder { color: #9aa4ad !important; }
            #ldb-panel-customCSS:focus {
                border-color: #000 !important;
                box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08) !important;
            }
            #ldb-panel-updateChannel {
                flex: 1 !important;
                height: 32px !important;
                padding: 0 10px !important;
                font-size: 14px !important;
                font-family: inherit !important;
                color: #1e1e2f !important;
                background: rgba(255, 255, 255, 0.9) !important;
                border: 1px solid #ccc !important;
                border-radius: 8px !important;
                box-sizing: border-box !important;
                cursor: pointer !important;
                outline: none !important;
                transition: border-color .2s, box-shadow .2s !important;
            }
            #ldb-panel-updateChannel:hover { border-color: #999 !important; }
            #ldb-panel-updateChannel:focus {
                border-color: #000 !important;
                box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08) !important;
            }
            #ldb-panel-checkUpdate {
                display: inline-block !important;
                margin: 0 !important;
                padding: 8px 24px !important;
                background: #000 !important;
                border: none !important;
                border-radius: 30px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                color: #fff !important;
                cursor: pointer !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.15) !important;
                line-height: 1.4 !important;
                box-sizing: border-box !important;
                transition: background .2s, transform .1s !important;
            }
            #ldb-panel-checkUpdate:hover { background: #333 !important; }
            #ldb-panel-checkUpdate:active { transform: scale(0.96) !important; }
            #ldb-panel-reset {
                display: inline-block !important;
                margin: 0 !important;
                padding: 8px 24px !important;
                background: #ecf0f1 !important;
                border: none !important;
                border-radius: 30px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                color: #2c3e50 !important;
                cursor: pointer !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.05) !important;
                line-height: 1.4 !important;
                box-sizing: border-box !important;
                transition: background .2s, transform .1s !important;
            }
            #ldb-panel-reset:hover { background: #d5dbe0 !important; }
            #ldb-panel-reset:active { transform: scale(0.96) !important; }
            #ldb-panel #ldb-updateStatus {
                display: block !important;
                margin: 4px 0 0 0 !important;
                padding: 0 !important;
                font-size: 12px !important;
                line-height: 1.4 !important;
                color: #e53935 !important;
                text-align: left !important;
                word-break: break-all !important;
            }
            #ldb-panel #ldb-updateStatus:empty { display: none !important; margin: 0 !important; }
            #blur-value, #opacity-value, #rounded-value-card, #rounded-value-pic {
                display: inline-block !important;
                width: 45px !important;
                text-align: center !important;
                font-weight: 500 !important;
                line-height: 1 !important;
            }
            #ldb-panel a { color: #0d3d41 !important; text-decoration: none !important; }
            #ldb-panel a:hover { text-decoration: underline !important; }
            @media (max-width: 900px) {
                #ldb-panel { width: 50vw !important; right: 12px !important; }
            }
            @media (max-width: 400px) {
                #ldb-panel { width: calc(100vw - 20px) !important; right: 10px !important;
                             padding: 20px 16px !important; }
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
        const bv = blurValue != null ? blurValue : 0;
        const ov = opacityValue != null ? opacityValue : 100;
        panelElement.style.backdropFilter = `blur(${bv}px)`;
        panelElement.style.webkitBackdropFilter = `blur(${bv}px)`;
        panelElement.style.background = `rgba(255, 255, 255, ${ov / 100})`;
        panelElement.style.color = '#1e1e2f';
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
        if (document.querySelector('.sidebar.lside.bar.hide.nav-scrollbar')) {
            if (document.getElementById('stylePluginSettingButton')) return;

            const ul = document.querySelector('.nav-group.on-expand ul[data-v-a119941e]');
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

            const span = document.createElement('span');
            const sampleSpan = sampleLi.querySelector('span.title');
            if (sampleSpan) {
                copyDataAttributes(sampleSpan, span);
                span.className = sampleSpan.className;
            }
            span.textContent = '美化插件设置';

            newA.appendChild(document.createComment(''));
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
                            '<a href="' + rawUrl + '" target="_blank" style="color:#0d6efd;text-decoration:underline;cursor:pointer;">点击安装</a>';
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
        applyFullscreenBackground();
        applyFullscreenEditorLayout();
        applyAdBlock();
        applyCustomCSS();
        applyIdeLayout();
        applyScrollbarStyle();
        cleanThemeBackground();
        updatePanelStyle();
    }

    function pollDomState() {
        addSettingsNavButton();
        ensurePanelInDom();

        if (relocateEditorToBody()) {
            scheduleEditorLayoutUpdate();
        }

        applyAdBlock();
        refreshThemeBackground();
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
                        refreshThemeBackground(true);
                        return;
                    }
                }
                if (m.type === 'characterData' || m.type === 'childList') {
                    const t = m.target;
                    if (
                        t.id === 'luogu-theme' ||
                        t.parentElement?.id === 'luogu-theme'
                    ) {
                        refreshThemeBackground(true);
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

    function init() {
        const firstUsed = localStorage.getItem("LuoguDisplayBetter-FirstUsed") == null;
        if (firstUsed) {
            localStorage.setItem("LuoguDisplayBetter-FirstUsed", false);
            writeDefaultSettings();
        }

        loadSettings();
        startThemeBackgroundObserver();
        addSettingsNavButton();
        applyAll();

        setTimeout(() => {
            createSettingsPanel();
            ensurePanelInDom();
            if (firstUsed && panelElement && panelElement.classList.contains('hidden')) toggleSettingsPanel();
        }, SETTINGS_PANEL_DELAY);

        startDomPolling();
        startResizeObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
