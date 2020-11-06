import { HoliChow } from "../store";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "@reduxjs/toolkit";

export type HoliDispatch = typeof HoliChow.dispatch;
export type RootState = ReturnType<typeof HoliChow.getState>;
export type HoliThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
