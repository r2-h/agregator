import { useSyncExternalStore } from "react";

type Listener = () => void;

type SetState<T> = T | ((prev: T) => T);

export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener>();

  const getState = () => state;

  const setState = (updater: SetState<T>) => {
    const nextState = typeof updater === "function" ? (updater as (prev: T) => T)(state) : updater;

    if (Object.is(state, nextState)) return;
    state = nextState;

    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);

    return () => listeners.delete(listener);
  };

  const useStore = <S>(selector: (state: T) => S) =>
    useSyncExternalStore(
      subscribe,
      () => selector(getState()),
      () => selector(getState()),
    );

  return { getState, setState, subscribe, useStore };
}
