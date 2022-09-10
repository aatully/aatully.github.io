const div = document.getElementById('Matrix');
const restartbutton = document.getElementById('restart');
const scoreText = document.getElementById('score');
const speedRunButton = document.getElementById('Challange');
const timerText = document.getElementById('timer');

const SquareColor = '#f2c2ef';
const SquareClickedColor = '#8a6ecc';

let InterList;

let matrixSize = [10,10];
let BombNumber = 10;

let intervalON = true;
let islose = false;
let ClickedSquares = [];

let Timer = () => {
    let seconds = 0;
    let minutes = 0;
    InterList = setInterval(() => {
        seconds++

        if (seconds > 59) {
            seconds = 0;
            minutes++;
        }
        if (seconds < 10 && minutes < 10) {
            timerText.innerText = `Timer: 0${minutes}:0${seconds}`;
        } else if (seconds < 10) {

            timerText.innerText = `Timer: ${minutes}:0${seconds}`;
        } else if (minutes < 10) {
            timerText.innerText = `Timer: 0${minutes}:${seconds}`;
        } else {
            timerText.innerText = `Timer: ${minutes}:${seconds}`;
        }
            
    }, 1000);
}

div.style.gridTemplateColumns = `repeat(${matrixSize[0]}, calc(5vh + 0.4vw - 0.5rem))`;

function CreateMatrixofSquares(BombsList) {
    let SquaresArray = [];

    let score = 0;
    let TotalPoints = matrixSize[0] * matrixSize[1] - BombNumber;

    scoreText.style.color = 'white';
    scoreText.innerText = `Score: ${score}/${TotalPoints}`;

    speedRunButton.addEventListener('click', () => {
        timerText.innerText = `Timer: 00:00`;
        timerText.style.color = 'white';
        timerText.style.margin = '1rem';
        clearInterval(InterList);
        intervalON = false;
        speedRunButton.disabled = true;
    });
 
    for (let i = 0; i < matrixSize[0]; i++) {
        for (let j = 0; j < matrixSize[1]; j++) {

            let Square = document.createElement('div');
            
            Square.style.width = 'calc(5vh + 0.4vw - 0.5rem)';
            Square.style.height = 'calc(5vh + 0.4vw - 0.5rem)';
            Square.style.borderRadius = '1.5vh';
            Square.style.backgroundColor = SquareColor;
            Square.style.zIndex = '0';
            Square.style.cursor = 'pointer';
            Square.style.justifyContent = 'center';

            let pos = [j,i];

            let isBomb = (pos) => {
                let have = false;
                for (let Bomb of BombsList) {
                    if (Bomb[0] == pos[0] && Bomb[1] == pos[1]) {
                        have = true;
                    }
                }
                return have;
            }

            let CalculateNumber = (pos) => {
                let NumOfBombs = 0;
                for (let i = pos[0] - 1; i <= pos[0] + 1; i++) {
                    for (let j = pos[1] - 1; j <= pos[1] + 1; j++) {
                        if (isBomb([i,j])) {
                            NumOfBombs++;
                        }
                    }
                }
                return NumOfBombs;
            }

            let lose = () => {

                let y = 0;
                let x = 0;
                for (let Square of SquaresArray) {

                    Square.removeEventListener('click', clickFunc);
                    Square.style.backgroundColor = SquareClickedColor;
                    Square.style.backgroundImage = '';

                    if (matrixSize[0] <= x) {
                        x = 0;
                        y++;
                    }

                    if (isBomb([x,y])) {
                        Square.style.backgroundImage = 'url("bomb.png")';
                        Square.style.backgroundRepeat = 'no-repeat';
                        Square.style.backgroundSize = 'calc(2vh + 0.5vw)';
                        Square.style.backgroundPosition = 'center';
                    } else {
                        let Number = document.createElement('h1');
                        let CalculatedNumer = CalculateNumber([x,y], BombsList);
    
                        if (CalculatedNumer !== 0) {
                            Number.innerText = CalculatedNumer;
                        }
    
                        Number.style.zIndex = '1000';
                        Number.style.fontSize = 'small';
                        Number.style.textAlign = 'center';
                        Number.style.fontSize = '0.6rem';
      
                        Square.replaceChildren(Number);
                    }
                    
                    x++;
                }
            }

            let Empty = (pos) => {
                
                let calcSquare = (pos) => {
                    return (pos[1] * matrixSize[0] + pos[0]);
                }
                let SquareNumber = calcSquare(pos);
                ClickedSquares.push(SquareNumber);

                if ( div.children[SquareNumber] != undefined) {

                    div.children[SquareNumber].style.backgroundColor = SquareClickedColor;
                    if (!islose) {
                        score++;
                        scoreText.innerText = `Score: ${score}/${TotalPoints}`;
                    }
                        
                    let up = [pos[0], pos[1] + 1];
                    let left = [pos[0] - 1, pos[1]];
                    let Right = [pos[0] + 1, pos[1]];
                    let down = [pos[0], pos[1] - 1];
                    
                    if (CalculateNumber(up) == 0 && !ClickedSquares.includes(calcSquare(up))) {
                        if (up[0] >= 0 && up[0] < matrixSize[0] && up[1] >= 0 && up[1] < matrixSize[1]) {
                            Empty(up);
                        }
                    }

                    if (CalculateNumber(left) == 0 && !ClickedSquares.includes(calcSquare(left))) {
                        if (left[0] >= 0 && left[0] < matrixSize[0] && left[1] >= 0 && left[1] < matrixSize[1]) {
                            Empty(left);
                        }
                    }
                    
                    if (CalculateNumber(Right) == 0 && !ClickedSquares.includes(calcSquare(Right))) {
                        if (Right[0] >= 0 && Right[0] < matrixSize[0] && Right[1] >= 0 && Right[1] < matrixSize[1]) {
                            Empty(Right);
                        }
                    }

                    if (CalculateNumber(down) == 0 && !ClickedSquares.includes(calcSquare(down))) {
                        if (down[0] >= 0 && down[0] < matrixSize[0] && down[1] >= 0 && down[1] < matrixSize[1]) {
                            Empty(down);
                        }
                    }
                }
            }

            let calcSquare = (pos) => {
                return (pos[1] * matrixSize[0] + pos[0]);
            }
            
            let clickFunc = () => {
                
                Square.style.backgroundColor = SquareClickedColor;
                Square.style.backgroundImage = '';
                let SquareNumber = calcSquare(pos);
                
                if (isBomb(pos)) {
                    lose();
                    scoreText.innerText = `You lose! Score: ${score}`;
                    scoreText.style.color = '#f5427e';
                    clearInterval(InterList);
                    intervalON = true;
                    islose = true;
                } else {
                    if (!islose) {
                        score++;
                    }

                    if (!intervalON) {
                        Timer();
                        intervalON = true;
                    }

                    if (score == TotalPoints) {
                        scoreText.innerText = `You win! Score: ${score}`;
                        scoreText.style.color = '#8aedb3';
                        clearInterval(InterList);
                        intervalON = true;
                        return;
                    } else {
                        scoreText.innerText = `Score: ${score}/${TotalPoints}`;
                    }

                    let Number = document.createElement('h1');
                    let CalculatedNumer = CalculateNumber(pos);

                    let calcSquare = (pos) => {
                        return (pos[1] * matrixSize[0] + pos[0]);
                    }

                    if (CalculatedNumer !== 0) {
                        Number.innerText = CalculatedNumer;
                    } else if (!ClickedSquares.includes(calcSquare(pos))) {
                        
                        Empty(pos);
                    }

                    Number.style.zIndex = '1000';
                    Number.style.fontSize = 'small';
                    Number.style.textAlign = 'center';
                    Number.style.fontSize = '0.6rem';
                    
                    Square.replaceChildren(Number);
                }

                Square.removeEventListener('click', clickFunc);
                ClickedSquares.push(SquareNumber);
            }

            Square.addEventListener('click', clickFunc);

            Square.addEventListener('contextmenu', (ev) => {
                ev.preventDefault();

                if (!ClickedSquares.includes(calcSquare(pos))) {   
                    if (Square.style.backgroundImage == 'url("flag.png")') {
                        Square.style.backgroundImage = '';
                    } else {
                        Square.style.backgroundImage = 'url("flag.png")';
                        Square.style.backgroundRepeat = 'no-repeat';
                        Square.style.backgroundSize = 'calc(3vh + 0.3vw)';
                        Square.style.backgroundPosition = 'center';
                    }
                }
            });

            SquaresArray.push(Square);
        }
    }
    div.replaceChildren(...SquaresArray);
}

function GenerateBombs() {
    let ListOfBombs = [];

    while(ListOfBombs.length < BombNumber) {
        let x = Math.floor(Math.random() * matrixSize[0]);
        let y = Math.floor(Math.random() * matrixSize[1]);

        let Bomb = [x,y];

        if (!ListOfBombs.includes(Bomb)) {
            ListOfBombs.push(Bomb);
        }
    }
    return ListOfBombs;
}

let CreateTable = () => {

    let Bombs = GenerateBombs();
    CreateMatrixofSquares(Bombs);
}

restartbutton.addEventListener('click', () => {
    CreateTable();
    clearInterval(InterList);
    intervalON = true;
    islose = false;
    ClickedSquares = [];
    timerText.innerText = ``;
    speedRunButton.disabled = false;
});

CreateTable();