// type: "yin"|"yang"
function prestige(type) {
    const curr = game[type === "yin" ? "light" : "darkness"];
    let gain = getPrestigeGain(type);
    // for some reason
    if (gain.lt(1)) return;
    game.light = new Decimal(0);
    game.darkness = new Decimal(0);
    if (game.yinAdvancements < 4) game.upgrades = {};
    game.white = new Decimal(0);
    game.black = new Decimal(0);
    game[type] = game[type].add(gain);
    hideTooltip();
    app.$forceUpdate();

    if (type === "yin" && game.yin.gte(yinAdvancements[game.yinAdvancements])) game.yinAdvancements++;
}

function getPrestigeGain(type) {
    let out = game[type === "yin" ? "light" : "darkness"].div(1e3).sqrt();
    if (out.gte(500)) out = out.sub(500).pow(0.5).add(500);
    return out.floor();
}

function getYinBoost() {
    let out = new Decimal(2).pow(game.yin.sqrt());
    if (out.gte(1e3)) out = out.sub(1e3).pow(0.5).add(1e3)
    if (out.gte(1e10) && !game.upgrades["15-light"]) return new Decimal(1e10);
    if (out.gte(2.5e13)) return new Decimal(2.5e13)
    return out;
}

function shiftYang(left = false) {
    if (left && game.yangPos > 0) game.yangPos--;
    else if (game.yangPos < 4 && !left) game.yangPos++;
}

const baseProd = {
    [-2]: () => game.upgrades["11-darkness"] ? new Decimal(0) : new Decimal(-1),
    [-1]: () => game.upgrades["11-darkness"] ? new Decimal(0) : new Decimal(-0.1),
    0: () => game.upgrades["13-darkness"] ? new Decimal(10) : new Decimal(0),
    1: () => new Decimal(0.5),
    2: () => new Decimal(4)
};

function getSideProdMult() {
    return new Decimal(2).pow(game.yang.sub(1).sqrt());
}

function getSideProd(left = false) {
    if (left) {
        return baseProd[2 - game.yangPos]().mul(getSideProdMult())
    } else {
        return baseProd[game.yangPos - 2]().mul(getSideProdMult())    
    }
}

// "white" | "black"
function getSideMult(type) {
    return game[type].max(-2.5).add(5).log(5);
}

const yinAdvancements = [5, 10, 1000, 10000, Infinity].map(n => new Decimal(n))
