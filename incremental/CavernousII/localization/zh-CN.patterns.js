/* zh-CN pattern layer: ordered templates, specific -> generic. Must load after all dict files.
 * Callback signature: fn(wholeMatch, g1, g2, ...) because i18n.js applies fn to the exec array.
 * Keys/patterns run against whitespace-normalized text (i18n.js normalizes before lookup).
 */
(function () {
	var P = (window.I18N_PATTERNS = window.I18N_PATTERNS || []);
	function add(re, fn) {
		P.push({ re: re, fn: fn });
	}
	var NUM = "([0-9][0-9.,]*)";
	var ITEM = {
		"Iron Bar": "铁锭",
		"Iron Bars": "铁锭",
		"Steel Bar": "钢锭",
		"Steel Bars": "钢锭",
		"Gold Nugget": "金块",
		"Gold Nuggets": "金块",
		"Iron Ore": "铁矿",
		"Salt": "盐",
		"Coal": "煤",
		"Gem": "宝石",
		"Gems": "宝石",
		"Mana": "魔力",
		"Wood": "木材"
	};

	/* ---- creature descriptions: "<flavour text> Attack: A Defense: D Health: H" ---- */
	add(/^(.+?) Attack: ([0-9.,]+) Defense: ([0-9.,]+) Health: ([0-9.,]+)$/, function (m, flavour, atk, def, hp) {
		var head = (window.I18N_DICT && window.I18N_DICT[flavour]) || flavour;
		return head + " 攻击：" + atk + " 防御：" + def + " 生命：" + hp;
	});

	/* ---- anvils / enchanters with realm-dependent counts ---- */
	add(/^An anvil on which you can make a bridge out of ([0-9.,]+) iron bars?\. These pits are a bit wider than the others, so it'll take a bit longer to craft the bridge \(though your old ones still work for some reason\)\.$/, function (m, n) {
		return "一座铁砧，可用 " + n + " 块铁锭造一座长桥。这里的坑比别处宽一些，所以造桥会稍慢一点（不过旧桥不知为何仍然管用）。";
	});
	add(/^Water level: (.+)$/, function (m, v) {
		return "水位：" + v;
	});
	add(/^An anvil on which you can make a bridge out of ([0-9.,]+) iron bars?\.$/, function (m, n) {
		return "一座铁砧，可用 " + n + " 块铁锭造一座桥。";
	});
	add(/^An anvil on which you can make a sword out of ([0-9.,]+) iron bars?\.$/, function (m, n) {
		return "一座铁砧，可用 " + n + " 块铁锭打一把剑。";
	});
	add(/^An anvil on which you can make a shield out of ([0-9.,]+) iron bars?\.$/, function (m, n) {
		return "一座铁砧，可用 " + n + " 块铁锭打一面盾。";
	});
	add(/^An anvil on which you can make a suit of armour out of ([0-9.,]+) iron bars?\.$/, function (m, n) {
		return "一座铁砧，可用 " + n + " 块铁锭打一套甲。";
	});
	add(/^An anvil on which you can make an? (axe|pick|hammer) out of (an iron bar|[0-9.,]+ iron bars?)\.( This probably won't be useful to you for at least a few zones\.)?$/, function (m, kind, cost, tail) {
		var k = kind === "axe" ? "斧" : kind === "pick" ? "镐" : "锤";
		var c = cost === "an iron bar" ? "1 块铁锭" : cost.replace(/iron bars?/, "块铁锭").replace(" ", "");
		return "一座铁砧，可用 " + c + " 打一把" + k + "。" + (tail ? "这东西至少还要过几个区域才用得上。" : "");
	});
	add(/^An anvil on which you can upgrade an? iron (bridge|sword|shield) into a steel \1 using ([0-9.,]+) steel bars?\.$/, function (m, kind, n) {
		var k = kind === "bridge" ? "桥" : kind === "sword" ? "剑" : "盾";
		return "一座铁砧，可用 " + n + " 块钢锭把铁" + k + "升级为钢" + k + "。";
	});
	add(/^An anvil on which you can upgrade an? iron suit of armour into a steel suit of armour using ([0-9.,]+) steel bars?\.$/, function (m, n) {
		return "一座铁砧，可用 " + n + " 块钢锭把铁甲升级为钢甲。";
	});
	add(/^An anvil on which you can enchant a steel (sword|shield) using ([0-9.,]+) gems?\.$/, function (m, kind, n) {
		var k = kind === "sword" ? "剑" : "盾";
		return "一座铁砧，可用 " + n + " 颗宝石为钢" + k + "附魔。";
	});
	add(/^An anvil on which you can enchant a steel suit of armour using ([0-9.,]+) gems?\.$/, function (m, n) {
		return "一座铁砧，可用 " + n + " 颗宝石为钢甲附魔。";
	});

	/* ---- machine / mushroom flavour text with inline numbers ---- */
	add(/^A machine for extracting the magic right out of gold\. \(([0-9.eE+-]+) mana per gold\)$/, function (m, n) {
		return "一台把黄金里的魔力直接抽出来的机器。（每块黄金 " + n + " 魔力）";
	});
	add(/^A strange machine labelled '(.+?)'\. What could it do\?$/, function (m, label) {
		var map = { "Clone Machine": "分身机", "Rune Enhancer": "符文强化器", "Time Stretcher": "时间拉长器" };
		return "一台贴着“" + (map[label] || label) + "”标签的古怪机器。它能干什么？";
	});
	add(/^A giant mushroom which grows quickly\. It's harder to cut the longer you wait\. \(Growth: 1\+(.+)t\)$/, function (m, g) {
		return "一株生长迅速的巨型蘑菇。等得越久越难砍。（生长：1+" + g + "t）";
	});
	add(/^A giant mushroom which grows quickly\. It grows so fast each clone needs to make its own way every time\. \(Growth: 1\+(.+)t\)$/, function (m, g) {
		return "一株生长迅速的巨型蘑菇。它长得太快，每个分身每次都得自己重新开一条路。（生长：1+" + g + "t）";
	});
	add(/^A giant mushroom which grows quickly\. While you cut it, it lets out poisonous spores, injuring your clones cutting it for 1 damage per second\. \(Growth: 1\+(.+)t\)$/, function (m, g) {
		return "一株生长迅速的巨型蘑菇。你砍它时它会喷出毒孢子，对正在砍它的分身造成每秒 1 点伤害。（生长：1+" + g + "t）";
	});
	add(/^A giant mushroom which grows extremely quickly\. You don't think you've ever seen a mushroom grow that fast\. \(Growth: 1\+(.+)t\)$/, function (m, g) {
		return "一株生长极快的巨型蘑菇。你觉得你从没见过蘑菇长这么快。（生长：1+" + g + "t）";
	});
	add(/^A giant mushroom which grows quickly\. It seems to continually spray water\. \(Growth: 1\+(.+)t\)$/, function (m, g) {
		return "一株生长迅速的巨型蘑菇。它似乎一直在喷水。（生长：1+" + g + "t）";
	});
	add(/^A wall made of a strange energy that saps your mana\. Its duration does not compound\.$/, function () {
		return "一堵由奇异能量构成的墙，会吸走你的魔力。它的耗时不会累加。";
	});
	add(/^A wall made of a strange energy that saps your mana\.$/, function () {
		return "一堵由奇异能量构成的墙，会吸走你的魔力。";
	});

	/* ---- rune descriptions whose numbers move with upgrade count ---- */
	add(/^Mine more resources with this rune\. After placing it, interact with it to charge it up\. You'll receive \+([0-9.,]+) of each \(orthogonally or diagonally\) adjacent resource \(when mined\), though each rune placed in a zone costs twice as much to charge as the last\.$/, function (m, n) {
		return "这枚符文能让你采到更多资源。放下后与它交互即可充能。采矿时，每个正交或对角相邻的资源都会额外 +" + n + "，不过同一区域里每多放一枚符文，充能花费就翻一倍。";
	});
	add(/^This rune weakens any orthogonally adjacent enemies, +decreasing their attack and defense by 1\.$/, function () {
		return "这枚符文会削弱所有正交相邻的敌人，使其攻击与防御各降低 1。";
	});
	add(/^This rune allows you to kill even hardy orthogonally (or diagonally )?adjacent plants\. Interact with it to charge it up - it takes ?(.*?) ?as much Temporal to charge as the plants you're trying to kill would take to chop\.$/, function (m, diag, amount) {
		return "这枚符文能杀死哪怕最顽强的" + (diag ? "正交或对角" : "正交") + "相邻植物。与它交互即可充能 —— 充能所需的时间量，是你想杀的那些植物所需砍伐时间的 " + amount + "。";
	});
	add(/^This rune drains water from surrounding spaces\. It drains log_2\(Runic Lore\) \/ 25 water per second from its space and a quarter that from the 4 adjacent spaces\.$/, function () {
		return "这枚符文会抽干周围的水。它每秒从自身格抽走 log_2(符文知识) / 25 的水量，并从 4 个相邻格抽走其四分之一。";
	});
	add(/^This rune allows someone or something to come through from another place\. Only one can be placed, +and it must be charged after placement\. Use a pathfind action right after teleporting to fix the path prediction\.$/, function () {
		return "这枚符文能让某人或某物从别处穿过来。每个区域只能放一枚，且放下后必须充能。传送后紧跟一个寻路动作，即可修正路径预测。";
	});
	add(/^This rune allows someone to slip beyond to another place\. Interact with it after inscribing it to activate it\.$/, function () {
		return "这枚符文能让人溜到别处去。刻好之后与它交互即可激活。";
	});

	/* ---- stuff descriptions carrying a live percentage ---- */
	add(/^An iron axe\. Gives \+15 or \+15% to Woodcutting \(whichever is greater\), and applies 1% of your Woodcutting skill to combat \((.+?)%\)\.$/, function (m, pct) {
		return "一把铁斧。使伐木 +15 或 +15%（取较大者），并把你的伐木技能按 1% 计入战斗（" + pct + "%）。";
	});
	add(/^An iron pickaxe\. Gives \+15 or \+15% to Mining \(whichever is greater\), and applies 1% of your Mining skill to combat \((.+?)%\)\.$/, function (m, pct) {
		return "一把铁镐。使采矿 +15 或 +15%（取较大者），并把你的采矿技能按 1% 计入战斗（" + pct + "%）。";
	});
	add(/^An iron hammer\. Gives \+15 or \+15% to Smithing \(whichever is greater\), and applies 1% of your Smithing skill to combat \((.+?)%\)\.$/, function (m, pct) {
		return "一把铁锤。使锻造 +15 或 +15%（取较大者），并把你的锻造技能按 1% 计入战斗（" + pct + "%）。";
	});

	/* ---- stat tooltip: "<base sentence> (96.2%)" ---- */
	add(/^(.+?) \(([0-9][0-9.,]*%)\)$/, function (m, base, pct) {
		var api = window.__cavernousI18n;
		if (!api || !api.lookup) return null;
		var zh = api.lookup(base);
		if (!zh) return null;
		return zh + "（" + pct + "）";
	});
	add(/^(Attack|Defense|Health|Mana): undefined$/, function (m, name) {
		var n = (window.I18N_DICT && window.I18N_DICT[name]) || name;
		return n + "：—";
	});
	add(/^Increase at: (.+)$/, function (m, v) {
		return "增长速率：" + v;
	});
	add(/^Current: (.+?) \+ (.+)$/, function (m, a, b) {
		return "当前：" + a + " + " + b;
	});
	add(/^Time: (.+)s$/, function (m, v) {
		return "耗时：" + v + " 秒";
	});
	add(/^([0-9][0-9.,]*) cs$/, function (m, v) {
		return v + " 分身·秒";
	});
	/* ---- map tile tooltip: "<location type> <next cost>" ---- */
	add(/^(Mana-infused Rock|Mana Spring) (.+)$/, function (m, name, cost) {
		var api = window.__cavernousI18n;
		var n = (api && api.lookup && api.lookup(name)) || name;
		var c = (api && api.tr) ? api.tr(cost) : cost;
		return n + " " + c;
	});
	/* ---- stat panel: grind-route tooltip lines ---- */
	add(/^Click to load best grind route \(projected \+([0-9.,]+)\) in ([0-9.,]+)s$/, function (m, gain, time) {
		return "点击加载最佳刷取路线（预计 +" + gain + "），耗时 " + time + " 秒";
	});
	add(/^This route is in the (.+)\.$/, function (m, realm) {
		var api = window.__cavernousI18n;
		var name = api && api.lookup ? api.lookup(realm) : null;
		return "这条路线位于" + (name || realm) + "。";
	});
	add(/^Next: (.+)$/, function (m, v) {
		var api = window.__cavernousI18n;
		var inner = api && api.tr ? api.tr(v) : v;
		return "下一级：" + inner;
	});

	/* ---- stat / requirement / counter lines ---- */
	add(/^(Mana|Mining|Woodcutting|Magic|Speed|Smithing|Runic Lore|Combat|Gemcraft|Chronomancy|Attack|Defense|Health): ([0-9.,]+%?)$/, function (m, name, v) {
		var n = (window.I18N_DICT && window.I18N_DICT[name]) || name;
		return n + "：" + v;
	});
	add(new RegExp("^([0-9][0-9.,]*) (Iron Bars?|Steel Bars?|Gold Nuggets?|Iron Ore|Salt|Coal|Gems?|Mana)$"), function (m, n, item) {
		return n + " " + (ITEM[item] || item);
	});
	add(/^([0-9][0-9.,]*) gold nuggets, 1s$/, function (m, n) {
		return n + " 金块，1 秒";
	});
	add(/^Total multiplier: x(.+)$/, function (m, v) {
		return "总倍率：x" + v;
	});
	add(/^Stat slowdown start: (.+)$/, function (m, v) {
		return "属性放缓起点：" + v;
	});
	/* ---- grind-stats table: realm short names, "z1" column labels ---- */
	add(/^(Core|Long|Verdant|Compounding)$/, function (m, name) {
		var map = { Core: "核心", Long: "长时", Verdant: "苍翠", Compounding: "复利" };
		return map[name] || name;
	});
	add(/^z([0-9]+)$/, function (m, n) {
		return "区" + n;
	});
	add(/^Zone ([0-9]+)$/, function (m, n) {
		return "区域 " + n;
	});
	add(/^Route time: ([0-9.,]+)s$/, function (m, v) {
		return "路线耗时：" + v + " 秒";
	});
	add(/^Est\. mana left: ([0-9.,]+)s$/, function (m, v) {
		return "预计剩余魔力：" + v + " 秒";
	});
	add(/^Time spent: ([0-9.,]+)s$/, function (m, v) {
		return "已耗时：" + v + " 秒";
	});
	add(/^Zone time: ([0-9.,]+)s$/, function (m, v) {
		return "区域耗时：" + v + " 秒";
	});
	add(/^([0-9.,]+)s$/, function (m, v) {
		return v + " 秒";
	});
})();
