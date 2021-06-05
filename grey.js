let bigBoost = 1;

function goGrey() {
    const el = document.createElement("div");
    el.style.backgroundColor = "#888";
    el.id = "goGrey";
    el.style.position = "absolute";
    el.style.width = "100vw";
    el.style.height = "100vh";
    el.style.top = 0;
    el.style.left = 0;
    el.style.zIndex = 1000;
    el.style.textAlign = "center";
    el.style.color = "white";
    el.innerHTML = `
        <div class="boughtUpgs" id="goGreyContainer">
            <h1>Well, that's it!</h1>
            <p>
                Thank you for playing.<br>
                It's a bit shorten than I would have preferred, but I hope you still enjoyed it!<br>
                If you'd like, you can restart the game with a 2x boost to production.<br>
                You can also just restart without any boost, the choice is yours!
            </p>
            <button onclick="noSaveLOL(true)">HARD RESET</button>, <button onclick="noSaveLOL(true, false)">Reset with boost</button>, or <button onclick="noSaveLOL(true, false, true)">Reset with nerf</button><br><br>
            <p>Made by Yhvr for Jacorb Server 6,000 members mini-game-jam, with testing from epicness1582 and unpogged.</p>
            <a href="https://yhvr.me/">My Homepage</a> | <a href="https://yhvr.me/ego/">My Discord Server</a> | <a href="http://discord.gg/wwQfgPa">Jacorb's Discord Server</a>
        </div>
    `
    document.body.appendChild(el);
}
