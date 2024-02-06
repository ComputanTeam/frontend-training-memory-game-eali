
let previousSelectedLB = null;
let previousSelectedGame = null;
let userName = null;
const buttonsGame = ['GDSE', 'GDSN', 'GDSH', 'GDSX'];
const buttonsLB = ['LDSE', 'LDSN', 'LDSH', 'LDSX'];

const validateName = () => {
  if (!userName) {
    alert("Please, Enter your name.")
  }
};

document.querySelector('#name-field').addEventListener("change", (event) => {
  userName = event.target.value;
});

const onDifficultySelection = (buttons, previousSelected) => {
  buttons.forEach((button) => {
    document.querySelector(`#${button}`).addEventListener('click', (event) => {
      event.target.classList.add('bg-hover');
      if (previousSelected !== null && previousSelected !== event.target) {
        previousSelected.classList.remove('bg-hover');
      }
      previousSelected = event.target;
      validateName();
      console.log(userName);
    });
  });
};

onDifficultySelection(buttonsGame, previousSelectedGame);
onDifficultySelection(buttonsLB, previousSelectedLB);
