import { Satellite } from '@mui/icons-material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface BreadCrumbState {
    displayDate: number,
    isOn: boolean,
    tournament: String,
    division: String,
    room: String,
    round: String,
    team: String,
}

const initialState : BreadCrumbState = {
    displayDate: Date.now(),
    isOn: true,
    tournament: "Jackson - 23",
    division: "",
    room: "",
    round: "",
    team: "",
}

export const breadCrumb = createSlice({
    name: 'breadcrumb',
    initialState,
    reducers: {
        toggleIsOn: (state) => {
            state.isOn = !state.isOn
        },
        setTournament: (state, action : PayloadAction<String>) => {
            state.tournament = action.payload
        },
        setDisplayDate: (state, action: PayloadAction<number>) => {
            state.displayDate = action.payload
        }
    },

})

export const { setDisplayDate, toggleIsOn, setTournament } = breadCrumb.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDisplayDate = (state: RootState) => state.breadCrumb.displayDate;
export const selectIsOn = (state: RootState) => state.breadCrumb.isOn;
export const selectTournament = (state: RootState) => state.breadCrumb.tournament;
export const selectDivision = (state: RootState) => state.breadCrumb.division;

export default breadCrumb.reducer;



















