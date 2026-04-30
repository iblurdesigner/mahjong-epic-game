# Tile Unlock Rules Specification

## Purpose

Define when a Mahjong tile is selectable — a tile is only selectable when uncovered from above AND has at least one open side (left or right).

## Requirements

### Requirement: Tile Unlocked Conditions

A tile MUST be selectable only when BOTH conditions are met: (1) no tile exists directly above at same column/row position in the layer immediately above, AND (2) either the left side OR the right side is not blocked by another tile.

#### Scenario: Top-Covered Tile Locked

- GIVEN tile T1 at layer 1, row 5, col 5
- AND tile T2 at layer 2, row 5, col 5 (directly above T1)
- WHEN player taps T1
- THEN T1 is NOT selectable
- AND visual feedback shows tile as blocked (grayed overlay)

#### Scenario: Fully Blocked Sides Locked

- GIVEN tile T1 at row 5, col 5, layer 1
- AND tile at row 5, col 4 (left blocked)
- AND tile at row 5, col 6 (right blocked)
- AND no tile above T1
- WHEN player taps T1
- THEN T1 is NOT selectable

#### Scenario: Left Side Free

- GIVEN tile T1 at row 5, col 5, layer 1
- AND tile at row 5, col 6 blocks right side
- AND no tile above T1
- AND position row 5, col 4 is empty
- WHEN player taps T1
- THEN T1 IS selectable
- AND highlight displays normally

#### Scenario: Right Side Free

- GIVEN tile T1 at row 5, col 5, layer 1
- AND tile at row 5, col 4 blocks left side
- AND no tile above T1
- AND position row 5, col 6 is empty
- WHEN player taps T1
- THEN T1 IS selectable
- AND highlight displays normally

### Requirement: Adjacent Tile Detection

The system SHALL calculate blocked sides by checking if adjacent column positions contain tiles at the same row and layer.

#### Scenario: Edge Column Leftmost

- GIVEN tile at col 0 (leftmost edge)
- WHEN checking left side blocked
- THEN left side is considered blocked (edge acts as wall)

#### Scenario: Edge Column Rightmost

- GIVEN tile at col 12 (rightmost edge)
- WHEN checking right side blocked
- THEN right side is considered blocked (edge acts as wall)