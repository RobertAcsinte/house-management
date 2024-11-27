import {Action, combineReducers, configureStore, ThunkAction} from '@reduxjs/toolkit'
import usersSlice from "./features/users/usersSlice.ts";


export const store = configureStore({
    reducer: {
        user: usersSlice
    }
})

const rootReducer = combineReducers({
    user: usersSlice
})

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    })
}

export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk = ThunkAction<void, RootState, unknown, Action>

export default store;