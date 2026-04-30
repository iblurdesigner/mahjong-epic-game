# Tile Matching Specification

## Purpose

Core game mechanic for Mahjong Epic — select two matching tiles to remove them from the board when both are unlocked.

## Requirements

### Requirement: Exact Symbol Match

The system MUST select exactly two tiles that share the exact same symbol (suit + number/letter) to consider a valid match. Partial matches or different symbols SHALL NOT be removed.

#### Scenario: Valid Match Removed

- GIVEN two unlocked tiles with identical suit and number/letter
- WHEN player taps first tile, then taps second tile
- THEN both tiles are removed from the board
- AND score increases by 10 points

#### Scenario: Invalid Match Rejected

- GIVEN first tile selected with symbol "Bamboo-3"
- WHEN player taps second tile with symbol "Character-3"
- THEN second tile selection is rejected
- AND first tile remains selected for new attempt

#### Scenario: Same Tile Selection Rejected

- GIVEN tile at position (row, col, layer) is selected
- WHEN player taps the same tile again
- THEN selection is rejected
- AND no tiles are marked as selected

### Requirement: Selection Visual Feedback

The system MUST display visual feedback on selected tiles. A selected tile SHALL display a highlighted border using Celestial Jade accent color.

#### Scenario: First Tile Selection

- GIVEN no tiles currently selected
- WHEN player taps an unlocked tile
- THEN tile displays selection highlight
- AND tile is marked as first selection

#### Scenario: Deselect After Invalid Match

- GIVEN first tile selected
- WHEN player taps a locked or blocked second tile
- THEN selection is cleared
- AND first selection highlight is removed