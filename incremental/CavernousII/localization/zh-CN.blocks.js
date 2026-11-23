/* zh-CN block layer: long <br>-split bodies that must be replaced as a whole.
 * Key = whitespace-normalized textContent of the English element.
 */
(function () {
	var B = (window.I18N_BLOCKS = window.I18N_BLOCKS || {});
	function add(en, zh) {
		B[en.replace(/\s+/g, " ").trim()] = zh;
	}
	var LIST = [
	[
		"You wake up in a bare room. One of the walls looks soft enough for you to dig through, but you have a feeling you'll be back here again. Move around with arrow keys - try going right! You can click on a tile to view its description. Click anywhere to continue.",
		"你在一间空荡荡的房间里醒来。其中一面墙看起来软到能挖穿，但你总觉得你还会回到这里。<br><br>用<u>方向键</u>移动 —— 试试往右走！<br>点击任意格子即可查看它的描述。<br><br>点击任意处继续。"
	],
	[
		"That wall was surprisingly easy to dig through. It only took 1 second! It looks like 1 mana drained away while you did it, though. You wonder what will happen when you run out of mana.",
		"那堵墙意外地好挖，只花了 1 秒！不过看来你挖的时候漏掉了 1 点魔力。你开始好奇魔力耗尽后会怎样。"
	],
	[
		"As your mana runs out you freeze in place, and feel a tugging on your spirit to draw you back to where you started. (Click \"Travel back in time\" or press the R key to reset)",
		"魔力见底，你僵在原地，感到灵魄被一股力量往起点拽回去。<br><br>（点击「回到过去」或按 <u>R</u> 键即可重置）"
	],
	[
		"The actions you input are remembered below the map and will repeat each loop. Use backspace to clear the actions before resetting if you want to try something different.",
		"你输入的动作会记在地图下方，每次循环都会重复。<br>想换个玩法，就在重置前用退格键把动作清掉。"
	],
	[
		"There are many mana rocks, but the shortest path is always the best one. Check the Options panel for the Auto-Grind to automatically select the fastest path",
		"魔力岩石很多，但最短的那条路永远是最好的。<br><br>去<u>选项</u>面板看看<u>自动刷取</u>，它可以自动选出最快的路线。"
	],
	[
		"Have you found the Vaporizer yet? Interacting with it will turn your gold into mana! You can probably mine those rocks a few additional times with that.",
		"你找到汽化器了吗？与它交互就能把黄金变成魔力！<br>有了它，那些岩石大概还能再多采几次。"
	],
	[
		"There is a log of your actions this loop, which will help you plan out your routes better. (\"Loop Log\", on the left) Mousing over an action there will give you a breakdown of which stats affect that action.",
		"游戏会记录你这一轮的所有动作，能帮你更好地规划路线（左侧的「循环日志」）。<br>把鼠标停在某个动作上，就能看到哪些属性在影响它。"
	],
	[
		"Time seems to be a bit unstable. How many of you must there be before you escape the final zone?",
		"时间似乎有点不稳。到底要有多少个你，才能逃出最后的区域？"
	],
	[
		"What you thought was a strange statue in the passage suddenly moves to attack you as you approach! This place is stranger than you'd thought.",
		"你原以为是通道里的一座怪雕像，走近时它却突然动起来攻击你！这地方比你想的更古怪。"
	],
	[
		"You worked so hard on that bridge, and to see it quickly turn to slag after crossing that lava is sad. At least one of your clones made it across.",
		"你辛辛苦苦造的那座桥，刚跨过岩浆就化成一滩渣，真让人心痛。<br>至少有一个分身过去了。"
	],
	[
		"You've unlocked a rune! The Wither rune kills plants next to it. After placing it, interact with it to charge it up and kill orthogonally adjacent plants.",
		"你解锁了一枚符文！<br>凋零符文会杀死紧邻它的植物。放下后与它交互即可充能，杀掉正交相邻的植物。"
	],
	[
		"You've unlocked a rune! Well, two runes. You can place one To rune per zone, and any number of From runes. Activating any From rune teleports you to the To rune.",
		"你解锁了一枚符文！嗯，是两枚。<br>每个区域可以放一枚「至」符文，以及任意多枚「离」符文。激活任意「离」符文都会把你传送到「至」符文处。"
	],
	[
		"You've unlocked a rune! A pump rune costs a steel bar and 3 iron bars and drains the water from the 4 surrounding spaces. It's pricy, but it'll keep you from drowning.",
		"你解锁了一枚符文！<br>抽水符文需要 1 块钢锭和 3 块铁锭，能抽干周围 4 格的水。是有点贵，但能让你不被淹死。"
	],
	[
		"In the Compounding Realm, you feel like you're moving through molasses. Each time you move, subsequent actions will take 2.5% longer. However, mining mana there will increase your ability to learn past 100.",
		"在复利界域里，你感觉自己像在糖浆里移动。<br>每次移动，之后每个动作的耗时会多 2.5%。<br>不过在那里采魔力，能让你突破 100 的学习上限。"
	],
	[
		"You've upgraded the Wither rune! Wither now affects all diagonally adjacent plants as well as orthogonally adjacent plants. Further upgrades will double its potency each time.",
		"你升级了凋零符文！<br>凋零现在不仅能作用于正交相邻的植物，也能作用于对角相邻的植物。之后的每次升级都会让威力再翻一倍。"
	],
	[
		"You've upgraded the Wither rune again! Wither now takes half as long to complete. There's one more upgrade for Wither available, which will halve the time required again.",
		"你又升级了凋零符文！<br>凋零的完成时间缩短了一半。凋零还有最后一次升级，会让所需时间再减半。"
	],
	[
		"You've unlocked the first of the time barriers! There's one in each zone, behind which is a mana rock. However, breaching a time barrier causes the zone to leech 5 of your mana per second.",
		"你解锁了第一道时间屏障！<br>每个区域都有一道，后面藏着魔力岩石。但突破时间屏障会让该区域每秒吸取你 5 点魔力。"
	],
	[
		"You've learned all that you can in the Verdant Realm. You no longer have access to it - but wither runes no longer cost any gold.",
		"你已学尽苍翠界域的一切。你不再能进入那里了 —— 不过凋零符文从此不再消耗黄金。"
	],
	[
		"You've beaten the game! There may be, in the future, further updates to this game. It is highly likely, however, that those updates will be in the form of Cavernous III. Thanks for playing!",
		"你通关了！<br>这个游戏未来可能还会有更新。<br>不过，那些更新极有可能以《循环洞穴 III》的形式出现。<br>感谢游玩！"
	]
];
	for (var i = 0; i < LIST.length; i++) add(LIST[i][0], LIST[i][1]);
})();
