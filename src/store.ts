import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit'
import userReducer from './redux/userSlice.ts'


export const store = configureStore({
    reducer: {
        user: userReducer
    }
})

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk = ThunkAction<void, RootState, unknown, Action>

export default store;