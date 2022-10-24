import { checkWin, getTimePast } from '../../helpers'
import store from '../../store'
import { visibleMoves } from '../infoPanel/infoPanel'
import './field.scss'

const renderField = () => {
  const canvas = document.createElement('canvas')
  canvas.id = 'field'
  return canvas
}
function getEmptyCell(item) {
  const dataPosition = store.getField()
  if (item) {
    const emptyCell = (dataPosition[item.row]?.[item.col + 1] === 0 && {
      row: item.row,
      col: item.col + 1,
    }) || (dataPosition[item.row]?.[item.col - 1] === 0 && {
      row: item.row,
      col: item.col - 1,
    }) || (dataPosition[item.row - 1]?.[item.col] === 0 && {
      row: item.row - 1,
      col: item.col,
    }) || (dataPosition[item.row + 1]?.[item.col] === 0 && {
      row: item.row + 1,
      col: item.col,
    })
    return emptyCell
  }
  return null
}
function stillOnHovered(clientX, clientY, celSize, hoveredItem) {
  return (
    hoveredItem && clientX > hoveredItem.x
    && clientX < hoveredItem.x + celSize
    && clientY > hoveredItem.y
    && clientY < hoveredItem.y + celSize
  )
}

function getCords(matrix, size) {
  const result = []
  for (let i = 0; i < matrix.length; i += 1) {
    for (let j = 0; j < matrix.length; j += 1) {
      result.push({
        row: i, col: j, x: j * size, y: i * size,
      })
    }
  }
  return result
}

export function fieldHandler() {
  const dataPosition = store.getField()
  const canvas = document.getElementById('field')
  const container = document.querySelector('.container')
  const context = canvas.getContext('2d')
  let width = container.clientWidth - 10
  const audio = new Audio('./assets/audio/puzzle-15_audio_move.mp3')

  canvas.width = width
  canvas.height = width

  let hoveredItem = null
  let movedItem = null
  let shiftX = 0
  let shiftY = 0
  let delta = -1

  let celCount = store.getSize()
  let celSize = width / celCount
  let coords = getCords(dataPosition, celSize)
  let movement = false
  window.addEventListener('resize', () => {
    width = container.clientWidth - 10
    canvas.width = width
    canvas.height = width
    celSize = width / celCount
  })

  function drawPlayField() {
    const dataField = store.getField()
    celCount = store.getSize()
    celSize = width / celCount
    coords = getCords(dataField, celSize)

    context.clearRect(0, 0, width, width)

    for (let row = 0; row < dataField.length; row += 1) {
      for (let col = 0; col < dataField[row].length; col += 1) {
        const dx = col * celSize
        const dy = row * celSize

        if (dataField[row][col]) {
          context.beginPath()

          if (hoveredItem && hoveredItem.x === dx && hoveredItem.y === dy) {
            context.fillStyle = 'yellow'
          } else {
            context.fillStyle = 'white'
          }

          if (movedItem && movedItem.x === dx && movedItem.y === dy) {
            shiftX = shiftX ? shiftX + delta : 0
            shiftY = shiftY ? shiftY + delta : 0
            if (shiftX > celSize || shiftY > celSize || shiftX < -celSize || shiftY < -celSize) {
              delta = 0
            }

            context.rect(dx + shiftX, dy + shiftY, celSize, celSize)
            context.fill()
            context.font = `${celSize / 2}px monospace`
            context.fillStyle = 'black'
            context.textAlign = 'left'
            context.textBaseline = 'top'

            const txt = dataField[row][col]
            const measuredText = context.measureText(txt)
            const offset = celSize - measuredText.width

            context.fillText(
              dataField[row][col],
              dx + shiftX + offset / 2,
              dy + shiftY + celSize / 4,
            )
          } else {
            context.rect(dx, dy, celSize, celSize)
            context.fill()
            context.font = `${celSize / 2}px monospace`
            context.fillStyle = 'black'
            context.textAlign = 'left'
            context.textBaseline = 'top'

            const txt = dataField[row][col]
            const measuredText = context.measureText(txt)
            const offset = celSize - measuredText.width

            context.fillText(dataField[row][col], dx + offset / 2, dy + celSize / 4)
          }

          context.strokeStyle = 'red'
          context.lineWidth = 5
          context.stroke()
          context.strokeStyle = 'black'
          context.lineWidth = 1
          context.stroke()
        }
      }
    }
    requestAnimationFrame(drawPlayField)
  }
  drawPlayField()

  function getHoveredItem(clientX, clientY) {
    return coords.find(
      (c) => clientX > c.x && clientX < c.x + celSize && clientY > c.y && clientY < c.y + celSize,
    )
  }
  canvas.addEventListener('mousemove', (e) => {
    const clientX = e.offsetX
    const clientY = e.offsetY
    if (stillOnHovered(clientX, clientY, celSize, hoveredItem)) {
      return
    }
    hoveredItem = getHoveredItem(clientX, clientY)
  })

  canvas.addEventListener('mouseout', () => {
    hoveredItem = null
  })

  function checkWinner() {
    if (store.getAudio()) {
      audio.play()
    }

    visibleMoves(1)
    if (checkWin(store.getField(), store.getWinField())) {
      const winMessage = document.createElement('div')
      winMessage.id = 'winMessage'
      winMessage.innerHTML = `Ура! Вы решили головоломку за ${getTimePast(
        store.getTimeStart(),
      )} и ${store.getMoves()} ходов!`
      document.body.append(winMessage)
      window.setTimeout(() => {
        if (store.getTimeStart()) {
          const name = window.prompt('Write your name?', 'name')
          store.addToWinList(name)
        }
        winMessage.remove()
      }, 2000)
    }
  }
  canvas.addEventListener('click', (e) => {
    if (!movement) {
      e.preventDefault()
      movement = true
      const clientX = e.offsetX
      const clientY = e.offsetY

      movedItem = getHoveredItem(clientX, clientY)
      const emptyCell = getEmptyCell(movedItem)
      if (emptyCell) {
        if (emptyCell.row < movedItem.row && emptyCell.col === movedItem.col) {
          shiftY = -1
          shiftX = 0
          delta = -celSize / 6
        }
        if (emptyCell.row === movedItem.row && emptyCell.col > movedItem.col) {
          shiftX = 1
          delta = celSize / 6
          shiftY = 0
        }
        if (emptyCell.row > movedItem.row && emptyCell.col === movedItem.col) {
          shiftY = 1
          shiftX = 0
          delta = celSize / 6
        }
        if (emptyCell.row === movedItem.row && emptyCell.col < movedItem.col) {
          shiftX = -1
          shiftY = 0
          delta = -celSize / 6
        }

        setTimeout(() => {
          shiftX = 0
          shiftY = 0
          delta = 0
          store.changeField(emptyCell, movedItem)
          hoveredItem = null
          checkWinner()
          movement = false
        }, celSize)
      }
    }
  })

  canvas.addEventListener('mousedown', (e) => {
    canvas.ondragstart = () => false

    const clientX = e.offsetX
    const clientY = e.offsetY
    movedItem = getHoveredItem(clientX, clientY)
    const emptyCell = getEmptyCell(movedItem)

    function onMouseMove(element) {
      element.preventDefault()
      element.stopPropagation()

      if (emptyCell && emptyCell.row < movedItem.row && emptyCell.col === movedItem.col) {
        shiftY = element.offsetY - clientY
        if (shiftY <= -celSize) {
          shiftY = -celSize
        }
        if (shiftY >= 0) {
          shiftY = 0
        }
      }
      if (emptyCell.row === movedItem.row && emptyCell.col > movedItem.col) {
        shiftX = element.offsetX - clientX
        if (shiftX >= celSize) {
          shiftX = celSize
        }
        if (shiftX <= 0) {
          shiftX = 0
        }
      }
      if (emptyCell.row > movedItem.row && emptyCell.col === movedItem.col) {
        shiftY = element.offsetY - clientY
        if (shiftY >= celSize) {
          shiftY = celSize
        }
        if (shiftY <= 0) {
          shiftY = 0
        }
      }
      if (emptyCell.row === movedItem.row && emptyCell.col < movedItem.col) {
        shiftX = element.offsetX - clientX
        if (shiftX <= -celSize) {
          shiftX = -celSize
        }
        if (shiftX >= 0) {
          shiftX = 0
        }
      }
      if (Math.abs(shiftX) > 5 || Math.abs(shiftY) > 5) {
        setTimeout(() => {
          movement = true
        }, 10)
      }
    }
    document.addEventListener('mousemove', onMouseMove)

    window.onmouseup = () => {
      document.removeEventListener('mousemove', onMouseMove)

      if (Math.abs(shiftX) > celSize / 2 || Math.abs(shiftY) > (celSize / 3) * 2) {
        store.changeField(emptyCell, movedItem)
        movedItem = null
        checkWinner()
      }

      setTimeout(() => {
        movement = false
      }, 10)

      shiftX = 0
      shiftY = 0
      movedItem = null
    }
  })
}

export default renderField
