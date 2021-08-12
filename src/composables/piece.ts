export interface Position {
  x: number
  y: number
}

export interface Piece {
  pos: Position
  spawned: boolean
  moveRule: MoveFunction
}

export type MoveFunction = (from: Position, to: Position) => boolean

export const usePiece = (moveRule: MoveFunction) => {
  return {
    pos: { x: 0, y: 0 },
    spawned: false,
    moveRule
  } as Piece
}

export const initPiece = (target: Piece, spawnedPosition: Position) => {
  target.pos = spawnedPosition
  target.spawned = true
  return true
}

export const movePiece = (target: Piece, to: Position) => {
  if (target.moveRule(target.pos, to)) {
    target.pos = to
    return true
  }
  return false
}

export const checkSamePosition = (a: Position, b: Position) => a.x === b.x && a.y === b.y
