import { getTimePast } from './helpers'

let dataPosition = []
const data = {
  game: null,
  audio: true,
  timeStart: null,
  moves: 0,
  size: 4,
  results: [],
  winField: [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0],
  ],
  winList: {
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
  },
}

const getGame = () => data.game
const setGame = (action) => {
  data.game = action
}
const getMoves = () => data.moves
const getAudio = () => data.audio
const setAudio = (action) => {
  data.audio = action
}
const setMoves = (action) => {
  if (!action) {
    data.moves = 0
  } else {
    data.moves += action
  }
}
const getTimeStart = () => data.timeStart
const setTimeStart = (action) => {
  data.timeStart = action
}

const getField = () => dataPosition
const getSize = () => data.size
const setSize = (n) => {
  data.size = n
}
const getResults = () => data.results
const setField = (matrix) => {
  dataPosition = matrix
}
const changeField = (emptyCell, hoveredItem) => {
  const currentN = dataPosition[hoveredItem.row][hoveredItem.col]
  dataPosition[hoveredItem.row][hoveredItem.col] = 0
  dataPosition[emptyCell.row][emptyCell.col] = currentN
}
const getWinField = () => data.winField
const setWinField = (arr) => {
  data.winField = arr
}
const getWinList = () => data.winList[data.size]

const setWinList = (obj) => {
  data.winList = obj
}
const addToWinList = (name) => {
  if (name) {
    const winListForSize = data.winList[data.size]
    const obj = {
      name,
      timeMs: Date.now() - data.timeStart,
      time: getTimePast(data.timeStart),
      moves: data.moves,
    }
    if (winListForSize.length < 10) {
      data.winList[data.size] = winListForSize.concat(obj)
    } else {
      const arrForSort = winListForSize.concat(obj).sort((a, b) => {
        if (a.moves > b.moves) return 1
        if (a.moves < b.moves) return -1
        if (a.timeMs > b.timeMs) return 1
        if (a.timeMs < b.timeMs) return -1
        return 1
      })
      arrForSort.pop()
      data.winList[data.size] = arrForSort
    }
    localStorage.setItem('setWinListSaveObject', JSON.stringify(data.winList))
  }
}

const store = {
  getField,
  getMoves,
  getTimeStart,
  getSize,
  setSize,
  getResults,
  setField,
  setMoves,
  setTimeStart,
  setWinField,
  changeField,
  getWinField,
  getWinList,
  setWinList,
  addToWinList,
  getAudio,
  setAudio,
  getGame,
  setGame,
}
export default store
