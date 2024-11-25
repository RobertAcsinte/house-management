import {createSlice, isAnyOf} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "../../withTypes.ts";
import {
    browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, sendPasswordResetEmail,
    setPersistence,
    signInWithEmailAndPassword, signOut, updateProfile
} from "firebase/auth";
import {auth, db, storageFirebase} from "../../firebaseConfig.tsx";
import mapErrorMessages from "../../mapErrorMessages.tsx";
import {getDownloadURL, ref as ref_storage, uploadBytes} from "firebase/storage";
import {ref, remove, set} from "firebase/database";



export interface User {
    uid: string
    email: string | null
    displayName: string | null,
    photoURL: string | null
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
        await signInWithEmailAndPassword(auth, email, password)
        return {stayLogged}
    }
)


export const logoutUser = createAppAsyncThunk(
    'user/logout',
    async() => {
        return signOut(auth)
    }
)

export const resetPasswordUser = createAppAsyncThunk(
    'user/resetPassword',
    async(email: string) => {
        return sendPasswordResetEmail(auth, email)
    }
)

//here errors are thrown again so they can be caught in user/register/rejected; if you just catch them and dispatch(error), user/register/fulfilled will still be called
export const registerUser = createAppAsyncThunk(
    'user/register',
    async({email, displayName, password, repeatPassword, avatar}: User & {email: string, password: string, repeatPassword: string, avatar: Blob | Uint8Array | ArrayBuffer}) => {
        if(password !== repeatPassword) {
            throw new Error("auth/error-passwords-match")
        } else {
            try {
                const userData = await createUserWithEmailAndPassword(auth, email, password)
                try {
                    await set(ref(db, 'users/' + userData.user.uid), {email: email, displayName: displayName});
                    try {
                        const imgRef = ref_storage(storageFirebase, userData.user.uid);
                        await uploadBytes(imgRef, avatar)
                        const photoURL = await getDownloadURL(imgRef)
                        await updateProfile(userData.user, {photoURL, displayName})
                        const user: User = {
                            uid: userData.user.uid,
                            email: email,
                            displayName: displayName,
                            photoURL
                        }
                        return user
                    } catch (error: firebase.FirebaseError) {
                        await userData.user.delete()
                        await remove((ref(db, 'users/' + userData.user.uid)))
                        throw new Error(error.code)
                    }
                } catch (error: firebase.FirebaseError) {
                    await userData.user.delete()
                    throw new Error(error.code)
                }
            } catch(error: firebase.FirebaseError) {
                throw new Error(error.code)
            }
        }
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        userGlobalStateChanged(state, action) {
            const {uid, email, displayName, photoURL} = action.payload
            state.user = {uid, email, displayName, photoURL}
        },
        setError(state, action) {
            state.error = mapErrorMessages(action.payload.error)
        }
    },
    extraReducers(builder) {
        builder
            //user data state is set with userGlobalStateChanged which is dispatched everytime the user state is changing from main.tsx, with auth.onAuthStateChanged()
            .addCase(loginUser.fulfilled, (state, action) => {
                const {stayLogged} = action.payload
                state.status = 'fulfilled'
                state.error = null
                stayLogged ? setPersistence(auth, browserLocalPersistence) : setPersistence(auth, browserSessionPersistence)

            })
            .addCase(logoutUser.fulfilled, () => {
                return initialState
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = {...action.payload}
                state.status = 'fulfilled'
                state.error = null

            })
            .addMatcher(
                isAnyOf(loginUser.pending, logoutUser.pending, resetPasswordUser.pending),
                (state) => {
                    state.status = 'pending'
                }
            )
            .addMatcher(
                isAnyOf(loginUser.rejected, logoutUser.rejected, resetPasswordUser.rejected, registerUser.rejected),
                (state, action) => {
                    state.error = mapErrorMessages((action.error.code || action.error.message) ?? 'Unknown Error')
                    state.status = 'rejected'
                }
            )
            .addMatcher(
                isAnyOf(resetPasswordUser.fulfilled),
                (state) => {
                    state.status = 'fulfilled'
                    state.error = null
                }
            )
    }
})

export const {userGlobalStateChanged, setError} = usersSlice.actions
export default usersSlice.reducer