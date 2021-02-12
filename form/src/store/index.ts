import {
  // getDefaultMiddleware,
  configureStore,
  // AnyAction,
  combineReducers,
} from '@reduxjs/toolkit';
import { ProductsReducer } from './reducers/products';
import { PetsReducer } from './reducers/pets';

const reducer = combineReducers({
  ProductsReducer,
  PetsReducer,
});

const store = configureStore({
  reducer,
});

export const HoliChow = store;
