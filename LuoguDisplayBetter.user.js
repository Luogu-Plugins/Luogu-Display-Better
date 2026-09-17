// ==UserScript==
// @name         Luogu Display Better
// @namespace    https://github.com/Luogu-Plugins
// @version      1.2.3
// @description  Change your Luogu style what you like best
// @author       Luogu-Plugins
// @match        *://www.luogu.com.cn/*
// @connect      cdn.jsdelivr.net
// @icon         https://fecdn.luogu.com.cn/columba/static.325908fec383795b.logo-single-color.svg
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let cardborderRad;
    let picborderRad;
    let blurValue;
    let opacityValue;
    let cardRounded;
    let picRounded;
    let bgFullscreen;
    let adBlock;
    let customCSS;
    let updateChannel;

    let bgCleanObserver = null;
    let isObserving = false;
    let adBlockObserver = null;

    const UPDATE_URLS = {
        stable: 'https://cdn.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@main/LuoguDisplayBetter.user.js',
        latest: 'https://cdn.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@dev/LuoguDisplayBetter.user.js'
    };

    const UPDATE_URLS = {
        stable: 'https://cdn.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@main/LuoguDisplayBetter.user.js',
        latest: 'https://cdn.jsdelivr.net/gh/Luogu-Plugins/Luogu-Display-Better@dev/LuoguDisplayBetter.user.js'
    };

    function initVarible() {
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

    function applyRounded() {
        const old = document.getElementById('ldb-rounded-style');
        if (old) old.remove();
        if (isNaN(cardborderRad) && isNaN(picborderRad)) return;
        let style = document.createElement('style');
        style.id = 'ldb-rounded-style';
        const cardRadius = cardborderRad + 'px';
        const picRadius = picborderRad + 'px';
        let css = ``;
        if (cardRounded) {
            css = `.l-card, .lg-article, .card { border-radius: ${cardRadius} !important; }
                .swal2-popup { border-radius: ${cardRadius} !important; }
                .l-form-layout, .am-panel { border-radius: ${cardRadius} !important; }
                .l-card.comment .author { border-top-left-radius: ${cardRadius} !important; border-top-right-radius: ${cardRadius} !important; }
                .dropdown .center { border-radius: ${cardRadius} !important; }
                .user-header-top { border-top-left-radius: ${cardRadius}; border-top-right-radius: ${cardRadius}; } .user-header-bottom { border-bottom-left-radius: ${cardRadius}; border-bottom-right-radius: ${cardRadius}; }
                .user-nav { border-bottom-left-radius: ${cardRadius}; border-bottom-right-radius: ${cardRadius}; }
                .test-case { border-radius: 10px; }
                html.ldb-bgfullscreen .article-banner.article-banner { border-top-left-radius: ${cardRadius} !important; border-top-right-radius: ${cardRadius} !important; }
                html.ldb-bgfullscreen .article-content.article-content { border-bottom-left-radius: ${cardRadius} !important; border-bottom-right-radius: ${cardRadius} !important; }
                html.ldb-bgfullscreen .toc.toc { border-radius: .5em !important; }
                .meta { border-top-left-radius: ${cardRadius} !important; border-top-right-radius: ${cardRadius} !important; }`;
        }
        if (picRounded) css += `img { border-radius: ${picRadius} !important; }`;
        style.innerHTML = css;
        document.head.append(style);
    }

    function applyCardBlur() {
        const old = document.getElementById('ldb-blur-style');
        if (old) old.remove();
        if (blurValue === undefined || isNaN(blurValue)) return;
        const style = document.createElement('style');
        style.id = 'ldb-blur-style';
        const val = blurValue === 0 ? 'none' : `blur(${blurValue}px)`;
        let css =
            `.lg-article, .card, .l-card { backdrop-filter: ${val} !important; -webkit-backdrop-filter: ${val} !important; }
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
            .dropdown, .dropdown-container, [class*="dropdown"] { overflow: visible !important; }
            .header-layout, .top-bar { z-index: 1000 !important; }`;
        style.innerHTML = css;
        document.head.append(style);
    }

    function applyCardOpacity() {
        const old = document.getElementById('ldb-opacity-style');
        if (old) old.remove();
        if (opacityValue === undefined || isNaN(opacityValue)) return;

        const alpha = opacityValue / 100;

        const themePage = document.querySelector('.theme-page');
        let baseColor = '255, 255, 255';
        if (themePage) {
            const native = getComputedStyle(themePage)
                .getPropertyValue('--theme-card-background')
                .trim();
            if (native) {
                const m = native.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
                if (m) baseColor = `${m[1]}, ${m[2]}, ${m[3]}`;
            }
        }
        const cardColor = `rgba(${baseColor}, ${alpha})`;

        const style = document.createElement('style');
        style.id = 'ldb-opacity-style';
        style.innerHTML = `.lg-article, .l-card, .card { background-color: ${cardColor} !important; }
              .dropdown .center, .popup { background-color: ${cardColor} !important; }
              .am-comment-hd, .am-comment-bd { background-color: ${cardColor} !important; }
              nav.lfe-body > div { background-color: ${cardColor} !important; }
              .user-header-bottom { background-color: transparent !important; }`;
        document.head.append(style);

        if (themePage) {
            themePage.style.setProperty('--theme-card-background', cardColor);
        }
    }

    function forceMainTransparent() {
        const list = document.querySelectorAll('.main-container > main, main');
        if (!list.length) return;
        list.forEach(el => {
            const bgc = el.style.getPropertyValue('background-color').trim();
            const bg  = el.style.getPropertyValue('background').trim();
            if (bgc && bgc !== 'transparent' && bgc !== 'rgba(0, 0, 0, 0)') {
                el.style.setProperty('background-color', 'transparent', 'important');
            }
            if (bg && bg !== 'transparent' && bg !== 'none') {
                el.style.setProperty('background', 'transparent', 'important');
            }
        });
    }

    function applyBgFullscreen() {
        const oldStyle = document.getElementById('ldb-bgfullscreen-style');
        if (oldStyle) oldStyle.remove();
        document.documentElement.classList.remove('ldb-bgfullscreen');

        const themePage = document.querySelector('.theme-page');

        if (themePage && themePage._ldbSavedVars) {
            for (const [key, value] of Object.entries(themePage._ldbSavedVars)) {
                if (value) {
                    themePage.style.setProperty(key, value);
                } else {
                    themePage.style.removeProperty(key);
                }
            }
            delete themePage._ldbSavedVars;
        }

        if (!bgFullscreen) return;

        let bgImage = null;
        let bgRepeat = 'no-repeat';
        let bgSize = 'cover';
        let bgPosition = 'center';
        let bgFilter = 'none';

        if (themePage) {
            const cs = getComputedStyle(themePage);

            const img = cs.getPropertyValue('--theme-body-image').trim();
            if (img && img !== 'none') {
                const urlMatch = img.match(/url\(["']?([^"')]+)["']?\)/);
                bgImage = urlMatch ? `url("${urlMatch[1]}")` : `url("${img.replace(/^["']|["']$/g, '')}")`;
            }

            const repeatVal = cs.getPropertyValue('--theme-body-image-repeat').trim();
            if (repeatVal) bgRepeat = repeatVal;

            const sizeVal = cs.getPropertyValue('--theme-body-image-size').trim();
            if (sizeVal) bgSize = sizeVal;

            const posVal = cs.getPropertyValue('--theme-body-image-position').trim();
            if (posVal) bgPosition = posVal;

            const filterVal = cs.getPropertyValue('--theme-body-color-filter').trim();
            if (filterVal && filterVal !== 'none') bgFilter = filterVal;
        }

        if (!bgImage) {
            const themeScript = document.getElementById('luogu-theme');
            if (themeScript) {
                try {
                    const themeData = JSON.parse(themeScript.textContent);
                    if (themeData?.lBody?.image) {
                        bgImage = `url("${themeData.lBody.image}")`;
                        const midOpts = themeData.lBody.midOpts || {};
                        if (midOpts.size) bgSize = midOpts.size;
                        if (Array.isArray(midOpts.position) && midOpts.position.length >= 2) {
                            bgPosition = `${midOpts.position[0]}% ${midOpts.position[1]}%`;
                        }
                        if (typeof midOpts.brightness === 'number' && midOpts.brightness !== 0) {
                            bgFilter = `brightness(${100 + midOpts.brightness}%)`;
                        }
                        if (typeof midOpts.notEmpty === 'boolean') {
                            bgRepeat = midOpts.notEmpty ? 'no-repeat' : 'repeat';
                        }
                    }
                } catch (e) {
                }
            }
        }

        if (!bgImage) {
            const bgDiv = document.querySelector('.header-layout .background');
            if (bgDiv) {
                const style = getComputedStyle(bgDiv);
                const img = style.backgroundImage;
                if (img && img !== 'none') {
                    bgImage = img;
                    if (style.backgroundRepeat) bgRepeat = style.backgroundRepeat;
                    if (style.backgroundSize) bgSize = style.backgroundSize;
                    if (style.backgroundPosition) bgPosition = style.backgroundPosition;
                }
            }
        }

        if (!bgImage || bgImage === 'none') return;

        if (themePage) {
            const varsToOverride = [
                '--theme-body-image',
                '--theme-body-color',
                '--theme-body-mid-mask',
                '--theme-body-color-filter',
                '--theme-body-back'
            ];
            const savedVars = {};
            for (const v of varsToOverride) {
                savedVars[v] = themePage.style.getPropertyValue(v);
            }
            themePage._ldbSavedVars = savedVars;

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
        styleEl.id = 'ldb-bgfullscreen-style';
        styleEl.textContent = `
            html.ldb-bgfullscreen {
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
                background-image: ${bgImage} !important;
                background-repeat: ${bgRepeat} !important;
                background-position: ${bgPosition} !important;
                background-size: ${bgSize} !important;
                filter: ${bgFilter} !important;
                -webkit-filter: ${bgFilter} !important;
            }
            .header-layout.tiny[data-v-7ddab1d5], .lfe-body[data-v-12f19ddc] {
                background: transparent !important;
            }
            .article-banner + div[data-v-fc349d1c] {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .lcolor-bg-background {
                background: transparent !important;
            }
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
            html.ldb-bgfullscreen .header-layout .background {
                opacity: 0;
            }
            html.ldb-bgfullscreen .wrapper.wrapped:not(.header-layout) .background {
                display: none;
            }
            html.ldb-bgfullscreen .wrapper.wrapped:not(.header-layout) {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .footer {
                background: transparent !important;
            }
            html.ldb-bgfullscreen .theme-page {
                background: transparent !important;
            }
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
            html.ldb-bgfullscreen .top-bar {
                --theme-navi-back: transparent !important;
            }
            html.ldb-bgfullscreen body::before,
            html.ldb-bgfullscreen body::after,
            html.ldb-bgfullscreen #app::before,
            html.ldb-bgfullscreen #app::after {
                background: none !important;
                background-image: none !important;
            }
            html.ldb-bgfullscreen #app {
                background: transparent !important;
            }
        `;
        document.head.appendChild(styleEl);

        forceMainTransparent();
    }

    function applyAdBlock() {
        const styleId = 'ldb-adblock-style';
        const old = document.getElementById(styleId);
        if (old) old.remove();
        if (!adBlock) return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `.side div[data-v-ce0b4304] { display: none !important; }`;
        document.head.appendChild(style);
    }

    function startAdBlockObserver() {
        if (adBlockObserver) return;
        adBlockObserver = new MutationObserver(() => {
            applyAdBlock();
        });
        adBlockObserver.observe(document.body, { childList: true, subtree: true });
    }

    function applyCustomCSS() {
        const old = document.getElementById('ldb-custom-style');
        if (old) old.remove();
        if (!customCSS || customCSS.trim() === '') return;
        const style = document.createElement('style');
        style.id = 'ldb-custom-style';
        style.textContent = customCSS;
        document.head.appendChild(style);
    }

    function cleanBackground() {
        document.querySelectorAll('.theme-page').forEach(el => {
            if (el.classList.contains('theme-frosted')) {
                el.classList.remove('theme-frosted');
            }
        });
    }

    function ensureObserverCreated() {
        if (bgCleanObserver) return;
        bgCleanObserver = new MutationObserver(() => {
            cleanBackground();
        });
    }

    function toggleBackgroundCleaner() {
        ensureObserverCreated();
        cleanBackground();
        if (!isObserving) {
            bgCleanObserver.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });
            isObserving = true;
        }
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

    function applyAll() {
        applyRounded();
        applyCardOpacity();
        applyCardBlur();
        applyBgFullscreen();
        applyAdBlock();
        applyCustomCSS();
        toggleBackgroundCleaner();
        updatePanelStyle();
    }

    function saveAndApply(key, value) {
        localStorage.setItem(key, value);
        initVarible();
        applyAll();
    }

    let panelCreated = false;
    let panelElement = null;

    function createPanel() {
        if (panelCreated) return;
        panelCreated = true;

        const panelHTML = `
            <div id="ldb-panel" class="l-card hidden">
                <button id="ldb-panel-close" aria-label="关闭">×</button>
                <h2>插件设置</h2>
                <h3>卡片模糊度</h3>
                <p>
                    <input id="ldb-panel-blur" type="range" min="0" max="30" value="${blurValue != null ? blurValue : 10}" />
                    <span id="blur-value">${blurValue != null ? blurValue : 10}px</span>
                </p>
                <h3>卡片不透明度</h3>
                <p>
                    <input id="ldb-panel-opacity" type="range" min="0" max="100" value="${opacityValue != null ? opacityValue : 75}" />
                    <span id="opacity-value">${opacityValue != null ? opacityValue : 75}%</span>
                </p>
                <h3>卡片圆角曲度</h3>
                <p>
                    <input id="ldb-panel-rounded-card" type="range" min="0" max="30" value="${cardborderRad != null ? cardborderRad : 15}" />
                    <span id="rounded-value-card">${cardborderRad != null ? cardborderRad : 15}px</span>
                </p>
                <h3>图片圆角曲度</h3>
                <p>
                    <input id="ldb-panel-rounded-pic" type="range" min="0" max="16" value="${picborderRad != null ? picborderRad : 8}" />
                    <span id="rounded-value-pic">${picborderRad != null ? picborderRad : 8}px</span>
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
                <p>
                    <textarea id="ldb-panel-customCSS">${customCSS}</textarea>
                </p>
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
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = panelHTML;
        panelElement = container.firstElementChild;
        document.body.appendChild(panelElement);

        const css = `
            #ldb-panel {
                position: fixed !important;
                right: 35px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                padding: 28px 24px 24px !important;
                background: rgba(255, 255, 255, ${(opacityValue != null ? opacityValue : 75) / 100}) !important;
                backdrop-filter: blur(${blurValue != null ? blurValue : 10}px) !important;
                -webkit-backdrop-filter: blur(${blurValue != null ? blurValue : 10}px) !important;
                border-radius: 24px !important;
                box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
                color: #1e1e2f !important;
                transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease !important;
                z-index: 2147483000 !important;
                box-sizing: border-box !important;
                width: min(400px, 50vw) !important;
                max-width: calc(100vw - 70px) !important;
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
                transition: background 0.2s, transform 0.2s !important;
            }
            #ldb-panel-close:hover  { background: #e04345 !important; transform: scale(1.06) !important; }
            #ldb-panel-close:active { transform: scale(0.92) !important; }

            #ldb-panel h2 { margin: 0 0 16px 0 !important; font-size: 22px !important;
                            font-weight: 600 !important; color: #2c3e50 !important;
                            line-height: 1.3 !important; }
            #ldb-panel h3 { margin: 18px 0 6px 0 !important; font-size: 15px !important;
                            font-weight: 500 !important; color: #34495e !important;
                            line-height: 1.3 !important; }

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
                width: 16px !important; height: 16px !important;
                border-radius: 50% !important; background: #000 !important;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2) !important;
                cursor: pointer !important;
            }

            #ldb-panel-customCSS {
                width: 100% !important;
                min-height: 60px !important;
                max-height: 200px !important;
                padding: 6px 8px !important;
                font-family: monospace !important;
                font-size: 13px !important;
                resize: vertical !important;
                border: 1px solid #ccc !important;
                border-radius: 4px !important;
                box-sizing: border-box !important;
                line-height: 1.4 !important;
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
                transition: border-color 0.2s, box-shadow 0.2s !important;
            }
            #ldb-panel-updateChannel:hover {
                border-color: #999 !important;
            }
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
                transition: background 0.2s, transform 0.1s !important;
            }
            #ldb-panel-checkUpdate:hover  { background: #333 !important; }
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
                transition: background 0.2s, transform 0.1s !important;
            }
            #ldb-panel-reset:hover  { background: #d5dbe0 !important; }
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
            #ldb-panel #ldb-updateStatus:empty {
                display: none !important;
                margin: 0 !important;
            }

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
            }
        `;
        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);

        const cardroundedSlider = document.getElementById('ldb-panel-rounded-card');
        const cardroundedDisplay = document.getElementById('rounded-value-card');
        const picroundedSlider = document.getElementById('ldb-panel-rounded-pic');
        const picroundedDisplay = document.getElementById('rounded-value-pic');
        const closeBtn = document.getElementById('ldb-panel-close');
        const blurSlider = document.getElementById('ldb-panel-blur');
        const blurDisplay = document.getElementById('blur-value');
        const opacitySlider = document.getElementById('ldb-panel-opacity');
        const opacityDisplay = document.getElementById('opacity-value');
        const cardRoundedCb = document.getElementById('ldb-panel-card-rounded');
        const picRoundedCb = document.getElementById('ldb-panel-pic-rounded');
        const bgFullscreenCb = document.getElementById('ldb-panel-bgfullscreen');
        const adBlockCb = document.getElementById('ldb-panel-adblock');
        const customCssInput = document.getElementById('ldb-panel-customCSS');
        const updateChannelSelect = document.getElementById('ldb-panel-updateChannel');
        const checkUpdateBtn = document.getElementById('ldb-panel-checkUpdate');
        const updateStatus = document.getElementById('ldb-updateStatus');
        const resetBtn = document.getElementById('ldb-panel-reset');

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

        customCssInput.addEventListener('input', function() {
            customCSS = this.value;
            saveAndApply("LuoguDisplayBetter-customCSS", this.value);
        });

        updateChannelSelect.addEventListener('change', function() {
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
            localStorage.setItem("LuoguDisplayBetter-cardborderRad", 15);
            localStorage.setItem("LuoguDisplayBetter-picborderRad", 8);
            localStorage.setItem("LuoguDisplayBetter-blur", 10);
            localStorage.setItem("LuoguDisplayBetter-cardRounded", true);
            localStorage.setItem("LuoguDisplayBetter-picRounded", true);
            localStorage.setItem("LuoguDisplayBetter-adBlock", false);
            localStorage.setItem("LuoguDisplayBetter-bgFullscreen", true);
            localStorage.setItem("LuoguDisplayBetter-opacity", 75);
            localStorage.setItem("LuoguDisplayBetter-customCSS", '');
            localStorage.setItem("LuoguDisplayBetter-updateChannel", 'stable');
            initVarible();
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
            customCssInput.value = '';
            updateChannelSelect.value = 'stable';
            updateStatus.textContent = '';
            applyAll();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !panelElement.classList.contains('hidden')) {
                panelElement.classList.add('hidden');
            }
        });
    }

    function checkForUpdate(statusEl) {
        if (statusEl._ldbTimer) {
            clearTimeout(statusEl._ldbTimer);
            statusEl._ldbTimer = null;
        }
        const url = UPDATE_URLS[updateChannel];
        if (!url) {
            statusEl.textContent = '未知通道';
            return;
        }
        statusEl.textContent = '检查中...';
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Cache-Control': 'no-cache'
            },
            onload: function(response) {
                if (response.status !== 200) {
                    statusEl.textContent = '获取失败 (' + response.status + ')';
                    return;
                }
                const match = response.responseText.match(/\/\/\s*@version\s+([\d.]+)/);
                if (!match) {
                    statusEl.textContent = '无法解析版本';
                    return;
                }
                const remoteVersion = match[1];
                const localVersion = GM_info.script.version;
                if (compareVersions(remoteVersion, localVersion) > 0) {
                    statusEl.innerHTML = '发现新版本 v' + remoteVersion + '，' +
                        '<a href="' + url + '" target="_blank" style="color:#0d6efd;text-decoration:underline;cursor:pointer;">点击安装</a>';
                } else {
                    statusEl.textContent = '已是最新版本 v' + localVersion;
                    statusEl._ldbTimer = setTimeout(function() {
                        statusEl.textContent = '';
                        statusEl._ldbTimer = null;
                    }, 2000);
                }
            },
            onerror: function() {
                statusEl.textContent = '网络请求失败';
            },
            ontimeout: function() {
                statusEl.textContent = '请求超时';
            },
            timeout: 10000
        });
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

    function togglePanel() {
        if (!panelElement) return;
        panelElement.classList.toggle('hidden');
    }

    function addCustomButton() {
        if (document.querySelector(`.sidebar.lside.bar.hide.nav-scrollbar`)) {
            const ul = document.querySelector('.nav-group.on-expand ul[data-v-a119941e]');
            if (!ul) return;
            if (ul.querySelector(`#stylePluginSettingButton`)) return;
            const sampleLi = ul.querySelector('li');
            if (!sampleLi) return;
            const newLi = document.createElement('li');
            for (const attr of sampleLi.attributes) {
                if (attr.name.startsWith('data-v-')) {
                    newLi.setAttribute(attr.name, attr.value);
                }
            }
            newLi.setAttribute('title', '美化插件设置');
            const newA = document.createElement('a');
            const sampleA = sampleLi.querySelector('a');
            if (sampleA) {
                for (const attr of sampleA.attributes) {
                    if (attr.name.startsWith('data-v-')) {
                        newA.setAttribute(attr.name, attr.value);
                    }
                }
                newA.className = sampleA.className;
                newA.setAttribute('disabled', sampleA.getAttribute('disabled') || 'false');
            }
            newA.href = 'javascript:void(0);';
            newA.id = 'stylePluginSettingButton';
            const span = document.createElement('span');
            const sampleSpan = sampleLi.querySelector('span.title');
            if (sampleSpan) {
                for (const attr of sampleSpan.attributes) {
                    if (attr.name.startsWith('data-v-')) {
                        span.setAttribute(attr.name, attr.value);
                    }
                }
                span.className = sampleSpan.className;
            }
            span.textContent = '美化插件设置';
            newA.appendChild(document.createComment(''));
            newA.appendChild(span);
            newLi.appendChild(newA);
            newA.addEventListener('click', function(event) {
                event.preventDefault();
                togglePanel();
            });
            ul.appendChild(newLi);
            return;
        }

        const appsContainer = document.querySelector('.apps');
        if (!appsContainer) return;
        if (appsContainer.querySelector(`#stylePluginSettingButton`)) return;
        const sample = appsContainer.querySelector('a');
        if (!sample) return;
        const newLink = document.createElement('a');
        for (const attr of sample.attributes) {
            if (attr.name.startsWith('data-v-')) {
                newLink.setAttribute(attr.name, attr.value);
            }
        }
        newLink.setAttribute('colorscheme', sample.getAttribute('colorscheme') || 'none');
        newLink.className = sample.className;
        newLink.href = 'javascript:void(0);';
        newLink.innerText = '美化插件设置';
        newLink.id = 'stylePluginSettingButton';
        newLink.addEventListener('click', function(event) {
            event.preventDefault();
            togglePanel();
        });
        appsContainer.appendChild(newLink);
    }

    let mainDomDebounce = null;
    function scheduleMainDomWork() {
        if (mainDomDebounce) return;
        mainDomDebounce = setTimeout(() => {
            mainDomDebounce = null;
            addCustomButton();
            if (bgFullscreen) forceMainTransparent();
        }, 300);
    }

    function init() {
        const firstUsed = localStorage.getItem("LuoguDisplayBetter-FirstUsed") == null;
        if (firstUsed) {
            localStorage.setItem("LuoguDisplayBetter-FirstUsed", false);
            localStorage.setItem("LuoguDisplayBetter-cardborderRad", 15);
            localStorage.setItem("LuoguDisplayBetter-picborderRad", 8);
            localStorage.setItem("LuoguDisplayBetter-blur", 10);
            localStorage.setItem("LuoguDisplayBetter-cardRounded", true);
            localStorage.setItem("LuoguDisplayBetter-picRounded", true);
            localStorage.setItem("LuoguDisplayBetter-adBlock", false);
            localStorage.setItem("LuoguDisplayBetter-bgFullscreen", true);
            localStorage.setItem("LuoguDisplayBetter-opacity", 75);
            localStorage.setItem("LuoguDisplayBetter-customCSS", '');
            localStorage.setItem("LuoguDisplayBetter-updateChannel", 'stable');
        }
        initVarible();
        createPanel();
        if (firstUsed) togglePanel();
        addCustomButton();
        startAdBlockObserver();
        applyAll();
        const observer = new MutationObserver(() => {
            scheduleMainDomWork();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
