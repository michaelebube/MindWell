import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string,
  };


  const app = initializeApp(firebaseConfig);

 
  const auth = getAuth(app);
  const firestore = getFirestore(app);


   console.log('Firebase initialized');

  return {
    provide: {
      auth,
      firestore,
    },
  };
});