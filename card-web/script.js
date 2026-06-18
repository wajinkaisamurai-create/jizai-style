const spreadRoles = [
  {
    title: "捨てるもの",
    role: "今、手放す・距離を置くテーマ",
  },
  {
    title: "育てるもの",
    role: "今後、育てる・残していくテーマ",
  },
  {
    title: "進むために意識すること",
    role: "次に進むための視点・意識",
  },
];

const state = {
  cards: [],
  deck: [],
  mode: "single",
  isShuffled: false,
};

const cardArea = document.querySelector("#cardArea");
const statusText = document.querySelector("#statusText");
const shuffleButton = document.querySelector("#shuffleButton");
const drawButton = document.querySelector("#drawButton");
const modeButtons = document.querySelectorAll(".mode-button");

function shuffle(cards) {
  const result = [...cards];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function setStatus(message) {
  statusText.textContent = message;
}

function clearCards() {
  cardArea.className = "card-area is-empty";
  cardArea.innerHTML = `
    <div class="deck-placeholder" aria-hidden="true">
      <div class="deck-card"></div>
      <div class="deck-card"></div>
      <div class="deck-card"></div>
    </div>
  `;
}

function formatNumber(number) {
  return String(number).padStart(2, "0");
}

function createCard(card) {
  const article = document.createElement("article");
  article.className = "tarot-card";
  article.innerHTML = `
    <div class="card-number">${formatNumber(card.number)}</div>
    <div class="card-main">
      <h2 class="card-name">${card.name}</h2>
      <div class="card-keyword">${card.keyword}</div>
      <p class="card-message">${card.message}</p>
    </div>
    <div class="card-meta">
      <span>${card.kabbalah}</span>
      <span>${card.kabbalahKeyword}</span>
    </div>
  `;
  return article;
}

function renderSingle(card) {
  cardArea.className = "card-area";
  cardArea.innerHTML = "";
  cardArea.append(createCard(card));
}

function renderThree(cards) {
  cardArea.className = "card-area is-three";
  cardArea.innerHTML = "";

  cards.forEach((card, index) => {
    const slot = document.createElement("section");
    slot.className = "spread-slot";
    slot.innerHTML = `
      <div class="spread-label">
        <strong>${spreadRoles[index].title}</strong>
        <span>${spreadRoles[index].role}</span>
      </div>
    `;
    slot.append(createCard(card));
    cardArea.append(slot);
  });
}

function setMode(mode) {
  state.mode = mode;
  state.isShuffled = false;
  state.deck = [];
  drawButton.disabled = true;
  clearCards();
  setStatus("シャッフルしてください。");

  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
}

function handleShuffle() {
  if (!state.cards.length) return;

  state.deck = shuffle(state.cards);
  state.isShuffled = true;
  drawButton.disabled = false;
  clearCards();
  cardArea.classList.add("is-shuffling");
  setStatus("シャッフルしました。");

  window.setTimeout(() => {
    cardArea.classList.remove("is-shuffling");
  }, 560);
}

function handleDraw() {
  if (!state.isShuffled) {
    setStatus("先にシャッフルしてください。");
    return;
  }

  const count = state.mode === "three" ? 3 : 1;
  const drawn = state.deck.slice(0, count);

  if (count === 1) {
    renderSingle(drawn[0]);
    setStatus("1枚引きの結果です。");
  } else {
    renderThree(drawn);
    setStatus("3枚引きの結果です。");
  }

  drawButton.disabled = true;
}

async function loadCards() {
  try {
    if (Array.isArray(window.CARDS)) {
      state.cards = window.CARDS;
      setStatus("シャッフルしてください。");
      return;
    }

    const response = await fetch("./cards.json");
    if (!response.ok) {
      throw new Error(`カードデータを読み込めませんでした: ${response.status}`);
    }

    state.cards = await response.json();
    setStatus("シャッフルしてください。");
  } catch (error) {
    console.error(error);
    setStatus("カードデータの読み込みに失敗しました。");
    shuffleButton.disabled = true;
    drawButton.disabled = true;
  }
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});
shuffleButton.addEventListener("click", handleShuffle);
drawButton.addEventListener("click", handleDraw);

clearCards();
loadCards();
