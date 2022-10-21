
import { configureStore } from "@reduxjs/toolkit";
// here's where we would import reducters
// like (import pizzaReducer from './pizzaSlice.js'
import { breadCrumb } from './breadcrumb'

export const store = configureStore({
    reducer: {
        // pizza: pizzaReducer,
        //breadCrumb.reducer,
    },
});
