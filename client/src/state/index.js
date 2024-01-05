import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "dark",
    userId: "63701cc1f03239b7f700000e",
};

export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
    },
});

export const { setMode } = globalSlice.actions;
// console.log("This is setMode : ", setMode)

export default globalSlice.reducer;
// console.log("This is globalSlice.reducer : ", globalSlice.reducer)
