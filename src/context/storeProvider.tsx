'use client'
import { useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store/store'

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  const [persistor, setPersistor] = useState<any>(null)

  useEffect(() => {
    //  Only run client side
    if (typeof window !== 'undefined'  && storeRef.current) {
      const ps = persistStore(storeRef.current)
      setPersistor(ps)
    }
  }, [])

  if (!persistor) return null // wait for persistor to initialize


  return <>
    <Provider store={storeRef.current!}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  </>;
}