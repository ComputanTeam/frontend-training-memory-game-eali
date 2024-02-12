
let previousSelectedLB = null;
let previousSelectedGame = null;
let userName = null;
const buttonsGame = ['GDSE', 'GDSN', 'GDSH', 'GDSX'];
const buttonsLB = ['LDSE', 'LDSN', 'LDSH', 'LDSX'];
let time = 0, score = 0;
let timerInterval, firstCard, secondCard, cardPairs;
let lockedBoard = false;

const validateName = () => {
  if (!userName) {
    alert("Please, Enter your name.");
    resetBoard();
    return false;
  }
  return true;
};

document.querySelector('#name-field').addEventListener("change", (event) => {
  userName = event.target.value;
});

buttonsLB.forEach((button) => {
  document.querySelector(`#${button}`).addEventListener('click', (event) => {
    event.target.classList.add('bg-hover');
    if (previousSelectedLB !== null && previousSelectedLB !== event.target) {
      previousSelectedLB.classList.remove('bg-hover');
    }
    previousSelectedLB = event.target;
  });
});

buttonsGame.forEach((button) => {
  document.querySelector(`#${button}`).addEventListener('click', (event) => {
    event.target.classList.add('bg-hover');
    if (previousSelectedGame !== null && previousSelectedGame !== event.target) {
      previousSelectedGame.classList.remove('bg-hover');
    }
    previousSelectedGame = event.target;
    if (validateName()) {
      startGame(event.target.value);
    }
  });
});

const startGame = (level) => {
  const gameArray = loadArray(level);
  const shuffledArray = shuffleArray(gameArray);
  const gameCards = generateCards(shuffledArray);
  startTimer();
  const gameBox = document.querySelector('#game-box');
  gameBox.innerHTML = '';
  gameBox.appendChild(gameCards);
};

const startTimer = () => {
  time = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    document.querySelector('#timer').innerHTML = time;
    time += 1;
  }, 1000);
};

const loadArray = (level) => {
  if (level === "easy") {
    cardPairs = 8
  } else if (level === "normal") {
    cardPairs = 18;
  } else if (level === "hard") {
    cardPairs = 32;
  } else {
    cardPairs = 50;
  }
  const array = [];
  let imageIndex;
  for (let index = 0; index < cardPairs; index++) {
    imageIndex = index + 1;
    array.push({
      image: `../assets/animals/${imageIndex}.png`,
      number: imageIndex,
    });
    array.push({
      image: `../assets/animals/${imageIndex}.png`,
      number: imageIndex,
    });
  }
  return array;
};

const shuffleArray = (array) => {
  let newPos, tempObj;
  const arrayLength = array.length;
  for (let index = arrayLength - 1; index > 0; index--) {
    newPos = Math.floor(Math.random() * (index + 1));
    tempObj = array[index];
    array[index] = array[newPos];
    array[newPos] = tempObj;
  }
  return array;
};

const generateCards = (array) => {
  const gridContainer = document.createElement("div");
  gridContainer.classList.add('game-grid');
  const dimension = Math.floor(Math.sqrt(cardPairs*2));
  let cardLength = '90px';
  let cardGap = '16px';
  if (dimension === 10) {
    cardLength = '45px';
    cardGap = '4px';
  } else if (dimension === 8) {
    cardLength = '50px';
    cardGap = '8px';
  } else if (dimension === 6) {
    cardLength = '70px';
    cardGap = '12px';
  }
  gridContainer.style.setProperty('--dimension', dimension);
  gridContainer.style.setProperty('--cardlength', cardLength);
  gridContainer.style.setProperty('--cardgap', cardGap);
  for (let card of array) {
    const cardElement = document.createElement("div");
    cardElement.classList.add('card');
    cardElement.setAttribute('data-number', card.number);
    cardElement.innerHTML = `
      <figure class='front'>
        <img class='front-image' src=${card.image}>
      </figure>
      <figure class='back'>
        <img class='back-image' src='../assets/img/back.png'>
      </figure>
    `;
    cardElement.addEventListener("click", handleCardFlip);
    gridContainer.appendChild(cardElement);
  };
  return gridContainer;
};

function handleCardFlip() {
  if (lockedBoard) return;
  this.classList.add('flipped');
  if (!firstCard) {
    firstCard = this;
    return;
  }
  if (this ===  firstCard) return;
  secondCard = this;
  lockedBoard = true;

  firstCard.dataset.number === secondCard.dataset.number ? disableCards() : unflipCards();
};

const disableCards = () => {
  firstCard.removeEventListener("click", handleCardFlip);
  secondCard.removeEventListener("click", handleCardFlip);
  score++;
  resetBoard();
  checkGameComplete();
};

const unflipCards = () => {
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
};

const resetBoard = () => {
  firstCard = null;
  secondCard = null;
  lockedBoard = false;
  previousSelectedGame.classList.remove('bg-hover');
  previousSelectedGame = null;
};

const checkGameComplete = () => {
  console.log(score, cardPairs);
  if (score === cardPairs) {
    clearInterval(timerInterval);
    alert("Game Complete!!!");
  }
};
