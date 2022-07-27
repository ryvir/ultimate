// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD7XMupC5pQ2OgVE5GIGugExTs7HciaT-U",
  authDomain: "ultimate-6806b.firebaseapp.com",
  databaseURL: "https://ultimate-6806b-default-rtdb.firebaseio.com",
  projectId: "ultimate-6806b",
  storageBucket: "ultimate-6806b.appspot.com",
  messagingSenderId: "739498014785",
  appId: "1:739498014785:web:5ee42474d9f7e22e23aec0"
});

var playerId, playerRef, gameRef, playerLetter, currentLetter, board, metaBoard, goal, squares, overlay, thisId, boardRef, turn, players;

document.onkeyup = e => {
  if (e.key === "Enter") {
    document.onkeyup = null;
    startGame();
  }
}

function checkPlayerNumber(s) {
  var result = 1;
  s.forEach(child => {
    if (child.val().letter == 1) {
      result = 2;
    }
  })
  return result;
}

function getVars(snapshot) {
  currentLetter = snapshot.val().currentLetter;
  board = snapshot.val().board.split(',');
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
  metaBoard = snapshot.val().metaBoard.split(',');
  for (var i = 0; i < metaBoard.length; i++) {
    metaBoard[i] = parseInt(metaBoard[i]);
  }
  goal = parseInt(snapshot.val().goal);
  thisId = parseInt(snapshot.val().thisId);
  squares = Array.from(document.querySelectorAll('.square'));
  overlay = Array.from(document.querySelectorAll('.overlay'));
}

function startGame() {
  var codeInput = document.querySelector('#code-input');
  var code, newCode;
  if (codeInput.value) {
    code = codeInput.value.toLowerCase();
    if (!(code.length == 4)) {
      codeInput.value = "";
      codeInput.placeholder = "Must have 4 letters."
      document.onkeyup = e => {
        if (e.key === "Enter") {
          document.onkeyup = null;
          startGame();
        }
      }
      return;
    }
    newCode = false;
  } else {
    code = String.fromCharCode(97+Math.floor(Math.random() * 26), 97+Math.floor(Math.random() * 26), 97+Math.floor(Math.random() * 26), 97+Math.floor(Math.random() * 26));
    newCode = true;
  }
  firebase.auth().signInAnonymously();
  firebase.auth().onAuthStateChanged(user => {
    let i = 0;
    firebase.database().ref('games').once('value', snapshot => {
      snapshot.forEach(game => {
        if (!game.val().players) {
          firebase.database().ref(`games/${game.key}`).remove();
        } else {
          if (game.key === code && newCode === true) i++;
        }
      })
    })
    if (i === 2) startGame();

    playerId = user.uid;
    gameRef = firebase.database().ref(`games/${code}`);
    boardRef = firebase.database().ref(`games/${code}/board`);
    players = firebase.database().ref(`games/${code}/players`);
    playerRef = firebase.database().ref(`games/${code}/players/${playerId}`);

    playerRef.set({
      id: playerId
    })

    playerRef.onDisconnect().remove();

    players.once("value").then(snapshot => {
      if (snapshot.numChildren() === 3) {
        codeInput.value = "";
        codeInput.placeholder = "Game is full."
        firebase.database().ref(`games/${code}/players/${playerId}`).remove();
        return;
      } else if (snapshot.numChildren() == 2) {
        playerLetter = checkPlayerNumber(snapshot);
        playerRef.update({ letter: playerLetter });
        document.querySelector("#code").remove();
        turn = document.querySelector('#turn');
        turn.innerText = "Opponent's " + turn.innerText;
        if (window.innerWidth < window.innerHeight) {
          turn.style.display = "block";
        }
        setUp();
        boardRef.on("value", snap => {
          getVars(snap);
          restore(snap.val().currentLetter == playerLetter);
        })
      } else if (snapshot.numChildren() == 1) {
        if (!newCode) {
          codeInput.value = "";
          codeInput.placeholder = "Code does not exist."
          gameRef.remove();
          document.onkeyup = e => {
            if (e.key === "Enter") {
              document.onkeyup = null;
              startGame();
            }
          }
          return;
        }
        playerRef.update({ letter: 1 });
        playerLetter = 1;
        boardRef.set({ // initialize variables in Firebase
          currentLetter: 1,
          metaBoard: "0,0,0,0,0,0,0,0,0,0",
          board: "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
          goal: 1,
          thisId: 1,
          gameOver: false
        })
        document.querySelector("#code").innerText = `Code: ${code}\n\nWaiting for another player...`;
        players.on("child_added", (snapshot) => {
          if (snapshot.val().id != playerId) {
            if (document.querySelector("#code")) document.querySelector("#code").remove();
            turn = document.querySelector('#turn');
            turn.innerText = "Your " + turn.innerText;
            if (window.innerWidth < window.innerHeight) turn.style.display = "block";
            players.off("value");
            boardRef.on("value", snap => {
              if (snap.val().currentLetter == playerLetter) {
                getVars(snap);
                if (!(snap.val().board == "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0")) {
                  restore();
                }
              }
            })
            setUp();
          }
        })
      }
    });
  })
}

function setUp() {
  boardRef.once('value', snapshot => {
    getVars(snapshot);
    if (playerLetter == currentLetter) {
      for (var i = 0; i < squares.length; i++) {
        squares[i].addEventListener('click', draw);
        squares[i].addEventListener('mouseover', hover);
        squares[i].addEventListener('mouseout', unHover);
      }
    }
  })
  
}

function draw(event) {
  event.target.classList.remove('hover');
  // add letter after click
  if (currentLetter === 1) {
    event.target.innerText = "X";
  } else if (currentLetter === 2) {
    event.target.innerText = "O";
  }
  squares.forEach(index => {
    index.removeEventListener('click', draw);
    index.removeEventListener('mouseover', hover);
    index.removeEventListener('mouseout', unHover);
  })
  var thisId = event.target.id[5];
  var parentId = event.target.parentElement.id[3];
  board[parentId][thisId] = currentLetter;
  if (winner()) {
    if (currentLetter === 1) {
      overlay[parentId - 1].innerText = "X";
      metaBoard[parentId] = 1;
    } else if (currentLetter === 2) {
      overlay[parentId - 1].innerText = "O";
      metaBoard[parentId] = 2;
    }
  }

  overlay.forEach(index => {
    index.classList.remove('focused');
  })

  currentLetter = currentLetter === 1 ? 2 : 1;

  turn.innerText = "Opponent's turn.";

  if (metaWinner()) turn.style.display = "none";

  boardRef.update({
    currentLetter: currentLetter,
    metaBoard: metaBoard.toString(),
    board: board.toString(),
    goal: goal,
    thisId: thisId
  })
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

function restore(turn=true) {
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
  if (metaWinner()) {
    document.querySelector("#turn").style.display = 'none';
    return;
  }
  if (turn) {
    document.querySelector("#turn").innerText = "Your turn.";
    if (overlay[thisId - 1].innerText === "" && !(board[thisId].slice(1).every(value => value !== 0))) { // if overlay square not decided
      overlay[thisId - 1].classList.add('focused');
      for (var i = (9 * (thisId - 1)); i < (9 * thisId); i++) { // go through the applicable square
        if (!(squares[i].innerText === "X" || squares[i].innerText === "O")) { // if empty
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
}