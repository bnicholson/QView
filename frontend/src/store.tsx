
import { configureStore } from "@reduxjs/toolkit";
// here's where we would import reducters
// like (import pizzaReducer from './pizzaSlice.js'
import { breadCrumb } from './breadcrumb'

export const store = configureStore({
    reducer: {
        breadCrumb: breadCrumb.reducer,
    },
});

// These next 4 lines are required since the store is in typescriptS
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
