
let previousSelectedLB = null;
let previousSelectedGame = null;
const buttonsGame = ['GDSE', 'GDSN', 'GDSH', 'GDSX'];
const buttonsLB = ['LDSE', 'LDSN', 'LDSH', 'LDSX'];

const difficultySelection = (event) => {
  event.target.classList.add('bg-hover');
  if (previousSelectedLB !== null && previousSelectedLB !== event.target) {
    previousSelectedLB.classList.remove('bg-hover');
  }
  previousSelectedLB = event.target;
}

document.querySelector('#LDSE').addEventListener('click', difficultySelection);
document.querySelector('#LDSN').addEventListener('click', difficultySelection);
document.querySelector('#LDSH').addEventListener('click', difficultySelection);
document.querySelector('#LDSX').addEventListener('click', difficultySelection);

