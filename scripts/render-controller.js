function RenderController() {
  const players = {
    o: document.querySelector('.player-info[data-player-side="o"]'),
    x: document.querySelector('.player-info[data-player-side="x"]'),
  };

  const gameContent = document.querySelector(".table-content");
  const table = document.querySelector(".table");
  const popUp = document.querySelector(".winner-pop-up");

  const ICON_CLASS = {
    x: "x-lg",
    o: "circle",
  };

  const initComponents = (players) => {
    document
      .querySelectorAll(".player-username")
      .forEach((el, i) => (el.innerHTML = (players && players[i]) || "Guest_"));

    toggleSide();
  };

  const resetGame = (side) => {
    document
      .querySelectorAll(".table .house")
      .forEach((_house) => (_house.innerHTML = ""));

    players["o"].classList.toggle("winner", false);
    players["x"].classList.toggle("winner", false);
    players["o"].classList.toggle("draw", false);
    players["x"].classList.toggle("draw", false);

    gameContent.classList.toggle("enable", true);
    gameContent.classList.toggle("disable", false);

    document.querySelectorAll(`.house.disable`).forEach((house) => {
      house.classList.toggle("disable", false);
    });

    toggleSide(side);
    popUp.classList.toggle("active", false);
  };

  const gameEnd = (side, player) => {
    gameContent.classList.toggle("enable", false);
    gameContent.classList.toggle("disable", true);

    if (side == "-") {
      players["o"].classList.add("draw");
      players["x"].classList.add("draw");

      return;
    }

    popUp.querySelector(".player-winner-name").innerHTML = player.username;

    popUp.classList.toggle("active", true);

    players[side].classList.add("winner");
  };

  const newLance = (x, y, currentSide, oldSide) => {
    const house = document.querySelector(
      `.house[data-position-x="${x}"][data-position-y="${y}"]`
    );

    if (!house) {
      return currentSide;
    }

    house.innerHTML = `<i class="icon bi-${ICON_CLASS[oldSide]} ${oldSide}"></i>`;

    house.classList.add("disable");

    toggleSide(currentSide);
  };

  const toggleSide = (side = "") => {
    players.o.classList.toggle("this-side", side == "o");
    players.x.classList.toggle("this-side", side == "x");
  };

  return {
    newLance,
    initComponents,
    resetGame,
    gameEnd,
  };
}
