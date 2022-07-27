var board, thisId, currentLetter, metaBoard, goal, squares, overlay;

var turn = document.querySelector('#turn');
if (currentLetter) {
  turn.innerText += currentLetter === 1 ? " X" : " O";
} else {
  turn.innerText += " X"
}

document.onkeyup = e => {
  if (e.key === "\\") {
    localStorage.clear();
  }
}

if (localStorage.length !== 5) { // new game
  localStorage.clear();
  currentLetter = 1; // 0 is empty, 1 is X, 2 is O
  board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // blank
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  metaBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  goal = 1;
  
  squares = Array.from(document.querySelectorAll('.square'));
  for (var i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', draw);
    squares[i].addEventListener('mouseover', hover);
    squares[i].addEventListener('mouseout', unHover);
  }
  
  overlay = Array.from(document.querySelectorAll('.overlay'));

  // do {
  //   var random = squares[Math.floor(Math.random() * squares.length)];
  //   random.click();
  // } while (localStorage.length === 5);

} else { // restoring
  currentLetter = parseInt(localStorage.currentLetter);
  board = localStorage.board.split(',');
  for (var i = 0; i < board.length; i++) {
    board[i] = parseInt(board[i]);
  }
  var temp = [];
  var innerTemp = [];
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      innerTemp.push(board[0]);
      board.shift();
    }
    temp.push(innerTemp);
    innerTemp = [];
  }
  board = [...temp];
  metaBoard = localStorage.metaBoard.split(',');
  for (var i = 0; i < metaBoard.length; i++) {
    metaBoard[i] = parseInt(metaBoard[i]);
  }
  goal = parseInt(localStorage.goal);
  thisId = parseInt(localStorage.thisId);
  squares = Array.from(document.querySelectorAll('.square'));
  overlay = Array.from(document.querySelectorAll('.overlay'));
  restore();
}

function draw(event) {
  event.target.classList.remove('hover');
  // add letter after click
  if (currentLetter === 1) {
    event.target.innerText = "X";
  } else if (currentLetter === 2) {
    event.target.innerText = "O";
  }
  thisId = event.target.id[5];
  parentId = event.target.parentElement.id[3];
  board[parentId][thisId] = currentLetter;
  squares.forEach(index => {
    index.removeEventListener('click', draw);
    index.removeEventListener('mouseover', hover);
    index.removeEventListener('mouseout', unHover);
  })
  overlay.forEach(index => {
    index.classList.remove('focused');
  })
  if (winner()) {
    if (currentLetter === 1) {
      overlay[parentId - 1].innerText = "X";
      metaBoard[parentId] = 1;
    } else if (currentLetter === 2) {
      overlay[parentId - 1].innerText = "O";
      metaBoard[parentId] = 2;
    }
  }
  if (metaWinner()) {
    turn.style.display = 'none';
    localStorage.clear();
    return;
  }

  currentLetter = currentLetter === 1 ? 2 : 1;
  
  restore();

  turn.innerText = turn.innerText.substring(0, turn.innerText.length - 1);
  turn.innerText += currentLetter === 1 ? " X" : " O";

  localStorage.thisId = thisId;
  localStorage.currentLetter = currentLetter;
  localStorage.board = board.toString();
  localStorage.metaBoard = metaBoard.toString();
  localStorage.goal = goal;
}

function hover(event) {
  event.target.classList.add('hover');
  event.target.innerText = currentLetter === 1 ? "X" : "O";
}

function unHover(event) {
  event.target.classList.remove('hover');
  event.target.innerText = "";
}

function winner() {
  var test = 0;
  var letter = 1;
  for (var letter = 1; letter < 3; letter++) {
    for (var i = 1; i < 10; i++) {
      if (board[i][1] === letter && board[i][2] === letter && board[i][3] === letter) {
        test++;
        continue;
      }
      if (board[i][4] === letter && board[i][5] === letter && board[i][6] === letter) {
        test++;
        continue;
      }
      if (board[i][7] === letter && board[i][8] === letter && board[i][9] === letter) {
        test++;
        continue;
      }
      if (board[i][1] === letter && board[i][4] === letter && board[i][7] === letter) {
        test++;
        continue;
      }
      if (board[i][1] === letter && board[i][5] === letter && board[i][9] === letter) {
        test++;
        continue;
      }
      if (board[i][2] === letter && board[i][5] === letter && board[i][8] === letter) {
        test++;
        continue;
      }
      if (board[i][3] === letter && board[i][6] === letter && board[i][9] === letter) {
        test++;
        continue;
      }
      if (board[i][3] === letter && board[i][5] === letter && board[i][7] === letter) {
        test++;
        continue;
      }
    }
  }
  if (test === goal) {
    goal++;
    return true;
  }
  return false;
}

function metaWinner() {
  for (var letter = 1; letter < 3; letter++) {
    if (metaBoard[1] === letter && metaBoard[2] === letter && metaBoard[3] === letter) {
      overlay[0].classList.add('won');
      overlay[1].classList.add('won');
      overlay[2].classList.add('won');
      return true;
    }
    if (metaBoard[4] === letter && metaBoard[5] === letter && metaBoard[6] === letter) {
      overlay[3].classList.add('won');
      overlay[4].classList.add('won');
      overlay[5].classList.add('won');
      return true;
    }
    if (metaBoard[7] === letter && metaBoard[8] === letter && metaBoard[9] === letter) {
      overlay[6].classList.add('won');
      overlay[7].classList.add('won');
      overlay[8].classList.add('won');
      return true;
    }
    if (metaBoard[1] === letter && metaBoard[4] === letter && metaBoard[7] === letter) {
      overlay[0].classList.add('won');
      overlay[3].classList.add('won');
      overlay[6].classList.add('won');
      return true;
    }
    if (metaBoard[1] === letter && metaBoard[5] === letter && metaBoard[9] === letter) {
      overlay[0].classList.add('won');
      overlay[4].classList.add('won');
      overlay[8].classList.add('won');
      return true;
    }
    if (metaBoard[2] === letter && metaBoard[5] === letter && metaBoard[8] === letter) {
      overlay[1].classList.add('won');
      overlay[4].classList.add('won');
      overlay[7].classList.add('won');
      return true;
    }
    if (metaBoard[3] === letter && metaBoard[6] === letter && metaBoard[9] === letter) {
      overlay[2].classList.add('won');
      overlay[5].classList.add('won');
      overlay[8].classList.add('won');
      return true;
    }
    if (metaBoard[3] === letter && metaBoard[5] === letter && metaBoard[7] === letter) {
      overlay[2].classList.add('won');
      overlay[4].classList.add('won');
      overlay[6].classList.add('won');
      return true;
    }
  }
  var count = 0;
  for (var i = 1; i < 10; i++) {
    if (board[i].slice(1).every(value => value !== 0) || metaBoard[i] !== 0) {
      count++;
    }
  }
  if (count === 9) {
    return true;
  }
  return false;
}

function restoreWinner(thisBoard) {
  for (var letter = 1; letter < 3; letter++) {
    if (thisBoard[1] === letter && thisBoard[2] === letter && thisBoard[3] === letter) {
      return letter;
    }
    if (thisBoard[4] === letter && thisBoard[5] === letter && thisBoard[6] === letter) {
      return letter;
    }
    if (thisBoard[7] === letter && thisBoard[8] === letter && thisBoard[9] === letter) {
      return letter;
    }
    if (thisBoard[1] === letter && thisBoard[4] === letter && thisBoard[7] === letter) {
      return letter;
    }
    if (thisBoard[1] === letter && thisBoard[5] === letter && thisBoard[9] === letter) {
      return letter;
    }
    if (thisBoard[2] === letter && thisBoard[5] === letter && thisBoard[8] === letter) {
      return letter;
    }
    if (thisBoard[3] === letter && thisBoard[6] === letter && thisBoard[9] === letter) {
      return letter;
    }
    if (thisBoard[3] === letter && thisBoard[5] === letter && thisBoard[7] === letter) {
      return letter;
    }
  }
  return false;
}

function restore() {
  for (var i = 0; i < squares.length; i++) {
    if (board[Math.floor(i / 9) + 1][(i % 9) + 1] === 1) {
      squares[i].innerText = "X";
    } else if (board[Math.floor(i / 9) + 1][(i % 9) + 1] === 2) {
      squares[i].innerText = "O";
    }
  }
  var thisSquare = false;
  for (var i = 1; i < 10; i++) { // checking overlay wins
    thisSquare = restoreWinner(board[i]);
    if (thisSquare === 1) {
      overlay[i - 1].innerText = "X";
    } else if (thisSquare === 2) {
      overlay[i - 1].innerText = "O";
    }
  }
  if (overlay[thisId - 1].innerText === "" && !(board[thisId].slice(1).every(value => value !== 0))) { // if overlay square not decided
    overlay[thisId - 1].classList.add('focused');
    for (var i = (9 * (thisId - 1)); i < (9 * thisId); i++) { // if empty
      if (!(squares[i].innerText === "X" || squares[i].innerText === "O")) {
        squares[i].addEventListener('click', draw);
        squares[i].addEventListener('mouseover', hover);
        squares[i].addEventListener('mouseout', unHover);
      }
    }
  } else { // if overlay square already decided
    for (var i = 0; i < 81; i++) {
      if (!(overlay[Math.floor(i / 9)].innerText === "X" || overlay[Math.floor(i / 9)].innerText === "O") && !(board[Math.floor(i / 9) + 1].slice(1).every(value => value !== 0)) && squares[i].innerText === "") { // if overlay square is not decided AND square is not full AND square is empty
        squares[i].addEventListener('click', draw);
        squares[i].addEventListener('mouseover', hover);
        squares[i].addEventListener('mouseout', unHover);
      } 
    }
    for (var i = 0; i < 9; i++) { // add focus to all non decided squares
      if (overlay[i].innerText === "" && !(board[i + 1].slice(1).every(value => value !== 0))) {
        overlay[i].classList.add('focused');
      }
    }
  }
}