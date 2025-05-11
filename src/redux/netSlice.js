// netSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { PetriNet } from '../modules/Petri_Net';
const initialState = {
  nodes: [],
  edges: []
};

export const netSlice = createSlice({
  name: 'net',
  initialState,
  reducers: {
    resetNet: state => {
      state.nodes = [];
      state.edges = [];
      PetriNet.suppTout();
      localStorage.clear();
      localStorage.removeItem('nodes'); 
      localStorage.removeItem('edges');
    },
    saveNet: (state, action) => {
      state.nodes = action.payload.nodes;
      state.edges = action.payload.edges;
      localStorage.setItem('nodes', JSON.stringify(state.nodes));
      localStorage.setItem('edges', JSON.stringify(state.edges));
    },
    clearFlowElements: state => {
      state.nodes = [];
      state.edges = [];
    },
    loadNet: state => {
      state.nodes = JSON.parse(localStorage.getItem('nodes')) || [];
      console.log("ggg");
      state.edges = JSON.parse(localStorage.getItem('edges')) || [];
    }
  }
});

export const { resetNet, saveNet, clearFlowElements, loadNet } = netSlice.actions;

export const selectNodes = state => state.net.nodes;
export const selectEdges = state => state.net.edges;

export default netSlice.reducer;
