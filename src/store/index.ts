import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>

export const store = configureStore({
    reducer: {
        user: userSlice
    }
})