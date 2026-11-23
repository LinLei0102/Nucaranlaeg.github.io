# 循环洞穴 II（Cavernous II）· 简体中文汉化

本目录是 [Nucaranlaeg](https://github.com/Nucaranlaeg) 的增量游戏 **Cavernous II** 的简体中文语言层。
中文层以**运行时覆盖层**实现，不改动游戏源码：src/、dist/ 与上游逐字一致。

- 上游镜像：https://github.com/LinLei0102/Nucaranlaeg.github.io
- 汉化基线 commit：2d232135a9450bf984ad40c2e9a298ca6cb3e2b0
- 汉化目录：localization/（机制见 [localization/README.md](localization/README.md)，术语见 [localization/glossary.md](localization/glossary.md)）

## 直接开玩

1. 用浏览器打开 index.html（默认中文）。
2. 想对照英文：打开游戏内 **配置（Config）** 面板，点最上方的「语言 / Language: 中文」，页面会刷新为英文；再点一次切回中文。
3. 需要看后期内容：打开 [save/import.html](save/import.html)，点「导入残局存档」，再点出现的链接进入游戏（地址带 ?save=zhdemo，使用专用存档位，不影响你自己的存档）。

## 本次汉化包含

- 界面：选项面板、配置面板、地图/地点面板、动作栏、队列、循环日志、消息框
- 数据：13 项属性、24 种物资、63 种地点类型、6 种生物、4 个界域、6 枚符文
- 文本：40 条消息（标题 + 全部正文）、存档/导入导出提示、全部悬浮说明与按键说明

## 改词条 / 跟上游

- 所有译文集中在 localization/zh-CN.*.js：整句走词典，含动态数字的走 zh-CN.patterns.js，被 <br> 拆散的长文走 zh-CN.blocks.js。
- 词条键是**归一化空白后的英文原文**，所以排版可以随意换行。
- 上游更新时，index.html 的冲突点只有 6 行 <script>；新增英文串会自然回退英文，补词条即可，不需改源码。
- 验收：在工作区根目录执行 node work/cdp-final.mjs，会输出词典量、模板量、残留英文清单与截图。

## 残局存档

- 文件：[save/endgame-2.7.13.json](save/endgame-2.7.13.json)（meta + 原始存档串）、[save/import.html](save/import.html)（离线导入页）
- 存档位：saveGameII_zhdemo（专用；已存在会先备份到 saveGameII_zhdemo_backup）
- 撤销：游戏页控制台执行 localStorage.removeItem("saveGameII_zhdemo")
- 主存档 saveGameII 从不读写，你的进度安全。

## 在线部署（GitHub Pages）

仓库已包含部署到 GitHub Pages 的全部材料：

- 根目录 `index.html`：自动跳转到 `incremental/CavernousII/`
- 根目录 `.nojekyll`：关闭 Jekyll，静态文件原样发布
- `.github/workflows/pages.yml`：推送 `master` 或手动触发即构建并发布

**首次启用只需一次设置**（仓库当前 `has_pages: false`，所以工作流会在 Configure Pages 步骤失败）：

1. 打开 <https://github.com/LinLei0102/Nucaranlaeg.github.io/settings/pages>
2. Build and deployment → Source 选 **GitHub Actions**
3. 回到 <https://github.com/LinLei0102/Nucaranlaeg.github.io/actions> 重新运行 `Deploy GitHub Pages`（或再推一次 commit）

发布后的地址：

- 站点根：<https://linlei0102.github.io/Nucaranlaeg.github.io/>
- 游戏：<https://linlei0102.github.io/Nucaranlaeg.github.io/incremental/CavernousII/>
- 残局存档导入页：<https://linlei0102.github.io/Nucaranlaeg.github.io/incremental/CavernousII/save/import.html>

> 如果偏好「分支部署」：Source 选 *Deploy from a branch* → `master` / `/(root)`，无需工作流也会发布。

## 许可与致谢

- 游戏本体与全部美术、文案版权归原作者 **Nucaranlaeg** 所有，许可见 [../LICENSE.md](../LICENSE.md)。
- 本汉化层仅新增 localization/ 与 save/ 两个目录，并在 index.html 追加 6 行脚本引用，不含任何上游版权素材。
- 汉化方式：运行时覆盖层（路线 O）。
