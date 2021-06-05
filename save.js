function save() {
    localStorage.setItem("yhvr-balancething-save", JSON.stringify(game));
    localStorage.setItem("yhvr-balancething-boost", JSON.stringify(bigBoost));
}

function load() {
    let out = JSON.parse(localStorage.getItem("yhvr-balancething-save"));
    out.light = new Decimal(out.light);
    out.darkness = new Decimal(out.darkness);
    out.yin = new Decimal(out.yin);
    out.yang = new Decimal(out.yang);
    out.white = new Decimal(out.white);
    out.black = new Decimal(out.black);
    for (const key in out) {
        game[key] = out[key];
    }

    if (localStorage.getItem("yhvr-balancething-boost")) bigBoost = JSON.parse(localStorage.getItem("yhvr-balancething-boost"))
}

function noSaveLOL(isEnd = false, resetBoost = true, nerfBoost = false) {
    if (!confirm("Are ya sure?")) return;
    for (const key in defaultGame) {
        game[key] = defaultGame[key];
        app.game[key] = defaultGame[key];
    }

    if (resetBoost) bigBoost = 1;
    else if (nerfBoost) bigBoost /= 2;
    else if (isEnd) bigBoost *= 2;
    app.$forceUpdate();
    save();

    if (document.getElementById("goGrey")) document.getElementById("goGrey").remove()
}

function exportGame() {
    copyTextToClipboard(btoa(localStorage.getItem("yhvr-balancething-save")))
}

function importGame() {
    const save = prompt("import your exported save here:");
    try {
        let decoded = atob(save)
        localStorage.setItem("yhvr-balancething-save", decoded)
        load()
    } catch (e) {
        alert("oops, i don't think that's a valid save :(")
    }
}

// https://stackoverflow.com/a/30810322
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}
  