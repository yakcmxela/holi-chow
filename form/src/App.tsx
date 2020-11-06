import "firebase/functions";
import { HoliChow } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { PetForm } from "./containers";
import { Provider } from "react-redux";
import * as firebase from "firebase/app";
import React, { useEffect } from "react";

export const App = () => {
  const persistor = persistStore(HoliChow);
  if (process.env.NODE_ENV === "development") {
    // This stylesheet URL is subject to change, you might need to visit the
    // https://holi-chow.myshopify.com/ to pull the most recent theme.
    require("./styles/global.scss");
  }
  useEffect(() => {
    const config = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    };
    const app = firebase.initializeApp(config);
    if (process.env.NODE_ENV === "development") {
      app.functions().useFunctionsEmulator("http://localhost:5000");
    }
  }, []);
  return (
    <Provider store={HoliChow}>
      <PersistGate loading={null} persistor={persistor}>
        <PetForm />
      </PersistGate>
    </Provider>
  );
};
