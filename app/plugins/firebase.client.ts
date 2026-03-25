import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

// Set to true to use emulators, false for production
const USE_EMULATORS = false

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string,
  }

  const app = initializeApp(firebaseConfig)

  const appCheckSiteKey = config.public.firebaseAppCheckSiteKey as string | undefined
  if (appCheckSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    })
  }

  const auth = getAuth(app)
  const firestore = getFirestore(app)
  const functions = getFunctions(app)

  // Connect to local emulators only if enabled
  if (USE_EMULATORS && import.meta.env.DEV) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
    connectFirestoreEmulator(firestore, 'localhost', 8080)
    connectFunctionsEmulator(functions, 'localhost', 5001)
    console.log('Connected to Firebase emulators')
  }

  return {
    provide: {
      auth,
      firestore,
      functions,
    },
  }
})
