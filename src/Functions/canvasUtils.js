import { saveNet, resetNet ,clearFlowElements,selectNodes, selectEdges,loadNet } from '../redux/netSlice';
import  { BackgroundVariant} from 'reactflow';
import { PetriNet } from '../modules/Petri_Net.js';
import  {  useCallback  }from 'react';




export const handleResetCanvas = (dispatch, setTempTable, setFlowElements, setEdges) => {
      setTempTable([]); // Reset tempTable after creating edge
      dispatch(resetNet());
      dispatch(clearFlowElements());
      setFlowElements([]);
      setEdges([]);
    };

export const fitToWidth = (setTempTable) => {
        setTempTable([]); // Reset tempTable after creating edge
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      };
export const GridOptionChange = (option,setTempTable, setSelectedOption, setVariant) => {
        setTempTable([]); // Reset tempTable after creating edge
        setSelectedOption(option); 
        switch (option) {
          case 'dots':
              setVariant('dots');
              break;
          case 'lines':
            setVariant('lines');
              break;
          case 'cross':
            setVariant(BackgroundVariant.Cross);
              break;
          default:
              console.log("Invalid grid option selected");
      }
    };
     

export  const loadFromLocalStorage = (setTempTable, setFlowElements, setEdges, dispatch) => {
    const savedNodes = localStorage.getItem('nodes');
    const savedEdges = localStorage.getItem('edges');

      try {
        setTempTable([]); // Reset tempTable after creating edge
        const parsedNodes = JSON.parse(savedNodes);
        const parsedEdges = JSON.parse(savedEdges);
        PetriNet.nb_arc= 0;
        PetriNet.nb_place= 0;
        PetriNet.nb_transition= 0;

      
        // Convert tables to React Flow elements
        const { nodes, edges } = convertTablesToFlowElements(parsedNodes, parsedEdges);

        // Set the converted elements as state
        setFlowElements(nodes);
        setEdges(edges);


        
        // Dispatch to Redux if necessary
        dispatch(loadNet({ nodes, edges }));
        localStorage.clear();
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    
  };
   
  

const convertTablesToFlowElements = (parsedNodes, parsedEdges) => {
    const createFlowElement = (table) => {
      const { id, position, style,data } = table;
      let node;

      if(id.startsWith('place-')) { 

      PetriNet.addPlace();
     const idd = PetriNet.nb_place-1;

        PetriNet.place[idd].name = data.name;
        PetriNet.place[idd].capacity = data.capacity;
        PetriNet.place[idd].nb_tokens = data.nbTokens;
        PetriNet.place[idd].id_place = idd;


        const labelStyle = {
          fontWeight: 500,
          fontSize: '14px',
          position: 'absolute',
          bottom: '-33px', // Increase distance between label and node
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '200px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        };
        
        const tokenDisplayStyle = {
          fontSize: '16px',
          color: 'black',
          backgroundColor: '#fff',
          padding: '5px',
          borderRadius: '5px',
        };
        
        const numberDisplayStyle = {
          fontSize: '24px',
          textAlign: 'center',
        };
        
        const label = (
          <div>
            <div className="place-label">{data.name}</div>
            <div className='token-display'>
              {data.nbTokens > 0 && data.nbTokens <= 10 ?
                <img alt='tokens' src={`/tokens/${data.nbTokens}.svg`} style={{ maxWidth: '100%', maxHeight: '100%' }} /> :
                data.nbTokens > 10 ?
                  <div className="number-display">{data.nbTokens}</div> :
                  null
              }
            </div>
          </div>
        );
        
        
    
      // Define the properties for the React Flow element
       node = {
        id: id, // Unique identifier for the node
        sourcePosition: 'right',
targetPosition: 'left',
        type: 'table', // Type of the node (customize as needed)
        data: {
          label: label, // Use the constructed label
          capacity: data.capacity, // Pass capacity as a property of the node data
          nbTokens: data.nbTokens, // Pass nbTokens as a property of the node data
          name: data.name,
        },
        position: position || { x: 0, y: 0 }, // Use provided position or default to { x: 0, y: 0 }
        style: style || {}, 
      };
    } else if(id.startsWith('Transition-')){

PetriNet.addTransition();
const idd = PetriNet.nb_transition-1;
      PetriNet.transition[idd].name = data.name;
      PetriNet.transition[idd].weight = data.weight;
      PetriNet.transition[idd].firing_rate = data.firingRate;
      PetriNet.transition[idd].priority = data.priority;
      PetriNet.transition[idd].id_transition =idd;




      const label = <div className="custom-label">{data.name}</div>;
       node = {
        id: id, // Unique identifier for the node
        sourcePosition: 'right',
        targetPosition: 'left',
        type: 'table', // Type of the node (customize as needed)
        data: {
          label: label, // Use the constructed label
          weight: data.weight,
          firingRate: data.firingRate,
          priority: data.priority,
          name: data.name,
        },
        position: position || { x: 0, y: 0 }, // Use provided position or default to { x: 0, y: 0 }
        style: style || {}, 
      };
    }
      return node;
    };
    
    const createEdge = (table) => {
      // Extract properties from the table object
      const { id,type,label,Inhibitor,target,Place,source,Transition,weight,placeToTransition,markerEnd  } = table;


      PetriNet.addArc();
      const idd = PetriNet.nb_arc-1;


      PetriNet.arc[idd].id_arc = idd;
      PetriNet.arc[idd].placeToTransition = placeToTransition;
      PetriNet.arc[idd].weight = weight;
      PetriNet.arc[idd].Inhibitor = Inhibitor;
      const s = parseInt(source.split('-')[1]);
      const t = parseInt(target.split('-')[1]);
      console.log('s =', s);
      console.log('t =', t);


    if(placeToTransition){
      PetriNet.arc[idd].Place = PetriNet.place[s];
      PetriNet.arc[idd].Transition = PetriNet.transition[t];
    } else {
      PetriNet.arc[idd].Place = PetriNet.place[t];
      PetriNet.arc[idd].Transition = PetriNet.transition[s];
    }
    

      const edge = {
        id: id,
        type: type,
        source: source,
        target: target,
        label: label,
        Inhibitor:Inhibitor,
        weight: weight,
        placeToTransition:placeToTransition,
        markerEnd: { type: markerEnd.type }
      };
    
      return edge;
    };  
    // Convert parsedNodes and parsedEdges into React Flow elements
    const flowNodes = parsedNodes.map(createFlowElement);
    const flowEdges = parsedEdges.map(createEdge); // Assuming edges are already in the correct format
  
    return { nodes: flowNodes, edges: flowEdges };
  };

  
export const handleSaveNet = (setTempTable, flowElements, edges, variant, setVariant) => {
    setTempTable([]); // Reset tempTable after creating edge
    const nodesData = JSON.stringify(flowElements);
    const edgesData = JSON.stringify(edges);
    localStorage.setItem('nodes', nodesData);
    localStorage.setItem('edges', edgesData);
    setVariant(variant);
  };
