import {createSlice} from "@reduxjs/toolkit";


export interface User {
    uid: string
    email: string
    name: string
}

const initialState: User[] = [];

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {}
})