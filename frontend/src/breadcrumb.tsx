import { Satellite } from '@mui/icons-material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

interface BreadCrumbState {
    displayDate: number,
    isOn: boolean,
    tournament: String,
    tid: number;
    division: String,
    did: number;
    room: String,
    round: String,
    team: String,
}

const initialState : BreadCrumbState = {
    displayDate: Date.now(),
    isOn: true,
    tournament: "",
    tid: -1,
    division: "",
    did: -1,
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
        setTid: (state, action : PayloadAction<number>) => {
            state.tid = action.payload 
        },
        setDivision: (state, action: PayloadAction<String>) => {
            state.division = action.payload
        },
        setDid: (state, action: PayloadAction<number>) => {
            state.did = action.payload
        },
        setDisplayDate: (state, action: PayloadAction<number>) => {
            state.displayDate = action.payload
        },
        setRoom: (state, action: PayloadAction<String>) => {
            state.room = action.payload
        },
        setRound: (state, action: PayloadAction<String>) => {
            state.round = action.payload
        },
        setTeam: (state, action: PayloadAction<String>) => {
            state.team = action.payload
        },
    },

})

export const { setDisplayDate, toggleIsOn, setTournament, setTid, setDivision, setDid, setRoom, setRound, setTeam } = breadCrumb.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDisplayDate = (state: RootState) => state.breadCrumb.displayDate;
export const selectIsOn = (state: RootState) => state.breadCrumb.isOn;
export const selectTournament = (state: RootState) => state.breadCrumb.tournament;
export const selectTid = (state: RootState) => state.breadCrumb.tid;
export const selectDivision = (state: RootState) => state.breadCrumb.division;
export const selectDid = (state: RootState) => state.breadCrumb.did;
export const selectRoom = (state: RootState) => state.breadCrumb.room;
export const selectRound = (state: RootState) => state.breadCrumb.round;
export const selectTeam = (state: RootState) => state.breadCrumb.team;

export default breadCrumb.reducer;



















