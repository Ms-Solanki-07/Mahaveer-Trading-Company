
import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './features/cartSlice'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // only persist the cart slice
}

// Combine reducers first
const rootReducer = combineReducers({
  cart: cartSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']