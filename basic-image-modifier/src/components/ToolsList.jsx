import PropTypes from 'prop-types'

export function ToolsList ({ setToolSelected, tools = [], toolSelected }) {
  return (
    <ul>
      {
        tools.map(({ name }) => (
          <li key={name}>
            <button
              onClick={() => { setToolSelected(name) }}
              style={{ backgroundColor: name !== toolSelected && 'transparent', borderRadius: '15px' }}
            >{name}</button>
          </li>
        ))
      }
    </ul>
  )
}

ToolsList.propTypes = {
  setToolSelected: PropTypes.func,
  tools: PropTypes.arrayOf(PropTypes.object),
  toolSelected: PropTypes.string.isRequired
}
