import './container.scss'
import buttonsPanel from '../buttonsPanel/buttonsPanel'
import renderField from '../field/field'
import infoPanel from '../infoPanel/infoPanel'
import sizePanel from '../sizePanel/sizePanel'

const container = () => {
  const div = document.createElement('div')
  div.className = 'container'
  div.append(buttonsPanel())
  div.append(infoPanel())
  div.append(renderField())
  div.append(sizePanel())
  return div
}

export default container
