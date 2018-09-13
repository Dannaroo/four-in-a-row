const newGame = new Game();

document.querySelector('#begin-game').addEventListener('click', () => {
  newGame.startGame();
  document.querySelector('#begin-game').style.display = 'none';
  document.getElementById('play-area').style.opacity = '1';
});

/**
 * Listen for keyboard presses
 */

document.addEventListener('keydown', function(event){
    newGame.handleKeyDown(event.key);
});
