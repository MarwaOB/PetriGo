
export const saveCanvasState = (flowElements, edges) => {
    // Combine flowElements and edges into a single object
    const canvasState = { flowElements, edges };
  
    // Convert canvas state object to JSON string
    const canvasStateJSON = JSON.stringify(canvasState);
  
    // Save JSON string to local storage under a specific key
    localStorage.setItem('petriNetCanvas', canvasStateJSON);
  };
  


// Function to load canvas state from local storage
export const loadCanvasState = () => {
    // Retrieve canvas state JSON string from local storage
    const canvasStateJSON = localStorage.getItem('petriNetCanvas');
  
    // If canvas state exists in local storage, parse JSON string and return it
    if (canvasStateJSON) {
      const canvasState = JSON.parse(canvasStateJSON);
      return canvasState;
    }
  
    // If canvas state doesn't exist, return null or an empty object, depending on your needs
    return null;
  };
  
