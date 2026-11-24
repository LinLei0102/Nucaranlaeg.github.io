# 汉化验收报告 · 循环洞穴 II（Cavernous II）

- **上游**：https://github.com/LinLei0102/Nucaranlaeg.github.io
- **基线 commit**：`2d232135a9450bf984ad40c2e9a298ca6cb3e2b0`（稀疏克隆，仅 `incremental/CavernousII`）
- **页面版本**：2.7.13（`package.json` 2.2.8）
- **路线**：**O 运行时覆盖层**（游戏无 i18n 系统 + 上游持续更新 + 文本硬编码在 TS 并大量由 `innerHTML` 拼装）

## 交付物

| 路径 | 说明 |
|---|---|
| `localization/i18n.js` | 覆盖层引擎（精确词典 → 有序模板 → 长文块；MutationObserver 微任务补翻） |
| `localization/zh-CN.ui.js` | 界面 / 设置 / 按钮 / 提示 |
| `localization/zh-CN.data.js` | 属性 / 物资 / 生物 / 界域 / 地点类型 |
| `localization/zh-CN.messages.js` | 消息标题 + 全部消息正文段落（`<br>` 拆分后按段翻译） |
| `localization/zh-CN.patterns.js` | 47 条有序模板（动态数字、占位符替换后的句子、`(96.2%)` 后缀） |
| `localization/zh-CN.blocks.js` | 19 段整块长文（`innerHTML` 整体替换） |
| `localization/README.md` | 机制说明 / 加词条方式 / 跟版步骤 |
| `localization/glossary.md` | 术语表（不译清单 + 统一表 + 标点规范） |
| `save/endgame-2.7.13.json` | 残局存档（meta + 原始 LZString 串） |
| `save/import.html` | 离线导入页（内联存档，双击可用） |
| `README.zh-CN.md` | 汉化说明（含原版信息与致谢） |

改动面：`index.html` 新增 6 行 `<script>`；新增 `localization/`、`save/`；**源码目录零改动**。

## 覆盖量

| 指标 | 数值 |
|---|---|
| 精确词典条目 | **603** |
| 正则模板 | **53** |
| 静态字面量审计 | `dist/script/*.js` 共 345 条候选字面量，未译出 86 条，逐类登记为：占位符模板（渲染后由 patterns 处理）、开发期错误串（`No xxx found` / `throw new Error`）、测试脚手架（`Running test 1 of 1` / `Assertion Failure`） |
| 长文块 | **19** |
| 已翻译消息 | **40 条**（标题 + 全部正文段落） |
| 已翻译地点类型 | **63**（含蘑菇系变体与附魔/铁砧系） |

## 验证（无头 Edge + CDP，非肉眼）

| 项 | 结果 |
|---|---|
| 符文描述 | 6 枚符文 × 4 个升级等级，按 `rune.description()` 实际渲染后逐行校验（这类文本只在符文 tooltip 出现，普通面板扫描摸不到） |
| 扫描范围 | **4 界域 × 8 区域 = 32 张地图全格** viewCell + mouseenter + 属性；**64 种地点类型 × 4 界域 = 256 条描述**（按游戏自身占位符规则渲染后逐行校验）；配置面板、循环日志、消息列表、40 条消息正文 |
| 残留英文 | **0**（白名单仅 PayPal、Discord） |
| 中文句内混排英文 | 14 处，全部为设计内：语言开关的 Language、按键名（CTRL / Tab）、蘑菇生长公式的变量 t、罗马数字标题 III |
| 页面标题 | 循环洞穴 II（暂停时 循环洞穴 II - 已暂停） |
| 语言开关 | 配置面板首位，状态存 localStorage['cavernous2_i18n_lang'] |
| 中文 → 英文 | 标题与正文逐字回到上游原样，全文零汉字，引擎完全惰性 |
| 英文 → 中文 | 恢复完整译文，存档与解锁状态不丢 |
| 残局存档导入 | 写入 saveGameII_zhdemo，游戏识别 8 区域 / 4 界域 / 6 符文 3 级 |
| 主存档隔离 | 写入前放入哨兵值 SENTINEL-MAIN，导入后与游戏运行后仍为原值 |

## 展示面清单（含 CSS/原生通道）

| 文本通道 | 处理方式 | 验证 |
|---|---|---|
| DOM 文本节点 | 逐节点替换 | 全量扫描 |
| title / placeholder / alt / aria-label | 属性替换 | 全量扫描 |
| **地图格子提示** `td::before{content:attr(data-content)}` | **新增属性翻译通道**（此前的漏网之鱼） | 悬停截图 + 属性扫描 |
| 时间轴提示 `content:attr(data-name)"\a"attr(data-time)` | data-name 走属性翻译；单位「ms」用注入 CSS 覆盖为「毫秒」 | 注入样式检查 |
| `content:attr(data-count)` | 纯数字，无需翻译 | — |
| 原生 alert / confirm / prompt | 启动时包装，先 tr() 再交给浏览器 | 钩子生效断言 |
| document.title | 每轮 flush 重写 | 标题断言 |
| canvas / 字符网格 | 本作地图是 DOM 表格，无 fillText；字符符号不译 | 无需处理 |

## 采集方法论（踩过的坑）

1. **不能只设 `displayZone` 就扫**：`drawMap()` 在 `isDrawn === true` 时不会重建表格，直接改 `displayZone` 会把区域 1 的 DOM 当作区域 2–8 扫 8 遍 —— 会得到假的「残留 0」。正确做法是 `isDrawn = false; drawMap()`，或走 `zones[i].node.onclick()`。
2. **未进入过的区域没有 mapLocations**，格子上没有 `data-content`，提示类文本永远扫不到。采集前用 `z.getMapLocation(x - xOffset, y - yOffset, true)` 把所有格子实例化。
3. **可见文本只是样本**：吸气后的魔力泉（`*`）、蓄水格、蘑菇系变体都要靠状态才能出现。为了不依赖状态，audit 直接拿 `locationTypes` 的 `description` 按游戏自身的占位符规则（`{STATS}` / `{MANA_PER_GOLD}` / `{'0':..}`）渲染，再逐行校验 —— 这是**数据驱动**的兜底，256 条组合全覆盖。
4. **生成式 CSS 文本**（`content: attr(data-content)`）与原生弹窗不产生文本节点，必须单独开通道。
5. **状态门控的面板要主动调渲染函数**：`Expected completions` 表（`updateGrindStats()`）只在有刷取路线时才画，审计不主动调用就永远看不到表头的 `Core` / 行标 `z1` / 表尾 `Total`。同类还有 `displayLogs()`。
6. **只按「整串无汉字」筛残留会漏掉混排**：本轮实际漏过「下一级：1.00s」这类中文句式里带英文单位的行。验收要多一遍「含汉字且含英文词」的反向扫描，白名单只放按键名 / 品牌 / 数学变量。

## 红线自查

- [x] 原版基线已记录（commit + MD5 + 时间），见 work/baseline.md
- [x] 只改展示文本：ID、class、资源路径、字符网格、按键名一律不动
- [x] 格式符号保留：{}、{STATS}、{'0':..}、<u>、<br> 结构在译文中保持可用
- [x] 补翻在 MutationObserver 微任务内同步执行，不闪英文
- [x] 幂等：含中文即跳过，自身写回不触发二次翻译
- [x] 引擎总闸：en 模式不写 DOM
- [x] 术语表先行；译文并列用顿号、冒号用全角
- [x] 不以肉眼验收：残留计数、toggle 往返、存档端到端均有数字

## 已知限制

- 地图本体是字符网格（█ ♣ ♠ ⎶），不参与翻译；图例文字已翻译。
- PayPal / Discord 保持原文（品牌与外链）。
- 单个拉丁字母的键位提示（W、Q、Tab 等）保持原文，属操作说明的一部分。
- 上游若新增字符串，未命中会自然回退英文并出现在残留清单里，按 localization/README.md 的三条路径补词条即可。

## 跟版流程

1. git -C upstream pull → git diff 确认 index.html 只有那 6 行脚本。
2. node work/cdp-harvest.mjs 重新采集，看残留清单。
3. 按「精确词条 / 模板 / 长文块」三类补进对应文件。
4. 重跑 node work/cdp-final.mjs，残留回到 0 再发布。
