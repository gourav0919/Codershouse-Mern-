import { useState, useEffect, useCallback, useRef } from "react";

export const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState);

  const cbRef = useRef();

  const updateState = useCallback((newState, callb) => {
    cbRef.current = callb;

    setState((prev) => {
      return typeof newState === "function" ? newState(prev) : newState;
    });
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
};
