# 简体中文语言层（运行时覆盖层 · 路线 O）

给 Cavernous II 加一层中文，**不改游戏源码**，上游更新时唯一的冲突点是 `index.html` 里新增的 6 行 `<script>`。

## 为什么走路线 O

- 游戏原本没有任何 i18n 系统（全仓库 `i18n / t(" / locale` 零命中），无法「补齐语言包」。
- 文本硬编码在 `src/script/*.ts`，并且大量由运行时的 `innerHTML` 拼装。
- 该仓库是他人创作的增量游戏，且仍在更新；源码级汉化会在每次上游提交时产生大范围冲突。

所以：**词典 + 模板 + 长文块** 三层在运行时翻译 DOM。

## 文件与加载顺序

```
localization/
├── i18n.js            引擎（必须最后加载）
├── zh-CN.ui.js        静态界面、设置项、按钮、提示
├── zh-CN.data.js      属性 / 物资 / 生物 / 界域 / 地点类型
├── zh-CN.messages.js  消息标题
├── zh-CN.patterns.js  有序正则模板（动态数字、占位符替换后的句子）
└── zh-CN.blocks.js    被 <br> 拆散的长文（剧情消息），整块替换
```

`index.html` 中按上述顺序追加（位于 `dist/script/test.js` 之后）：

```html
<script type="text/javascript" defer src="localization/zh-CN.ui.js"></script>
<script type="text/javascript" defer src="localization/zh-CN.data.js"></script>
<script type="text/javascript" defer src="localization/zh-CN.messages.js"></script>
<script type="text/javascript" defer src="localization/zh-CN.patterns.js"></script>
<script type="text/javascript" defer src="localization/zh-CN.blocks.js"></script>
<script type="text/javascript" defer src="localization/i18n.js"></script>
```

## 引擎行为

1. **命中顺序**：精确词典 → 有序正则模板（具体 → 宽泛，兜底在末尾）→ 长文块键。
2. **归一化**：词条与运行时文本都做「空白折叠 + 首尾裁剪」，所以词条可以随便换行排版，页面上 `\n`、`\t` 不影响命中。
3. **幂等**：已含中文的字符串直接跳过；自己写回 DOM 不会触发二次翻译。
4. **补翻时机**：`MutationObserver` 回调里**同步** flush（微任务内），不会闪一帧英文；另有 `load`、`visibilitychange` 与 700ms 轮询兜底。
5. **保护**：`SCRIPT/STYLE/TEXTAREA/CODE/PRE/SVG` 内的文本、`[data-i18n-skip]` 子树、长于 4000 字的文本节点都不动。
6. **语言开关总闸**：`en` 模式下引擎完全不写 DOM，逐字保持上游原样。
7. **属性通道**：除 `title / placeholder / alt / aria-label` 外，还翻译 `data-content`（地图格子 `td::before{content:attr(data-content)}` 的提示）与 `data-name`（时间轴悬停提示）——这两处文本不在 DOM 里，只扫文本节点会漏。
8. **原生弹窗**：`window.alert / confirm / prompt` 在中文模式启动时包装，先把消息 `tr()` 一遍再交给浏览器。
9. **CSS 单位**：时间轴提示的「ms」由 CSS `content` 拼接，改不到源码，用注入 `<style>` 覆盖成「毫秒」。

## 中英切换

- 入口在游戏内 **配置（Config）面板顶部**：`语言 / Language: 中文 · 点击切换`。
- 状态存在 `localStorage['cavernous2_i18n_lang']`，默认 `zh`，与存档键隔离。
- 切换方式为写 localStorage + `location.reload()`，零残留。

## 新增词条的三种方式

| 情况 | 写在哪 | 例子 |
|---|---|---|
| 整串固定文本 | `zh-CN.ui.js` / `zh-CN.data.js` / `zh-CN.messages.js` | `"Options": "选项"` |
| 句中有数字或占位符被替换过 | `zh-CN.patterns.js` | `/^An anvil on which you can make a bridge out of ([0-9.,]+) iron bars?\.$/` |
| 正文被 `<br>` 拆成多个文本节点 | `zh-CN.blocks.js`（键 = 空白折叠后的 textContent） | 剧情消息 |

模板回调签名是 `fn(整条匹配, g1, g2, ...)`，因为引擎用 `fn.apply(null, execResult)`；**第一个参数是整串**，不是 `m[0]` 数组。

## 自查命令

```bash
node work/cdp.mjs      # 无头 Edge 打开 index.html，输出标题/词典量/残留英文清单，并截图
```

判定标准：`residual` 里只剩品牌名（PayPal / Discord）与自带拉丁字母的中文串（Ctrl / Tab 等按键名）。

三条自查脚本：

| 脚本 | 用途 |
|---|---|
| `node work/cdp-audit.mjs` | **数据驱动兜底**：64 种地点类型 × 4 界域 = 256 条描述按游戏自身占位符规则渲染后逐行校验（其中包含 `{STATS}` / `{MANA_PER_GOLD}` / `{'0':..}` 三种占位符），外加 4 界域 × 8 区域 = 32 张地图全格 viewCell + 悬停 + 属性、配置、日志、40 条消息 |
| `node work/cdp-static.mjs` | **静态字面量审计**：把 `dist/script/*.js` 里所有字符串字面量（`${}` 替换成样例值）过一遍 `tr()`，凡未译出的一律列出——不依赖任何游戏状态，能抓到只在特定存档状态下才出现的文本 |
| `node work/cdp-mixed.mjs` | 反向查「中文句里混着英文词」（白名单：按键名、品牌、生长公式变量 t、罗马数字） |
| `node work/cdp-final.mjs` | 端到端：残局存档加载 + 语言开关往返 + 截图 |

## 跟版步骤

1. `git -C upstream pull`（本目录是稀疏克隆，只有 `incremental/CavernousII`）。
2. `git diff` 看 `index.html` 是否冲突——正常情况下只有那 6 行脚本。
3. 跑自查命令，把新出现的英文串按上表三种方式补词条。
4. 上游若改了既有英文串，旧词条自然失配 → 落到残留清单里，逐条更新即可，不会污染源码。

## 已知限制

- 地图本体是字符网格（`█ ♣ ♠` 等），不参与翻译；图例文字已翻译。
- 少数数字单位（如 `0s`）由多个节点拼成，单位已在词条里单独处理。
- 尚未覆盖后期内容（区域 2–7、符文升级描述、界域切换文案），需要残局存档驱动采集后补词条。
