const initialState = {
  nodes: [],
  edges: [],
};

const netReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SAVE_NET':

      return {
        ...state,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
      };
    default:
      return state;
  }
};

export default netReducer;