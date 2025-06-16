import { PetriNet } from '../modules/Petri_Net.js';
import { MarkerType } from 'reactflow';
import { showPromptDialog } from './handleForms';


export const selectFile = () => {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pgo, .json';
    input.onchange = (event) => {
      resolve(event.target.files[0]);
    };
    input.click();
  });
};

export const readFile = (file) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsText(file);
  });
};

export function importArcs(stopping, setEdges, petriNetData) {
  
  if ( stopping === 0) {
       showPromptDialog('On ne peut pas modifier le réseau de Petri durant une pause.');
    return;
  }
  for(let i =0; i< petriNetData.nb_arc;i++){
    PetriNet.addArc();
    const arc = petriNetData.arc[i]; // Access each place from the array in jsonData
    PetriNet.arc[PetriNet.nb_arc-1].name = arc.name;
    PetriNet.arc[PetriNet.nb_arc-1].weight = arc.weight;
    PetriNet.arc[PetriNet.nb_arc-1].Inhibitor = arc.Inhibitor;
    PetriNet.arc[PetriNet.nb_arc-1].placeToTransition = arc.placeToTransition;
    PetriNet.arc[PetriNet.nb_arc-1].Place = arc.Place;
    PetriNet.arc[PetriNet.nb_arc-1].Transition = arc.Transition;
    let sId, tId, sourceId,targetId;
    if(arc.placeToTransition === true){
     sId = arc.Place.id_place;
     sourceId =  `place-${sId}`;

     tId = arc.Transition.id_transition;
     targetId = `Transition-${tId}`;
    } else {
      sId = arc.Transition.id_transition; 
      sourceId =  `Transition-${sId}`;

     tId =  arc.Place.id_place;
     targetId = `place-${tId}`;

    }

let label = arc.weight.toString();
let arrowHead;
if(arc.Inhibitor === true) {
  arrowHead = MarkerType.Circle;
}else{
  arrowHead = MarkerType.ArrowClosed;
}

    const newEdge = {
      id: `Arc-${arc.id_arc}`,
      type: 'smoothstep',
      source: sourceId,
      target: targetId,
      label: label,
      Inhibitor: arc.Inhibitor,
      weight: arc.weight,
      placeToTransition: arc.placeToTransition,
      markerEnd: { type: arrowHead } // Use selectedMarkerType here
   
    };
    console.log(newEdge);
    // Add the new edge to the edges state
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  }
}

export  const addPlaceCanva = ( petriNetData,setFlowElements) => {  
    for (let i = 0; i < petriNetData.nb_place; i++) {
        PetriNet.addPlace();
        const place = petriNetData.place[i]; // Access each place from the array in jsonData
        PetriNet.place[PetriNet.nb_place - 1].nb_tokens = place.nb_tokens;
        PetriNet.place[PetriNet.nb_place - 1].name = place.name;
        PetriNet.place[PetriNet.nb_place - 1].capacity = place.capacity;
        PetriNet.place[PetriNet.nb_place - 1].ray = place.ray;
        PetriNet.place[PetriNet.nb_place - 1].id_place = place.id_place;
        PetriNet.place[PetriNet.nb_place - 1].x = place.x;
        PetriNet.place[PetriNet.nb_place - 1].y = place.y;
       
        const newElement = {
            id: `place-${place.id_place}`,
            data: {
              label: (
                <div>
                  <div className="place-label">{place.name}</div>
                  <div className='token-display' >
                  {place.nb_tokens > 0 && place.nb_tokens <= 10 ? 
                      <img alt='tokens' src={`/tokens/${place.nb_tokens}.svg`} style={{ maxWidth: '100%', maxHeight: '100%' }} /> :
                      place.nb_tokens > 10 ? 
                      <div className="number-display">{place.nb_tokens}</div> : 
                      null // Render nothing if nb_tokens is 0
                    }
                  </div>
                </div>
              ),
              
                capacity: place.capacity,
                nbTokens: place.nb_tokens,
                name: place.name,
            },
            position: { x: place.x, y: place.y }, // Use values from JSON object
            style: {
                width:  '70px', // Adjust width dynamically based on the length of the name
                height: '70px', // Increase height for larger label
                borderRadius: '50%',
                borderColor: '#008080',
                display: 'flex',
                cursor: 'default'
            },
            type: 'default',
            draggable: true,
            sourcePosition: 'right',
            targetPosition: 'left',
        };

        setFlowElements(prevFlowElements => [...prevFlowElements, newElement]);
    }
}

export  const addTransitionCanva = (petriNetData,setFlowElements) => {  
    for (let i = 0; i < petriNetData.nb_transition; i++) {
      PetriNet.addTransition();
      const transition = petriNetData.transition[i]; // Access each transition from the array in jsonData
      PetriNet.transition[PetriNet.nb_transition-1].name = transition.name;
      PetriNet.transition[PetriNet.nb_transition-1].weight = transition.weight;
      PetriNet.transition[PetriNet.nb_transition-1].priority = transition.priority;
      PetriNet.transition[PetriNet.nb_transition-1].firing_rate = transition.firing_rate;
      PetriNet.transition[PetriNet.nb_transition-1].x = transition.x;
      PetriNet.transition[PetriNet.nb_transition-1].y = transition.y;
      PetriNet.transition[PetriNet.nb_transition-1].width = transition.width;
      PetriNet.transition[PetriNet.nb_transition-1].height = transition.height;
      PetriNet.transition[PetriNet.nb_transition-1].is_enabled = false;
      PetriNet.transition[PetriNet.nb_transition-1].probabibility = 0;
      let newElement;
      // Check if the transition priority is equal to 1
      if (transition.priority === 0) {
         newElement = {
          id: `Transition-${transition.id_transition}`,
          data: {
            label: <div className="custom-label">{transition.name}</div>,
            name: transition.name,
            weight: transition.weight,
            firingRate: transition.firing_rate,
            priority: transition.priority,
          },
          position: { x: transition.x, y: transition.y },
          style: {
              borderRadius: '5px',
              width: '40px',
              height: '100px',
              borderColor: '#008080',
            },
          type: 'default',
          draggable: true,
          sourcePosition: 'right',
          targetPosition: 'left',
        };
      } else {
        newElement = {
          id: `Transition-${transition.id_transition}`,
          data: {
            label: <div className="custom-label">{transition.name}</div>,
            name: transition.name,
            weight: transition.weight,
            firingRate: transition.firing_rate,
            priority: transition.priority,
          },
          position: { x: transition.x, y: transition.y },
          style: {
            borderRadius: '5px',
            width: '40px',
            height: '100px',
            borderColor: '#008080',
            backgroundColor: 'black',
          },
          type: 'default',
          draggable: true,
          sourcePosition: 'right',
          targetPosition: 'left',
        };
      }
      setFlowElements(prevFlowElements => [...prevFlowElements, newElement]);

    }

  } 
