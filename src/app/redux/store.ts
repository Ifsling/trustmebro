import { configureStore } from "@reduxjs/toolkit"

function dummyReducer(state = {}) {
  return state
}

export const store = configureStore({
  reducer: { dummy: dummyReducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
