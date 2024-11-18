import {createSlice} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../../withTypes.ts";
import {
    browserLocalPersistence, browserSessionPersistence,
    setPersistence,
    signInWithEmailAndPassword, signOut
} from "firebase/auth";
import {auth} from "../../firebaseConfig.tsx";


interface User {
    uid: string
    email: string | null
    displayName: string | null
}

interface UserState {
    user: User | null,
    status: 'idle' | 'pending' | 'finished' | 'failed',
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
        return {...response.user, stayLogged}
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
                stayLogged ? setPersistence(auth, browserLocalPersistence) : setPersistence(auth, browserSessionPersistence)
            })
            .addCase(loginUser.pending, state => {
                state.status = 'pending'
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.error.message ?? 'Unknown Error'
            })

            .addCase(logoutUser.fulfilled, state => {
                state.user = null
            })
            .addCase(logoutUser.pending, state => {
                state.status = 'pending'
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.error.message ?? 'Unknown Error'
            })
    }
})

export const {loadUserCached} = usersSlice.actions
export default usersSlice.reducer