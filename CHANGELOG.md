# 更新日志

## v1.5.0 — 2026-11-13

本次更新基于 `dev` 分支（v1.4.2）移植，保留 dev 的多镜像更新检查、全屏编辑器布局等改动。

### 深色模式支持

- 自动识别洛谷的深浅色模式：
  - `html[data-lcolor-theme="dark"]`；
  - `.lcolor-theme-dark`；
  - 并兼容 `color-scheme`。
- 卡片透明度背景改为读取洛谷主题变量：
  - 优先使用 `--theme-card-background`；
  - 回退到 `--lcolor--bg-container`；
  - 深色模式下不再出现「白色文字 + 白色半透明背景」。
- 深浅色切换时自动重新应用卡片透明度、全屏背景和设置面板样式，无需刷新页面。
- 背景全屏适配深色主题：
  - `.article-banner`、`.article-content`、`.toc` 改用洛谷深色变量；
  - 从 `#luogu-theme` 的 `lBody.image` / `dBody.image` 读取当前模式的背景图。
- 插件设置面板支持深色：
  - 面板背景、标题、标签、滑块、复选框、下拉框、按钮、链接、状态提示；
  - 自定义 CSS 文本框增加深色文字、边框、占位符和焦点样式。
- 设置面板透明度/模糊改为 CSS 变量更新，修复 `!important` 导致滑块调整不生效的问题。

### 侧边栏入口修复

- 移除对固定 Vue scope 选择器 `ul[data-v-a119941e]` 的依赖，改用 `nav.lside` / `nav.sidebar` 定位侧边栏。
- 不再把入口放进 `.on-expand` 分组，避免侧边栏未悬停时被隐藏。
- 为「美化插件设置」入口添加设置图标，侧边栏收起时仍然可见。
- 路由切换或 Vue 重新渲染后，会自动重新插入入口按钮。

### 版本

- 用户脚本版本号更新为 `1.5.0`。

### 验证

- `node --check LuoguDisplayBetter.user.js`
- `git diff --check`
- 使用无头 Firefox 验证深色/浅色切换下的卡片、文章横幅、文章内容、目录、设置面板、侧边栏按钮和全屏背景图配色。

### 修改文件

- `LuoguDisplayBetter.user.js`
- `CHANGELOG.md`
