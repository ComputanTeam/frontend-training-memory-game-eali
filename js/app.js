// GLOBAL VARIABLES
const difficultyOptions = ['easy', 'normal', 'hard', 'expert'];
let timerInterval, firstCard, secondCard, cardPairs, cardGap, cardLength, gameLevel;
let previousSelectedLB = null;
let previousSelectedGame = null;
let userName = null;
let time = 0, score = 0;
let lockedBoard = false;
const timeElement = document.querySelector('#timer');


// UTILITY FUNCTIONS
const validateName = () => {
  if (!userName) {
    alert("Please, Enter your name.");
    resetGame();
    return false;
  }
  return true;
};

const startGame = () => {
  const gameArray = loadArray();
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
    timeElement.textContent = time;
    time += 1;
  }, 1000);
};

const loadArray = () => {
  const array = [];
  let imageIndex;
  for (let index = 0; index < cardPairs; index++) {
    imageIndex = index + 1;
    array.push({
      image: `./assets/animals/${imageIndex}.png`,
      number: imageIndex,
    });
    array.push({
      image: `./assets/animals/${imageIndex}.png`,
      number: imageIndex,
    });
  }
  return array;
};

const setGridValues = (level) => {
  gameLevel = level;
  if (level === "easy") {
    cardPairs = 8
    cardLength = '5.6rem';
    cardGap = '1rem';
  } else if (level === "normal") {
    cardPairs = 18;
    cardLength = '4.3rem';
    cardGap = '0.75rem';
  } else if (level === "hard") {
    cardPairs = 32;
    cardLength = '3rem';
    cardGap = '0.5rem';
  } else {
    cardPairs = 50;
    cardLength = '2.8rem';
    cardGap = '0.25rem';
  }
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
        <img class='back-image' src='./assets/img/back.png'>
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
  setTimeout(checkGameComplete, 550);
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
};

const resetGame = () => {
  resetBoard();
  previousSelectedGame.classList.remove('bg-hover');
  previousSelectedGame = null;
  clearInterval(timerInterval);
  loadInstructions();
  timeElement.textContent = '0';
};

const checkGameComplete = () => {
  if (score === cardPairs) {
    alert(`Game Complete - ${time}`);
    resetGame();
    saveScore();
    loadScore(previousSelectedLB.value);
  }
};

const loadInstructions = () => {
  document.querySelector('#game-box').innerHTML = `
    <h2>Welcome to Animal Memory, a memory game for your memory :D</h2>
    <p>You might be asking yourself how to play this game. Don't worry, that is why this paragraph is here.</p>
    <p>Please, insert your name so you can start the game. Once you start, the timer will start ticking.</p>
    <p>When you are done, it will stop the time position and the username will be printed to the table. ;)</p>
    `;
};

const saveScore = () => {
  if (!userName) {
    userName = prompt("Enter your name: ");
  }
  const data = {
    [userName]: time,
  }
  const storedData = localStorage.getItem(gameLevel);
  if (storedData) {
    const JsonData = JSON.parse(storedData);
    JsonData.push(data);
    JsonData.sort((a, b) => {
      let valueA = parseInt(Object.values(a)[0]);
      let valueB = parseInt(Object.values(b)[0]);
      return valueA - valueB;
    });
    JsonData.slice(0, 5);
    localStorage.setItem(gameLevel, JSON.stringify(JsonData));
  } else {
    localStorage.setItem(gameLevel, JSON.stringify([data]));
  }
};

const loadScore = (level) => {
  clearTable();
  const data = localStorage.getItem(level);
  if (data) {
    const JsonData = JSON.parse(data);
    JsonData.forEach((score, index) => {
      const name = Object.keys(score)[0];
      const time = Object.values(score)[0];
      const nameBox = document.querySelector(`#td-name-${index + 1}`);
      const timeBox = document.querySelector(`#td-time-${index + 1}`);
      nameBox.textContent = name;
      timeBox.textContent = time;
    });    
  }
};

const clearTable = () => {
  for (let index = 1; index <= 5; index++) {
    document.querySelector(`#td-name-${index}`).textContent = "";
    document.querySelector(`#td-time-${index}`).textContent = "";
  }
};

const onDifficultySelectionGame = (event) => {
  event.target.classList.add('bg-hover');
  if (previousSelectedGame !== null && previousSelectedGame !== event.target) {
    previousSelectedGame.classList.remove('bg-hover');
  }
  previousSelectedGame = event.target;
  if (validateName()) {
    setGridValues(event.target.value);
    startGame();
  }
};

const onDifficultySelectionLB = (event) => {
  event.target.classList.add('bg-hover');
  if (previousSelectedLB !== null && previousSelectedLB !== event.target) {
    previousSelectedLB.classList.remove('bg-hover');
  }
  previousSelectedLB = event.target;
  loadScore(event.target.value);
}

const getDFButton = (option) => {
  const button = document.createElement("input");
  button.setAttribute('type', 'button');
  button.setAttribute('value', option);
  button.classList.add('button');
  return button;
};

const setDifficultyButtons = (selector, callback) => {
  difficultyOptions.forEach((option) => {
    const button = getDFButton(option);
    button.addEventListener("click", callback);
    document.querySelector(selector).appendChild(button);
  });
};


// ######################################## START GAME #######################################

loadInstructions();

document.querySelector('#name-field').addEventListener("change", (event) => {
  userName = event.target.value;
});

setDifficultyButtons('#GDS', onDifficultySelectionGame);
setDifficultyButtons('#LDS', onDifficultySelectionLB);
