/* Cavernous II - runtime i18n overlay (route O, no game-source edits)
 * Layer order: exact dict -> ordered patterns -> block keys.
 * Load order in index.html: zh-CN.ui.js / zh-CN.data.js / zh-CN.messages.js / zh-CN.patterns.js / zh-CN.blocks.js / i18n.js
 * Toggle row lives in the in-game Config panel; state in localStorage['cavernous2_i18n_lang'] ('zh' default | 'en').
 */
(function () {
	"use strict";
	var LANG_KEY = "cavernous2_i18n_lang";
	var lang = localStorage.getItem(LANG_KEY) || "zh";
	var D = window.I18N_DICT || {};
	var P = window.I18N_PATTERNS || [];
	var B = window.I18N_BLOCKS || {};
	var LATIN = /[A-Za-z]/;
	var HAN = /[\u3400-\u9fff\uff01-\uff60\u3000-\u303f]/;
	var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, PRE: 1, SVG: 1 };
	var BLOCK_SELECTOR = "#message-text,.message-text,#location-description,.description,#loop-stats,#loop-log-wrapper";
	var applying = false;
	var N = null;

	function norm(s) {
		return String(s).replace(/\s+/g, " ").trim();
	}

	function normalizedDict() {
		if (N) return N;
		N = {};
		for (var k in D) {
			if (!Object.prototype.hasOwnProperty.call(D, k)) continue;
			var nk = norm(k);
			if (!Object.prototype.hasOwnProperty.call(N, nk)) N[nk] = D[k];
		}
		return N;
	}

	function coreLookup(core) {
		var nd = normalizedDict();
		if (Object.prototype.hasOwnProperty.call(nd, core)) return nd[core];
		for (var i = 0; i < P.length; i++) {
			var m = null;
			try {
				m = P[i].re.exec(core);
			} catch (e) {
				continue;
			}
			if (m) {
				try {
					var v = P[i].fn.apply(null, m);
					if (v != null && v !== "") return v;
				} catch (e2) {}
			}
		}
		return null;
	}

	function tr(s) {
		if (typeof s !== "string" || !s) return s;
		if (!LATIN.test(s)) return s;
		if (HAN.test(s)) return s;
		var lead = /^\s*/.exec(s)[0];
		var trail = /\s*$/.exec(s)[0];
		var core = norm(s.slice(lead.length, s.length - trail.length));
		if (!core || !LATIN.test(core)) return s;
		var hit = coreLookup(core);
		if (hit == null) return s;
		return lead + hit + trail;
	}

	function skipNode(node) {
		var p = node.parentNode;
		if (!p) return true;
		if (SKIP[p.nodeName]) return true;
		if (p.closest && p.closest("[data-i18n-skip]")) return true;
		return false;
	}

	function scanBlocks(root) {
		if (!Object.keys(B).length) return;
		var els = (root || document.body).querySelectorAll(BLOCK_SELECTOR);
		for (var i = 0; i < els.length; i++) {
			var el = els[i];
			if (el.getAttribute("data-i18n-done") === "1") continue;
			if (el.querySelector("button,input,select,textarea,[onclick]")) continue;
			var key = norm(el.textContent || "");
			if (key.length < 40) continue;
			var zh = B[key];
			if (zh == null) continue;
			el.innerHTML = zh;
			el.setAttribute("data-i18n-done", "1");
		}
	}

	function flush(root) {
		if (lang !== "zh" || applying) return;
		applying = true;
		try {
			var scope = root || document.body;
			if (!scope) return;
			scanBlocks(scope);
			var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null);
			var nodes = [];
			var n;
			while ((n = walker.nextNode())) nodes.push(n);
			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				var v = node.nodeValue;
				if (!v || v.length > 4000) continue;
				if (skipNode(node)) continue;
				var out = tr(v);
				if (out !== v && out != null) node.nodeValue = out;
			}
			// display-bearing attributes: title/placeholder/alt/aria-label plus the two CSS-driven ones
			// (map tile tooltip uses td::before{content:attr(data-content)}, timeline tooltip uses attr(data-name))
			var attrs = ["title", "placeholder", "alt", "aria-label", "data-content", "data-name"];
			var tagged = scope.querySelectorAll("[title],[placeholder],[alt],[aria-label],[data-content],[data-name]");
			for (var j = 0; j < tagged.length; j++) {
				for (var a = 0; a < attrs.length; a++) {
					var cur = tagged[j].getAttribute(attrs[a]);
					if (!cur) continue;
					var nv = tr(cur);
					if (nv !== cur) tagged[j].setAttribute(attrs[a], nv);
				}
			}
			if (document.title) {
				var dt = tr(document.title);
				if (dt !== document.title) document.title = dt;
			}
		} finally {
			applying = false;
		}
	}

	/** native dialogs are outside the DOM, so translate their message before the browser shows it */
	function hookDialogs() {
		if (window.__i18nDialogsHooked) return;
		window.__i18nDialogsHooked = true;
		var rawAlert = window.alert;
		var rawConfirm = window.confirm;
		var rawPrompt = window.prompt;
		window.alert = function (msg) {
			return rawAlert.call(window, tr(String(msg)));
		};
		window.confirm = function (msg) {
			return rawConfirm.call(window, tr(String(msg)));
		};
		window.prompt = function (msg, def) {
			return rawPrompt.call(window, tr(String(msg)), def);
		};
	}

	function injectStyle(css) {
		if (document.getElementById("i18n-style")) return;
		var style = document.createElement("style");
		style.id = "i18n-style";
		style.textContent = css;
		(document.head || document.documentElement).appendChild(style);
	}

	function installLangRow() {
		var box = document.querySelector("#config-wrapper") || document.querySelector("#config-box");
		if (!box) return false;
		if (box.querySelector("#i18n-lang-row")) return true;
		var row = document.createElement("div");
		row.id = "i18n-lang-row";
		row.className = "option block clickable";
		row.setAttribute("data-i18n-skip", "1");
		row.style.cursor = "pointer";
		row.innerHTML =
			"语言 / Language: <b>" + (lang === "zh" ? "中文" : "English") + "</b> · 点击切换 / click to switch";
		row.addEventListener("click", function (e) {
			e.stopPropagation();
			localStorage.setItem(LANG_KEY, lang === "zh" ? "en" : "zh");
			location.reload();
		});
		box.insertBefore(row, box.firstChild);
		return true;
	}

	function boot() {
		installLangRow();
		window.__cavernousI18n = {
			lang: lang,
			tr: tr,
			flush: function () {
				return flush(document.body);
			},
			dict: D,
			patterns: P,
			blocks: B,
			/** exact (normalized) dictionary hit only - used by patterns that wrap a base sentence */
			lookup: function (s) {
				var nd = normalizedDict();
				var k = norm(s);
				return Object.prototype.hasOwnProperty.call(nd, k) ? nd[k] : null;
			},
			/** translate an arbitrary string (used by harvest/verification tooling) */
			t: function (s) {
				return tr(s);
			}
		};
		if (lang !== "zh") return;
		hookDialogs();
		flush(document.body);
		var obs = new MutationObserver(function () {
			flush(document.body);
		});
		obs.observe(document.body, { childList: true, subtree: true, characterData: true });
		window.addEventListener("load", function () {
			installLangRow();
			flush(document.body);
		});
		document.addEventListener("visibilitychange", function () {
			if (!document.hidden) flush(document.body);
		});
		setInterval(function () {
			if (document.hidden) return;
			installLangRow();
			flush(document.body);
		}, 700);
		// CSS tooltips are generated by content: attr(...) rules we cannot edit upstream; override the unit text only.
		injectStyle(
			".timeline:not(#loop-actions) > div:hover::after{content:attr(data-name) '\\a' attr(data-time) ' 毫秒';}" +
				".timeline:not(#loop-actions) > div:last-child:hover::after{content:attr(data-name) '\\a' attr(data-time) ' 毫秒';}"
		);
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
	else boot();
})();
