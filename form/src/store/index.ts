import {
  // getDefaultMiddleware,
  configureStore,
  // AnyAction,
  combineReducers,
} from "@reduxjs/toolkit";
import { ProductsReducer } from "./reducers/products";
import { PetsReducer } from "./reducers/pets";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const config = {
  key: "root",
  storage,
};

const reducer = persistReducer(
  config,
  combineReducers({
    ProductsReducer,
    PetsReducer,
  })
);

// const logger = () => (next: any) => (action: AnyAction) => {
//   if (process.env.NODE_ENV === "development") {
//     console.log(`DISPATCHING: ${action.type}`);
//     console.log(`PAYLOAD: ${action.payload}`);
//   }
//   return next(action);
// };

const store = configureStore({
  reducer,
  // middleware: [...getDefaultMiddleware(), logger],
});

export const HoliChow = store;
