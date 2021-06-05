let game = {
	light: new Decimal(0),
	darkness: new Decimal(0),
	yin: new Decimal(0),
	yang: new Decimal(0),
	upgrades: {},
	lastFrame: Date.now(),
	yinAdvancements: 0,
	yangPos: 2,
	white: new Decimal(0),
	black: new Decimal(0),
	hideYinEffects: false,
};

const defaultGame = { ...game }

function getDiminishingReturn(curr) {
	let otherCurr = (curr === "darkness" ? "light" : "darkness")

	let diminishingReturn = new Decimal(1.10);
	if (game.upgrades[`3-${curr}`]) diminishingReturn = diminishingReturn.sub(.025)
	if (game.upgrades[`6-${curr}`]) diminishingReturn = diminishingReturn.sub(.025)
	if (game.upgrades[`7-${curr}`]) diminishingReturn = diminishingReturn.sub(Math.min(.001 * Object.keys(game.upgrades).length, 0.015))
	if (game.upgrades[`9-${curr}`]) diminishingReturn = diminishingReturn.sub(game[otherCurr].add(2).slog().min(0.015))
	// if (game[curr].gte(1e6)) diminishingReturn = diminishingReturn.add(.075)
	return diminishingReturn.max(1)
}

function getStaticMult(curr) {
	let out = new Decimal(1);
	if (game.upgrades[`8-${curr}`]) out = out.mul(2);
	out = out.mul(getYinBoost())
	out = out.mul(getSideMult(curr === "light" ? "white" : "black"))
	out = out.mul(bigBoost);
	return out;
}

function moreCurr(curr, isClone = false) {
	if (game.yinAdvancements >= 2 && !isClone) moreCurr(curr === "light" ? "darkness" : "light", true)
	let toAdd = new Decimal(1);
	if (game.upgrades[`1-${curr}`]) toAdd = toAdd.mul(2)

	let dR = getDiminishingReturn(curr)
	toAdd = toAdd.div(dR.pow(game[curr]))

	if (game.upgrades["2-darkness"] && curr === "light" && game.darkness.gte(game.light)) toAdd = toAdd.add(game.darkness.add(1).log10())
	if (game.upgrades["2-light"] && curr === "darkness" && game.light.gte(game.darkness)) toAdd = toAdd.add(game.light.add(1).log10())

	if (game.upgrades[`10-${curr}`]) toAdd = toAdd.mul(10)

	game[curr] = game[curr].add(toAdd.mul(getStaticMult(curr)));
}

const app = new Vue({
	el: "#app",
	data: {
		format,
		game,
		moreCurr,
		UPGRADES,
		tooltipCoords: [0, 0],
		tooltipShown: false,
		showTooltip,
		hideTooltip,
		buyUpg,
		save,
		noSaveLOL,
		bUpsOpen: false,
		getYinBoost,
		yinAdvancements,
		shiftYang,
		getSideProd,
		getSideMult,
		optionsOpen: false,
		exportGame,
		importGame,
		goGrey,
	},
});

let isRight = false

function showTooltip(id, right, overrideReverse = false) {
	const curr = right ? "darkness" : "light"
	app.tooltipNode = UPGRADES[id];
	app.tooltipShown = `${
		app.tooltipNode.desc
			.replace(/\{curr\}/gumi, curr)
			.replace(/\{other\}/gumi, right ? "light" : "darkness")
			.replace(/\{pres\}/gumi, right ? "yang" : "yin")
			.replace(/\{pgain\}/gumi, format(getPrestigeGain(right ? "yang" : "yin")))
	}<br>
Cost: ${format(app.tooltipNode.cost)} ${curr}`;
	isRight = right && !overrideReverse;
}

function hideTooltip(id) {
	app.tooltipShown = false;
}

window.addEventListener("mousemove", e => {
	app.tooltipCoords = [e.clientX - (isRight ? 350 : 0), e.clientY];
});

function tickCurr(curr, diff) {
	diff = new Decimal(diff);
	if (game.upgrades[`5-${curr}`]) {
		let toAdd = new Decimal(game[curr === "light" ? "darkness" : "light"]);
		const dR = getDiminishingReturn(curr)
		toAdd = toAdd.div(dR.pow(game[curr]))
		game[curr] = game[curr].add(toAdd.mul(getStaticMult(curr)));
	} else if (game.upgrades[`4-${curr}`]) game[curr] = game[curr].add(diff.mul(getStaticMult(curr)));
}

function tickYangBar(diff) {
	game.white = game.white.add(getSideProd(true).mul(diff));
	game.black = game.black.add(getSideProd().mul(diff));
	if (game.white.lt(-10)) game.white = new Decimal(-10)
	if (game.black.lt(-10)) game.black = new Decimal(-10)
}

let lastClick = 0;

function getClickInterval() {
	if (game.upgrades["14-light"]) return 100;
	if (game.upgrades["12-light"]) return 1000;
	return Infinity;
}

function doLoop() {
	const diff = (Date.now() - game.lastFrame) / 1000;
	game.lastFrame = Date.now();
	lastClick += diff * 1000;
	if (lastClick >= getClickInterval()) {
		moreCurr("light")
		lastClick = 0;
	}
	tickCurr("light", diff);
	tickCurr("darkness", diff);
	if (game.yang.gt(0)) tickYangBar(diff);

	if (game.yinAdvancements >= 1) {
		for (const upg in UPGRADES) {
			if (upg === "prestige") continue;
			if (UPGRADES[upg].shown({ curr: game.light, currN: "light" }) && !game.upgrades[`${upg}-light`] && !UPGRADES[upg].darknessOnly) buyUpg(upg)
			if (UPGRADES[upg].shown({ curr: game.darkness, currN: "darkness" }) && !game.upgrades[`${upg}-darkness`] && !UPGRADES[upg].lightOnly) buyUpg(upg, true)
		}
	}

	window.requestAnimationFrame(doLoop)
}

window.requestAnimationFrame(doLoop);

window.setInterval(save, 10000)

if (localStorage.getItem("yhvr-balancething-save")) load();