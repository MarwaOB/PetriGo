// Transform PetriNet elements into React Flow nodes and edges
export const transformPetriNetToElements = (PetriNet) => {
  let elements = [];

  // Create nodes for places
  PetriNet.place.forEach(place => {
    elements.push({
      id: `place-${place.id_place}`,
      data: { label: place.name },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
      style: { width: 60, height: 60, borderRadius: '50%', borderColor: 'rgb(30 64 175)' }, // Circle style for places
      type: 'default',
    });
  });

  // Create nodes for transitions
  PetriNet.transition.forEach(transition => {
    elements.push({
      id: `transition-${transition.id_transition}`,
      data: { label: transition.name },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
      style: { width: 25, height: 60, borderRadius: '5px', borderColor: 'rgb(13 148 136)' }, // Rectangle style for transitions
      type: 'default',
    });
  });

  return elements;
};