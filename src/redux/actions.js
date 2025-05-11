// actions.js

export const SAVE_NET = 'SAVE_NET';
export const LOAD_NET_FROM_LOCAL_STORAGE = 'LOAD_NET_FROM_LOCAL_STORAGE';

export const saveNet = (nodes, edges) => ({
  type: SAVE_NET,
  payload: { nodes, edges }
});

export const loadNetFromLocalStorage = ({ nodes, edges }) => ({
  type: LOAD_NET_FROM_LOCAL_STORAGE,
  payload: { nodes, edges }
});


