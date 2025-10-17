import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'

import { createRouter } from './router'
import { initSentry } from './sentry'

// Initialize Sentry (will be skipped if DSN is not defined)
initSentry()

const router = createRouter()

hydrateRoot(
  document,
  <StartClient router={router} />
)
