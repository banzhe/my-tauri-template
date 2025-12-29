import { getCurrentWindow } from '@tauri-apps/api/window'
import pkg from '../../package.json'

export function refreshTauriTitle() {
	const currentVersion = pkg.version
	const window = getCurrentWindow()
	if (import.meta.env.DEV) {
		window.setTitle(`${pkg.name} v${currentVersion} (dev)`)
	} else {
		window.setTitle(`${pkg.name} v${currentVersion}`)
	}
}
