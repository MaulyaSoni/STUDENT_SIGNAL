// Font Awesome configuration for Next.js
// This prevents Font Awesome from auto-adding CSS which causes hydration issues
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false
