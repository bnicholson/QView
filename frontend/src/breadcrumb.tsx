import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isOn: true,
    tournament: [''],
    division: [''],
    room: [''],
    round: [''],
    team: [''],

}

export const breadCrumb = createSlice({
    name: 'breadcrumb',
    initialState,
    reducers: {
        toggleIsOn: (state) => {
            state.isOn = !state.isOn
        },
        setTournament: (state, action) => {
            state.tournament = [action.payload],
        },
    },

})

export const { toggleIsOn, setTournament } = breadCrumb.actions;

export default breadCrumb.reducer;



















