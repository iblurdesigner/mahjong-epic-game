# Pause/Resume Specification

## Purpose

Freeze and unfreeze game state without losing progress — board state, selected tiles, timer, and score remain intact during pause.

## Requirements

### Requirement: Pause State

The system MUST enter "paused" state when player taps pause button. During pause, the game board and timer SHALL be frozen. Player MUST NOT be able to select tiles while paused.

#### Scenario: Pause Freezes Game

- GIVEN active game with tiles on board
- WHEN player taps pause button
- THEN game enters "paused" state
- AND board becomes non-interactive
- AND timer stops counting

#### Scenario: Tile Selection Blocked While Paused

- GIVEN game is paused
- WHEN player taps any tile
- THEN tile selection is rejected
- AND visual feedback indicates game is paused

### Requirement: Resume State

The system MUST restore exact game state when player taps resume. Timer MUST continue from paused value, selected tiles MUST remain selected.

#### Scenario: Resume Restores State

- GIVEN paused game with tile A selected
- WHEN player taps resume
- THEN game returns to active state
- AND tile A remains selected
- AND timer continues from paused value

#### Scenario: Resume Accessible

- GIVEN game is paused
- WHEN player taps resume button
- THEN game resumes immediately
- AND board becomes interactive again

### Requirement: Pause UI Display

The system SHOULD display a pause overlay or modal that clearly indicates game is paused, with resume button prominently visible.

#### Scenario: Pause Overlay Visible

- GIVEN game is paused
- THEN a modal/overlay displays
- AND "PAUSA" title shows
- AND "Continuar" button is visible (64px minimum touch target)