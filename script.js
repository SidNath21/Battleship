const playerContainer = document.querySelector("#playerBoard");
const computerContainer = document.querySelector("#computerBoard");
const randButton = document.querySelector("#random");
const startButton = document.querySelector("#startGame");
const shipsContainer = document.querySelector("#ships");
const message = document.querySelector("#message");
const text = document.createElement("p");

text.textContent = "Place Your Ships!";
text.classList.add("text");
message.appendChild(text);


let cellsPlayer, cellsComputer;
let playerTurn = false;
let cellColor = "black";
let cellHoverColor = "grey";
let cellBorderColor = "white";
let shipColor = "orange";

let cellHoverBorderColor = "14A76C";
let hitColor = "navy";
let missColor = "#9CD3DB";
let opponentBoard = [];
let playerBoard = [];
let computerGuess = [];

let shipsPlaced = false;
let started = false;
let gameOver = false;

let dr = [-1, 1, 0, 0];
let dc = [0, 0, -1, 1];

let compGuess = {
    r: -1,
    c: -1,
    newR: -1,
    newC: -1,
    nextMove: false,
    works: false
}

let opponentShips = [
    {
        name:"Destroyer",
        length: 2,
        dir:0,
        x:0,
        y:0
    },

    {
        name:"Submarine",
        length: 3,
        dir:0,
        x:0,
        y:0
    },

    {
        name:"Cruiser",
        length: 3,
        dir:0,
        x:0,
        y:0
    },

    {
        name:"Battleship",
        length: 4,
        dir:0,
        x:0,
        y:0
    },

    {
        name:"Carrier",
        length: 5,
        dir:0,
        x:0,
        y:0
    }
];

let myShips = [
    {
        name:"Destroyer",
        length: 2,
        dir:0,
        x:0,
        y:0
    },

    {
        name:"Submarine",
        length: 3,
        dir:0,
        x:0,
        y:0
    },

    {
        name:"Cruiser",
        length: 3,
        dir:0,
        x:0,
        y:0
    },

    {
        name:"Battleship",
        length: 4,
        dir:0,
        x:0,
        y:0
    },

    {
        name:"Carrier",
        length: 5,
        dir:0,
        x:0,
        y:0
    }
];




createGrid();


randButton.addEventListener("click", createMyShips);
startButton.addEventListener("click", startGame);

function createGrid(){

    let rows = 11;
    let columns = 11;

    for(let i=0; i<rows; i++){

       opponentBoard[i] = [];
       playerBoard[i] = [];
       computerGuess[i] = [];

       const columnP = document.createElement("div");
       columnP.classList.add("columnP");
       playerContainer.appendChild(columnP);

       const columnC = document.createElement("div");
       columnC.classList.add("columnC");
       computerContainer.appendChild(columnC);

      
        for(let j=0; j<columns; j++){

            opponentBoard[i][j] = -1;
            playerBoard[i][j] = -1;
            computerGuess[i][j] = false;
       

            const cellP = document.createElement("div");
            cellP.classList.add("cellP");
            columnP.appendChild(cellP);
            cellP.value = false; //has Ship or Not
            cellP.id = -1;
            

            const cellC = document.createElement("div");
            cellC.classList.add("cellC");
            cellC.value = false; //has Ship or Not
            cellC.id = -1; // ship Index
            
            columnC.appendChild(cellC);

            if(j==0 || i == 0){

                cellP.style.backgroundColor = "#292930";
                cellP.style.borderColor = "#292930";
                cellC.style.backgroundColor = "#292930";
                cellC.style.borderColor = "#292930";
               
                if(!(j==0 && i==0)){
                    if(i==0){ 
                        cellP.textContent = getLetter(j);
                        cellC.textContent = getLetter(j);
                    }
                    else{
                        cellP.textContent = i;
                        cellC.textContent = i;
                    }
                }

                
            } 

            else if(i>0 && j >0){
                
                cellC.addEventListener("click", opponentBoardClick);
                cellC.addEventListener("mouseenter", opponentBoardHover);
                cellC.addEventListener("mouseout", opponentBoardOut);
            }

            

        }
    }
    cellsPlayer = document.querySelectorAll(".cellP");
    cellsComputer = document.querySelectorAll(".cellC");

    randomShips(opponentShips, opponentBoard, cellsComputer, false); //create computer ships

    //create "Ship Buttons"
    for(let i=0; i<myShips.length; i++){
        const battleShipButton = document.createElement("button");
        battleShipButton.textContent = myShips[i].name;
        battleShipButton.classList.add("battleShipButton");
        battleShipButton.value = i;  // refer to index of My Ship
        shipsContainer.appendChild(battleShipButton);

        battleShipButton.addEventListener("click", getPlacement);
        battleShipButton.addEventListener("mouseenter", shipEnter);
        battleShipButton.addEventListener("mouseleave", shipExit);
    }
        
    }

function shipEnter(){
    if(started || gameOver) return;
    this.style.backgroundColor = cellHoverColor;

    if(myShips[this.value].dir != 0){
        highlightShip(myShips, cellsPlayer, this.value, "FF652F", "FF652F");
    }
}


function shipExit(){
    if(started || gameOver) return;
    if(myShips[this.value].dir != 0) this.style.backgroundColor = cellColor;
    else this.style.backgroundColor = "#292930";

    if(myShips[this.value].dir != 0){
        highlightShip(myShips, cellsPlayer, this.value, shipColor, cellBorderColor);
    }

}

function highlightShip(ships, cells, val, bgColor, borderColor){
    let count = 0;
    let dir = ships[val].dir;
    let r = ships[val].x;
    let c = ships[val].y;
    while(count < ships[val].length){
        
        cells[getCell(r, c)].style.backgroundColor = bgColor;
        
        if(dir == 1){ // North  
            cells[getCell(r, c)].style.borderBottomColor = borderColor;
            cells[getCell(r, c)].style.borderTopColor = borderColor;   
            if(count == 0) cells[getCell(r, c)].style.borderTopColor = cellBorderColor;
            if(count == ships[val].length - 1) cells[getCell(r, c)].style.borderBottomColor = cellBorderColor;
            c++;
        }  
        else if(dir == 2){
            cells[getCell(r, c)].style.borderBottomColor = borderColor;
            cells[getCell(r, c)].style.borderTopColor = borderColor;
            if(count == 0) cells[getCell(r, c)].style.borderBottomColor =cellBorderColor;
            if(count == ships[val].length - 1) cells[getCell(r, c)].style.borderTopColor = cellBorderColor;
             c--;  //South
        }
        else if(dir == 3){
            cells[getCell(r, c)].style.borderLeftColor = borderColor;
            cells[getCell(r, c)].style.borderRightColor = borderColor;
            if(count == 0) cells[getCell(r, c)].style.borderRightColor = cellBorderColor;
            if(count == ships[val].length - 1) cells[getCell(r, c)].style.borderLeftColor = cellBorderColor;
             r--; //East
        }
        else if(dir == 4){ 
            cells[getCell(r, c)].style.borderLeftColor = borderColor;
            cells[getCell(r, c)].style.borderRightColor = borderColor;
            if(count == 0) cells[getCell(r, c)].style.borderLeftColor = cellBorderColor;
            if(count == ships[val].length - 1) cells[getCell(r, c)].style.borderRightColor  = cellBorderColor;
            r++; //West
        }
        count++;
    }
}

function opponentBoardClick(){
    
    
    if(!started || gameOver || this.style.backgroundColor != cellHoverColor) return;
    
    // my Move
    if(this.value == true){
        this.style.backgroundColor = hitColor;
        text.textContent = "Hit!";
        if(checkSink(opponentShips, cellsComputer, this.id)){
            text.textContent = "Opponent " + opponentShips[this.id].name + " is Sunk";
            highlightShip(opponentShips, cellsComputer, this.id, hitColor, hitColor);   
        }
    } 
    else{
         this.style.backgroundColor = missColor;    
         text.textContent = "You Missed!";
    }
    

    // Computer Move
    computerMove();
    
    // Check Game Over
    if(isGameOver()){
        gameOver = true;
        text.textContent = "Game Over - Reset to Play Again";
    }
    
}

function isGameOver(){
    for(let i=0; i<opponentShips.length; i++){
        if(!checkSink(opponentShips, cellsComputer, i)) return false;
    }

    return true;
}

function checkSink(ships, cells, id){
    
    let r = ships[id].x;
    let c = ships[id].y;
    let dir = ships[id].dir;

    let count = 0;
    let sunk = true;
    while(count < ships[id].length){
        if(cells[getCell(r, c)].style.backgroundColor != hitColor) sunk = false;
        if(dir == 1) c++;
        if(dir == 2) c--;
        if(dir == 3) r--;
        if(dir == 4) r++;
        count++;
    }

    return sunk;

}

function computerMove(){



    
    if(compGuess.nextMove == false){
        let r, c;
        let works = false;
        while(!works){
            r = Math.floor(Math.random() * (10));
            c = Math.floor(Math.random() * (10)) + 1;
            if(computerGuess[r][c] == false){    
                computerGuess[r][c] = true;
                works = true;
            }

        }

        if(playerBoard[r][c] > 0){ // Cell has Ship
            cellsPlayer[getCell(r, c)].style.backgroundColor = hitColor;
            if(checkSink(myShips, cellsPlayer, cellsPlayer[getCell(r, c)].id)){
                highlightShip(myShips, cellsPlayer, cellsPlayer[getCell(r, c)].id, "navy", "navy");
                //compGuess.nextMove = false;
            }
            else{
                //compGuess.nextMove = true;
                compGuess.r = r;
                compGuess.c = c;
            }
        }    
    
        else{
            cellsPlayer[getCell(r, c)].style.backgroundColor = missColor;
        }

    }



/* 
    else{
        let r, c;
        r = compGuess.r;
        c = compGuess.c;
        if(compGuess.works == false){
            cellsPlayer[getCell(r, c)].style.backgroundColor = missColor;
        }

        else{
            cellsPlayer[getCell(r, c)].style.backgroundColor = hitColor;
            if(checkSink(myShips, cellsPlayer, cellsPlayer[getCell(r, c)].id)){
                highlightShip(myShips, cellsPlayer, cellsPlayer[getCell(r, c)].id, "navy", "navy");
                compGuess.nextMove = false;
            }
        }

        
        let dir, newR, newC;
        while(computerGuess[newR][newC] != false){
            newR = r;
            newC = c;
            dir = Math.floor(Math.random() * 4) + 1;
            if(dir == 1) newC++;  //North
            else if(dir == 2) newC--;  //South
            else if(dir == 3) newR--; //East
            else if(dir == 4) newR++; //West
        }

        computerGuess[newR][newC] = true;

        if(playerBoard[newR][newC] > 0){
            compGuess.works = true;
            compGuess.r = newR;
            compGuess.c = newC;
        }
        else{
            compGuess.works = false;
            compGuess.r = newR;
            compGuess.c = newC;
        }

    }

    */


   
}


function opponentBoardHover(){
    if(!started) return;
    if(this.style.backgroundColor != cellColor) return;
    this.style.backgroundColor = cellHoverColor;
    
}

function opponentBoardOut(){  
    if(!started) return;
    if(this.style.backgroundColor != cellHoverColor) return;
    this.style.backgroundColor = cellColor;
    
}


function createMyShips(){
    if(started) return;
    for(let i=1; i<shipsContainer.childNodes.length; i++) shipsContainer.childNodes[i].style.backgroundColor = cellColor;
    
    randomShips(myShips, playerBoard, cellsPlayer, true); 
    text.textContent = "Start Game";
    shipsPlaced = true;
}

function randomShips(ships, board, cells, changeColor){

    for(let i=0; i<ships.length; i++){
        ships[i].dir = 0;
        ships[i].x = 0;
        ships[i].y = 0;
    }

    for(let i=0; i<board.length; i++){
        for(let j=0; j<board.length; j++){
            if(inBounds(i, j)){
            board[i][j] = -1;
            cells[getCell(i, j)].style.backgroundColor = cellColor;
            cells[getCell(i, j)].id = -1;
           
            }
        }
    }

    for(let i=0; i<ships.length; i++){
        let size = ships[i].length;
        let placed = false;
        while(!placed){

            let dir = Math.floor(Math.random() * 4) + 1;
            let r = Math.floor(Math.random() * (10));
            let c = Math.floor(Math.random() * (10)) + 1;
           
            if(placementWorks(r, c, dir, size, board)){
            
                ships[i].x = r;
                ships[i].y = c;
                ships[i].dir = dir;

                let count = 0;
                    while(count < size){
                        board[r][c] *= -1;
                        if(changeColor) cells[getCell(r,c)].style.backgroundColor = shipColor;
                        cells[getCell(r,c)].value = true;
                        cells[getCell(r, c)].id = i;

                        if(dir == 1) c++;  //North
                        else if(dir == 2) c--;  //South
                        else if(dir == 3) r--; //East
                        else if(dir == 4) r++; //West

                        count++;
                }
                placed = true;

            }

        }
    }
}

function placementWorks(r, c, dir, size, board){

    let count = 0;

    while(count < size){
        //check if in Bounds
        if( !(inBounds(r,c)) || board[r][c] != -1) return false;

        //Check for surrounding ships
        for(let i=0; i<4; i++){
            let newR = r + dr[i];
            let newC = c + dc[i];
            if(inBounds(newR, newC)){
                if(board[newR][newC] > 0) return false;
            }
        }

        if(inBounds(r-1,c-1) && board[r-1][c-1] > 0) return false;
        if(inBounds(r-1, c+1) && board[r-1][c+1] > 0) return false;
        if(inBounds(r+1, c+1) && board[r+1][c+1] > 0) return false;
        if(inBounds(r+1, c-1) && board[r+1][c-1] > 0) return false;
        
        if(dir == 1) c++;  //North
        else if(dir == 2) c--;  //South
        else if(dir == 3) r--; //East
        else if(dir == 4) r++; //West

        count++;
    }

    return true;
}

function getPlacement(){

    if(started || gameOver) return;

    this.style.backgroundColor = cellColor;
    removeShip(this.value);
    
    
    let valid = false;
    while(!valid){


        let r = prompt("Enter X Value for " + myShips[this.value].name + " (Size " + myShips[this.value].length + ") : A-J ");
        if(r != null) r = r.toUpperCase().charCodeAt(0)-65;
        else return;

        let c = prompt("Enter Y Value for " + myShips[this.value].name + " : 1-10 ");
        if(c == null) return;

        let dir = prompt("Enter Direction for " + myShips[this.value].name + " : N,S,E,W ");
        if(dir != null) dir = dir.toUpperCase();
        else return;

        if(dir == "N") dir = 1;
        if(dir == "S") dir = 2;
        if(dir == "E") dir = 3;
        if(dir == "W") dir = 4;
        let size = myShips[this.value].length;
        if(isValid(r, c, dir, size)){
            myShips[this.value].x = r;
            myShips[this.value].y = c;
            myShips[this.value].dir = dir;
            let count = 0;
                while(count < size){
                    playerBoard[r][c] *= -1;
                    cellsPlayer[getCell(r,c)].style.backgroundColor = shipColor;
                    cellsPlayer[getCell(r,c)].value = true;
                    cellsPlayer[getCell(r,c)].id = this.value;
                    if(dir == 1) c++;
                    if(dir == 2) c--;
                    if(dir == 3) r--;
                    if(dir == 4) r++;
                    count++;
                }
                valid = true;
        }
        else{
            alert("Invalid Position for " + myShips[this.value].name);
        }
    }

    let works = true;
    for(let i=0; i<myShips.length; i++){
        if(myShips[i].dir == 0) works = false;
    }

    if(works) text.textContent = "Start Game";

}

function removeShip(id){
    if(myShips[id].dir == 0) return;
    let r = myShips[id].x;
    let c = myShips[id].y;
    let dir = myShips[id].dir;

    let count = 0;
    while(count < myShips[id].length){
        playerBoard[r][c] *= -1;
        cellsPlayer[getCell(r,c)].style.backgroundColor = cellColor;
        cellsPlayer[getCell(r,c)].style.borderColor = cellBorderColor;
        cellsPlayer[getCell(r,c)].value = false;
        cellsPlayer[getCell(r,c)].id = -1;
        if(dir == 1) c++;
        if(dir == 2) c--;
        if(dir == 3) r--;
        if(dir == 4) r++;
        count++;
    }
}

function startGame(){

    if(started) location.reload();

    for(let i=0; i<myShips.length; i++){
        if(myShips[i].dir == 0){
            alert("Place All Ships Before Starting");
            return;
        }
    }

    started = true;
    this.textContent = "Reset";
    text.textContent = "Make Your Move"
}


function isValid(r, c, dir, size){
    let count = 0;
    while(count < size){
        if( !(inBounds(r,c)) || playerBoard[r][c] != -1) return false;
        if(dir == 1) c++;  //North
        if(dir == 2) c--;  //South
        if(dir == 3) r--; //East
        if(dir == 4) r++; //West
        count++;
    }
    return true;
}
function inBounds(r,c){
    return (r >= 0 && r<= 9 && c > 0 && r <=10);
}

function getCell(r, c){  
    return (11*c + r + 1);
}

function getLetter(num){
    if(num == 1) return "A";
    if(num == 2) return "B";
    if(num == 3) return "C";
    if(num == 4) return "D";
    if(num == 5) return "E";
    if(num == 6) return "F";
    if(num == 7) return "G";
    if(num == 8) return "H";
    if(num == 9) return "I";
    if(num == 10) return "J";
    return "";
    
}
