import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { refreshTauriTitle } from './utils/tauriTitle'

refreshTauriTitle()

// biome-ignore lint/style/noNonNullAssertion: root
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
