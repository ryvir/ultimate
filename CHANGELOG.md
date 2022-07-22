# Version History

# 3.2
- Add functionality to remove empty games from Firebase.
- Add functionality to join back to a multiplayer game.
- Fix bug where the same multiplayer code could be generated again.
- Fix bug where a third player is allowed in multiplayer.
- Remove local storage in multiplayer.
- Add "enter" keybind in multiplayer.

# 3.1
- Separate create and enter code for multiplayer.
- Rename multiplayer "player" to "device".

## 3.0
- Add multidevice functionality.
- Store data in Firebase.
- Create new files for multiplayer and singleplayer.
- Create home page.

## 2.6
- Clean up UI.

## 2.5
- Shift grid down to 40%.
- Fix bug where O shows up on first turn.

## 2.4
- Add a dark mode.
- Change color mode based on system settings.
- Add functionality to remove turn indicator when game is over.

## 2.3
- Add gray letter on mouse over feature.
- Add turn indicator on mobile.
- Remove restart button.

## 2.2.1
- Fix bug where stalemate does not end the game.

## 2.2
- Fix bug where stalemate squares are focused to play again.
- Fix bug where stalemate squares are not recognized on restore.
- Add functionality to add focus to all non-decided squares when corresponding square is decided.
- Change JS load type to defer.

## 2.1.2
- Fix bug where a win in a square in two ways does not register.

## 2.1.1
- Fix bug where focus squares show after win.

## 2.1
- Add restart button.

## 2.0
- Store all data in browser local storage.
- Add functionality to restore ongoing game on reload or tab close.
- Reload clears board after game is over.

## 1.1
- Fix bug where play goes back to already decided squares.

## 1.0.1
- Fix bug where already filled squares can be overidden.

## 1.0
- Initial release.
- Functional Ultimate Tic-Tac-Toe game.