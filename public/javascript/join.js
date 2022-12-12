const table = document.querySelector("#game-table");
const discard = document.querySelector("#discard");
const drawPile = document.querySelector(".draw-pile .card.special");

const updateDiscard = (
  { id, type, color } = { id: -1, type: 0, color: "special" }
) => {
  const div = document.createElement("div");
  div.classList.add("card", `card-${type}`, `${color}`);
  div.dataset.cardId = id;

  discard.replaceChildren(div);
};

const getPlayerDiv = (seat, username, avatar, playerSeat, totalPlayers) => {
  const div = table.querySelector(`.player-${seat}`);

  if (div === null) {
    const container = document.createElement("div");
    container.classList.add("player", `player-${seat}`);

    if (playerSeat === seat) {
      container.classList.add("player-current");

    } else {
      container.classList.add(
        `player-minus-${(playerSeat + seat) % totalPlayers}`
      );
    }

    const playerName = document.createElement("div");
    playerName.classList.add("username");
    container.appendChild(playerName);

    const userAvatar = document.createElement("img");
    userAvatar.setAttribute("src", `/images/avatar.png`);
    userAvatar.setAttribute("style", `width:20%`);
    userAvatar.setAttribute("alt", username);
    userAvatar.setAttribute("title", username);
    playerName.appendChild(userAvatar);

    const hand = document.createElement("div");
    hand.classList.add("hand");
    container.appendChild(hand);

    table.appendChild(container);
    return container;
  } else {
    return div;
  }
};

const getPlayerCardDiv = (
  seat,
  username,
  avatar,
  playerSeat,
  totalPlayers,
  current
) => {
  const container = getPlayerDiv(
    seat,
    username,
    avatar,
    playerSeat,
    totalPlayers
  );

  if (current) {
    container.classList.add("player-taking-turn");

  } else if (container.classList.contains("player-taking-turn")) {
    container.classList.remove("player-taking-turn");
  }

  return container.querySelector(".hand");
};

const handleDraw = () => {
  fetch(`${window.location.pathname}/draw`, { method: "post" });
};

const updatePlayer = (
  player_id,
  player_seat,
  { id, username, avatar, current, seat, card_count },
  hand,
  isMyTurn,
  totalPlayers
) => {
  const div = getPlayerCardDiv(
    seat,
    username,
    avatar,
    player_seat,
    totalPlayers,
    current
  );

  if (id === player_id) {
    div.replaceChildren(
      ...hand.map((card) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card", `card-${card.type}`, `${card.color}`);

        if (isMyTurn) {
          cardDiv.addEventListener("click", () => {
            fetch(`${window.location.pathname}/play`, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ card_id: card.id }),
            }).catch(() => {
              /* no-op*/
            });
          });
        }

        return cardDiv;
      })
    );
  } else {
    const cards = document.createDocumentFragment();
    const cardBack = document.createElement("div");
    cardBack.classList.add("card", "special");

    for (let i = 0; i < card_count; i++) {
      cards.appendChild(cardBack.cloneNode(true));
    }

    div.replaceChildren(...Array.from(cards.childNodes));
  }
};

const updateGame = (data) => {
  const { player_id, players, isMyTurn, hand, discard } = data;

  if (!table.classList.contains(`player-count-${players.length}`)) {
    table.classList.add(`player-count-${players.length}`);
  }

  updateDiscard(discard);

  if (isMyTurn) {
    drawPile.addEventListener("click", handleDraw);
  } else {
    drawPile.removeEventListener("click", handleDraw);
  }

  const player_seat = players.find((player) => player.id === player_id).seat;

  players.forEach((player) =>
    updatePlayer(player_id, player_seat, player, hand, isMyTurn, players.length)
  );
};

fetch(window.location.pathname, { method: "post" })
  .then((r) => r.json())
  .then(({ game_id }) => {
    socket.on(`game:${game_id}:player-joined`, ({ count, required_count }) => {
      document.querySelector("span.current-count").innerHTML = count;

      if (count === required_count) {
        document.querySelector("p#waiting").classList.add("hidden");
        document.querySelector("#game-table").classList.remove("hidden");
        document
          .querySelector("#game-table")
          .classList.add(`player-count-${count}`);
      }
    });

    socket.on(`game:${game_id}:update`, updateGame);
  })
  .then(() => {
    fetch(`${window.location.pathname}/status`, { method: "post" });
  });

document.getElementById("passturn").addEventListener("click", () => {
  const gameId = window.location.pathname.split("/")[2]
  fetch(`/games/${gameId}/skipTurn`, { method: "post" })
})
