import type { StateCreator } from 'zustand'

export type ImmerStateCreator<T, TStore = T> = StateCreator<
  TStore,
  [['zustand/immer', never], never],
  [],
  T
>
