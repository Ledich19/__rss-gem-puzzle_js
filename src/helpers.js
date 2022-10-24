function toArray(matrix) {
  return matrix.flat(1)
}
export function toMatrix(arr) {
  const count = Math.sqrt(arr.length)
  const result = []
  for (let i = 0; i < count; i += 1) {
    const elemI = []
    for (let j = 0; j < count; j += 1) {
      elemI.push(arr[i * count + j])
    }
    result.push(elemI)
  }
  return result
}
// * create structure matrix size 2 => [[1,2],[3,0]]
export function createWinFieldArr(size) {
  const arrSize = size * size
  const newArr = Array(arrSize).fill('')
  for (let i = 0; i < arrSize; i += 1) {
    newArr[i] = i === arrSize - 1 ? 0 : i + 1
  }
  return newArr
}
// !rename to check winner
export function checkWin(fieldMatrix, winArr) {
  const fieldArr = toArray(fieldMatrix)
  for (let i = 0; i < winArr.length; i += 1) {
    if (fieldArr[i] !== winArr[i]) {
      return false
    }
  }
  return true
}
// * shuffle matrix
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
function getEmptyElement(matrix) {
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix.length; j += 1) {
      if (matrix[i][j] === 0) {
        return { row: i, col: j }
      }
    }
  }
  return null
}
export function shuffleMatrix(size) {
  const matrix = toMatrix(createWinFieldArr(size))
  const times = getRandomInt(100, 10000)

  for (let i = 0; i < times; i += 1) {
    const random = getRandomInt(1, 5)
    const index0 = getEmptyElement(matrix)

    const positions = {
      1: matrix[index0.row - 1]?.[index0.col] && {
        row: index0.row - 1,
        col: index0.col,
      },
      2: matrix[index0.row + 1]?.[index0.col] && {
        row: index0.row + 1,
        col: index0.col,
      },
      3: matrix[index0.row]?.[index0.col - 1] && {
        row: index0.row,
        col: index0.col - 1,
      },
      4: matrix[index0.row]?.[index0.col + 1] && {
        row: index0.row,
        col: index0.col + 1,
      },
    }
    if (positions[random]) {
      const currentN = matrix[positions[random].row][positions[random].col]
      matrix[positions[random].row][positions[random].col] = 0
      matrix[index0.row][index0.col] = currentN
    }
  }
  return matrix
}
// * for time
// * get zero for one number example 1 => 01
export function getZero(num) {
  if (num >= 0 && num < 10) {
    return `0${num}`
  }
  return num
}
export function getTimePast(timeStart) {
  if (timeStart && timeStart > 0) {
    const time = new Date(Date.now() - timeStart)
    return `${getZero(time.getMinutes())}:${getZero(time.getSeconds())}`
  }
  return '00:00'
}
