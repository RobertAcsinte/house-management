import {createSlice, isAnyOf} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../../withTypes.ts";
import {
    browserLocalPersistence, browserSessionPersistence,
    setPersistence,
    signInWithEmailAndPassword, signOut
} from "firebase/auth";
import {auth} from "../../firebaseConfig.tsx";
import mapErrorMessages from "../../mapErrorMessages.tsx";


export interface User {
    uid: string
    email: string | null
    displayName: string | null
}

interface UserState {
    user: User | null,
    status: 'idle' | 'pending' | 'fulfilled' | 'rejected',
    error: string | null
}

const initialState: UserState = {
    user: null,
    status: 'idle',
    error: null
}

export const loginUser = createAppAsyncThunk(
    'users/login',
    async(loginData: {email: string, password: string, stayLogged: boolean}) => {
        const {email, password, stayLogged} = loginData
        const response = await signInWithEmailAndPassword(auth, email, password)
        type userData = User & {stayLogged: boolean}
        const userData: userData = {
            uid: response.user.uid,
            email: response.user.email,
            displayName: response.user.displayName,
            stayLogged
        }
        return userData
    }
)

export const logoutUser = createAppAsyncThunk(
    'user/logout',
    async() => {
        return signOut(auth)
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        loadUserCached(state, action) {
            const {uid, email, displayName} = action.payload
            state.user = {uid, email, displayName}
        }
    },
    extraReducers(builder) {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                const {uid, email, displayName, stayLogged} = action.payload
                state.user = {uid, email, displayName}
                state.status = 'fulfilled'
                state.error = null
                stayLogged ? setPersistence(auth, browserLocalPersistence) : setPersistence(auth, browserSessionPersistence)
            })
            .addCase(logoutUser.fulfilled, () => {
                return initialState
            })
            .addMatcher(
                isAnyOf(loginUser.pending, logoutUser.pending),
                (state) => {
                    state.status = 'pending'
                }
            )
            .addMatcher(
                isAnyOf(loginUser.rejected, logoutUser.rejected),
                (state, action) => {
                    state.error = mapErrorMessages(action.error.code ?? 'Unknown Error')
                    state.status = 'rejected'
                }
            )
    }
})

export const {loadUserCached} = usersSlice.actions
export default usersSlice.reducer