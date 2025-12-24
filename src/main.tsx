import { render } from 'preact'
import App from './App'
import './index.css'

// biome-ignore lint/style/noNonNullAssertion: root
render(<App />, document.getElementById('root')!)
