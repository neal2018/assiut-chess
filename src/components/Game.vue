<template>
  <div class="flex flex-row">
    <div class="m-auto">
      <div class="row p-0 m-0" v-for="(_, row) in rows" :key="row">
        <button
          v-for="(_, col) in columns"
          :key="col"
          class="cell h-10 w-10 m-0 text-2xl font-bold align-bottom focus:outline-none"
          :class="getCellStyle({ x: row, y: col })"
          @click="clickCell({ x: row, y: col })"
        >
          {{ queen.spawned && checkSamePosition(queen.pos, { x: row, y: col }) ? "Q" : "" }}
        </button>
      </div>
    </div>
  </div>
  <p v-if="queen.spawned">Queen moved {{ queenMoveCount }}/{{ queenMoveLimit }} steps</p>
  <p>{{ previousKingMoveString }}</p>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { usePiece, movePiece, checkSamePosition, Position, initPiece, Piece } from "@/composables/piece"

const rows = 8
const columns = 8
const queenMoveLimit = 100
const beforePlacingQueen = "Waiting for placing Queen..."

const directions = [
  { pos: { x: 1, y: 0 }, description: "Down" },
  { pos: { x: 0, y: 1 }, description: "Right" },
  { pos: { x: -1, y: 0 }, description: "Up" },
  { pos: { x: 0, y: -1 }, description: "Left" },
  { pos: { x: 1, y: 1 }, description: "Down-Right" },
  { pos: { x: -1, y: 1 }, description: "Up-Right" },
  { pos: { x: -1, y: -1 }, description: "Up-Left" },
  { pos: { x: 1, y: -1 }, description: "Down-Left" }
]

const previousKingMoveString = ref(beforePlacingQueen)
const queenMoveCount = ref(0)

const getCellStyle = (pos: Position) => {
  if (!queen.spawned || queen.moveRule(queen.pos, pos)) {
    return "bg-yellow-200"
  } else if (checkSamePosition(queen.pos, king.pos) && checkSamePosition(queen.pos, pos)) {
    return "bg-blue-200 cursor-default"
  } else {
    return "bg-white cursor-default"
  }
}

const queen = reactive(
  usePiece((from, to) => {
    if (checkSamePosition(from, to)) {
      return false
    }
    if (Math.abs(from.x - to.x) === Math.abs(from.y - to.y) || from.x === to.x || from.y === to.y) {
      return true
    }
    return false
  })
)

const king = usePiece((from, to) => {
  const diffX = Math.abs(from.x - to.x)
  const diffY = Math.abs(from.y - to.y)
  if ((diffX === 1 && diffY === 0) || (diffX === 0 && diffY === 1) || (diffX === 1 && diffY === 1)) {
    return true
  }
  return false
})

const clickCell = (pos: Position) => {
  if (queen.spawned === false) {
    initPiece(queen, pos)
    initPieceRandomly(king)
    while (checkSamePosition(queen.pos, king.pos)) {
      initPieceRandomly(king)
    }
    previousKingMoveString.value = "King Spawned"
  } else {
    playerMove(pos)
  }
}

const playerMove = (pos: Position) => {
  if (checkInsideBoard(pos) && movePiece(queen, pos)) {
    queenMoveCount.value++
    checkWin() || checkLose() || randomMoveKing()
  }
}

const checkWin = () => {
  if (checkSamePosition(queen.pos, king.pos)) {
    setTimeout(() => {
      alert("King is killed. You win!")
      restartGame()
    })
    return true
  }
  return false
}

const checkLose = () => {
  if (queenMoveCount.value >= queenMoveLimit) {
    setTimeout(() => {
      alert("Time's up. You lose!")
      restartGame()
    })
    return true
  }
  return false
}

const checkInsideBoard = (pos: Position) => {
  return pos.x >= 0 && pos.x < rows && pos.y >= 0 && pos.y < columns
}

const initPieceRandomly = (piece: Piece) => {
  const pos = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * columns) }
  initPiece(piece, pos)
}

const getRandomDirection = () => {
  const targetPosition = directions.filter((d) =>
    ((pos) => checkInsideBoard(pos) && !checkSamePosition(queen.pos, pos))({
      x: king.pos.x + d.pos.x,
      y: king.pos.y + d.pos.y
    })
  )
  return targetPosition[Math.floor(Math.random() * targetPosition.length)]
}

const randomMoveKing = () => {
  const d = getRandomDirection()
  const pos = { x: king.pos.x + d.pos.x, y: king.pos.y + d.pos.y }
  movePiece(king, pos)
  previousKingMoveString.value = "King moved " + d.description
}

const restartGame = () => {
  queen.spawned = false
  queenMoveCount.value = 0
  king.spawned = false
  previousKingMoveString.value = beforePlacingQueen
}
</script>

<style scoped lang="postcss">
.cell {
  border: 1px solid gray;
  border-right: none;
  border-bottom: none;
}
.cell:last-child {
  border-right: 1px solid gray;
}
.row:last-child {
  border-bottom: 1px solid gray;
}
</style>
