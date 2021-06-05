const UPGRADES = {
    1: {
        img: "1.png",
        desc: "Double {curr}/click.",
        cost: new Decimal(10),
        shown: ({ curr }) => curr.gte(10)
    },
    2: {
        img: "2.png",
        desc: "Boost {other} gain based on {curr}, if you have more {curr} than {other}",
        cost: new Decimal(20),
        shown: ({ currN }) => game.upgrades[`1-${currN}`]
    },
    3: {
        img: "3.png",
        desc: "Make the diminishing returns for {curr} a little less harsh..",
        cost: new Decimal(25),
        shown: ({ curr, currN }) => game.upgrades[`1-${currN}`] && curr.gte(20)
    },
    4: {
        img: "4.png",
        desc: "Generate a static 1 {curr} per second, no matter how much you already have.",
        cost: new Decimal(30),
        shown: ({ curr, currN }) => game.upgrades[`2-${currN}`] && curr.gte(30)
    },
    5: {
        img: "5.png",
        desc: "Increase {curr} per second gain based on {other}, but it's affected by diminishing returns.",
        cost: new Decimal(50),
        shown: ({ currN }) => game.upgrades[`4-${currN}`]
    },
    6: {
        img: "6.png",
        desc: "Make the diminishing returns for {curr} even less harsh.",
        cost: new Decimal(125),
        shown: ({ currN }) => game.upgrades[`3-${currN}`]
    },
    7: {
        img: "7.png",
        desc: "Make the diminishing returns for {curr} weaker based on total bought upgrades.",
        cost: new Decimal(200),
        shown: ({ currN }) => game.upgrades[`6-${currN}`]
    },
    8: {
        img: "8.png",
        desc: "Gain a static 2x multiplier for all production of {curr}.",
        cost: new Decimal(250),
        shown: ({ curr }) => curr.gte(200)
    },
    9: {
        img: "9.png",
        desc: "Decrease the diminishing returns for {curr} based on how much {other} you have.",
        cost: new Decimal(300),
        shown: ({ currN }) => game.upgrades[`7-${currN}`]
    },
    10: {
        img: "10.png",
        desc: "Clicks are 10x as powerful, post-softcap.",
        cost: new Decimal(600),
        shown: ({ currN, curr }) => game.upgrades[`1-${currN}`] && curr.gte(100)
    },
    11: {
        img: "11.png",
        desc: "You no longer lose the non-dominant currency on the yang bar.",
        cost: new Decimal(1e8),
        shown: () => game.yinAdvancements >= 3,
        darknessOnly: true,
    },
    12: {
        img: "12.png",
        desc: "Click each \"More\" button one time each second.",
        cost: new Decimal(1e10),
        shown: () => game.yinAdvancements >= 3,
        lightOnly: true,
    },
    13: {
        img: "13.png",
        desc: "Make the middle of the yang bar give white/black.",
        cost: new Decimal(2.5e14),
        shown: () => game.upgrades["11-darkness"],
        darknessOnly: true,
    },
    14: {
        img: "14.png",
        desc: "Click each \"More\" button ten times each second.",
        cost: new Decimal(5e15),
        shown: () => game.upgrades["12-light"],
        lightOnly: true,
    },
    15: {
        img: "15.png",
        desc: "Make the yin effect hardcap appear 2,500x later.",
        cost: new Decimal(1e17),
        shown: () => game.upgrades["12-light"],
        lightOnly: true,
    },
    16: {
        img: "16.png",
        desc: "Unlock something new.",
        cost: new Decimal(1e20),
        shown: () => game.upgrades["15-light"],
        darknessOnly: true,
    },
    prestige: {
        img: "prestige.png",
        desc: "Reset everything, but get some {pres} in return. Currently: {pgain}",
        cost: "1000+",
        shown: ({ curr }) => curr.gte(1000)
    }
};

function buyUpg(id, isDark = false) {
    const curr = isDark ? "darkness" : "light";
    if (game[curr].lt(UPGRADES[id].cost)) return;
    if (id === "prestige") {
        prestige(isDark ? "yang" : "yin");
        return;
    }
    game[curr] = game[curr].sub(UPGRADES[id].cost);
    game.upgrades[`${id}-${curr}`] = true;
    app.tooltipShown = false;
}