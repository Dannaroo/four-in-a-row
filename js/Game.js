class Game {
  constructor() {
    this.board = new Board();
    this.players = this.createPlayers();
    this.ready = false;
  }

  /**
 * Creates two player objects
 * @return  {Array}    An array of two Player objects.
 */
 createPlayers() {
   const players = [new Player('Player 1', 1, '#e15258', true),
                    new Player('Player 2', 2, '#e59a13')];
   return players;
 }
 /**
 * Gets game ready for play.
 */
 startGame() {
   this.board.drawHTMLBoard();
   this.activePlayer.activeToken.drawHTMLToken();
   this.ready = true;
 }

 get activePlayer() {
   return this.players.find(player => player.active );
 }

 /**
  * Branches code, depending on what key player presses
  * @param   {Object}    e - Keydown event object .key property
  */
 handleKeyDown(e) {
   if (this.ready) {
     if (e === 'ArrowLeft') {
        this.activePlayer.activeToken.moveLeft();
     } else if (e === 'ArrowRight') {
        this.activePlayer.activeToken.moveRight(this.board.columns);
     } else if (e === 'ArrowDown') {
       this.playToken();
     }
   }
 }

 playToken() {
   let spaces = this.board.spaces;
   let activeToken = this.activePlayer.activeToken;
   let targetColumn = spaces[activeToken.columnLocation]
   let targetSpace = null;


   for (let space of targetColumn) {
     if (space.token === null) {
       targetSpace = space;
     }
   }

   if (targetSpace !== null) {
     const game = this;
     game.ready = false;
     activeToken.drop(targetSpace, function() {
       game.updateGameState(activeToken, targetSpace);
     });
   }
 }

 /**
  * Checks if there a winner on the board after each token drop.
  * @param   {Object}    Targeted space for dropped token.
  * @return  {boolean}   Boolean value indicating whether the game has been won (true) or not (false)
  */

 checkForWin(target){
     const owner = target.token.owner;
     let win = false;

     // vertical
     for (let x = 0; x < this.board.columns; x++ ){
         for (let y = 0; y < this.board.rows - 3; y++){
             if (this.board.spaces[x][y].owner === owner &&
                 this.board.spaces[x][y+1].owner === owner &&
                 this.board.spaces[x][y+2].owner === owner &&
                 this.board.spaces[x][y+3].owner === owner) {
                     win = true;
             }
         }
     }

     // horizontal
     for (let x = 0; x < this.board.columns - 3; x++ ){
         for (let y = 0; y < this.board.rows; y++){
             if (this.board.spaces[x][y].owner === owner &&
                 this.board.spaces[x+1][y].owner === owner &&
                 this.board.spaces[x+2][y].owner === owner &&
                 this.board.spaces[x+3][y].owner === owner) {
                     win = true;
             }
         }
     }

     // diagonal
     for (let x = 3; x < this.board.columns; x++ ){
         for (let y = 0; y < this.board.rows - 3; y++){
             if (this.board.spaces[x][y].owner === owner &&
                 this.board.spaces[x-1][y+1].owner === owner &&
                 this.board.spaces[x-2][y+2].owner === owner &&
                 this.board.spaces[x-3][y+3].owner === owner) {
                     win = true;
             }
         }
     }

     // diagonal
     for (let x = 3; x < this.board.columns; x++ ){
         for (let y = 3; y < this.board.rows; y++){
             if (this.board.spaces[x][y].owner === owner &&
                 this.board.spaces[x-1][y-1].owner === owner &&
                 this.board.spaces[x-2][y-2].owner === owner &&
                 this.board.spaces[x-3][y-3].owner === owner) {
                     win = true;
             }
         }
     }

     return win;
 }

 /**
 * Switches active player.
 */
 switchPlayers() {
   const playerArray = this.players;

   for(let i = 0; i < playerArray.length; i += 1) {
     if (playerArray[i].active === true) {
       playerArray[i].active = false;
     } else if(playerArray[i].active === false) {
        playerArray[i].active = true;
     }
   }
 }

 /**
 * Displays game over message.
 * @param {string} message - Game over message.
 */
 gameOver(message) {
   const gameOverDiv = document.querySelector('#game-over');
   gameOverDiv.style.display = "block";
   gameOverDiv.textContent = message;
 }


 /**
 * Updates game state after token is dropped.
 * @param   {Object}  token  -  The token that's being dropped.
 * @param   {Object}  target -  Targeted space for dropped token.
 */
 updateGameState(token, target) {
   target.mark(token);
   if(this.checkForWin(target)) {
     this.gameOver(target.token.owner.name + ' won the game!');
   } else {
     this.switchPlayers();
     if(this.activePlayer.checkTokens()) {
       this.activePlayer.activeToken.drawHTMLToken();
       this.ready = true;
     } else {
       this.gameOver('No tokens remaining. The game is a tie!');
     }
   }
 }

}
