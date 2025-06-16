import  { useState, useRef, useEffect, useCallback  }from 'react';
import ReactFlow, { Background , MarkerType, useEdgesState} from 'reactflow';
import 'reactflow/dist/style.css';
import { IconContext } from 'react-icons';
import 'reactflow/dist/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay,faStepForward , faStop, faXmark, faTrash,faClock,faExpand,faSave,faFileImport, faBars } from '@fortawesome/free-solid-svg-icons';
import useAddingPlace from '../Functions/AddingPlace.js';
import useAddingTransitionI from '../Functions/AddingTransI.js';
import useAddingTransitionT from '../Functions/AddingTransT.js';
import { RemovePlace, RemoveTrans, RemoveEdge } from '../Functions/removeElements';
import { ShowMarkingGraph, ShowMarkingGraphReduced, ShowProprieties } from '../Functions/graphDisplay';
import {  initialization, skip, continuePop } from '../Functions/guideFunctions';
import { showFormPlace, showFormTransitionImm, showFormTransitionTem, updatingArcLabel, showPromptDialog } from '../Functions/handleForms';
import { Link } from 'react-router-dom';
import { handleResetCanvas, fitToWidth, GridOptionChange, loadFromLocalStorage, handleSaveNet } from '../Functions/canvasUtils';
import { selectFile, readFile, importArcs, addPlaceCanva, addTransitionCanva} from '../Functions/importExport';
import './Navbar.css';
import { PetriNet } from '../modules/Petri_Net.js';
import  { startSimulation, pauseSimulation, stopSimulation, stepSimulation, handleSpeedAdjustment } from '../Functions/simulate.js';
import LogoPng from '../logo/logoPng2.png';
import { useDispatch } from 'react-redux';
import ExportIcon from "../components/ExportIcon";
import GridSelector from '../components/GridSelector.js';
import ReactDOM from 'react-dom';

const initialEdges =  [];     

function Navbar() {
  const [flowElements, setFlowElements] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [lastClickedIcon, setLastClickedIcon] = useState(null);
  const [running, setRunning] = useState(0);
  const [pausing, setPausing] = useState(0);
  const [stimulationSpeed, setStimulationSpeed] = useState(1); // Default stimulation speed is 1 second
  const [stopping, setStopping] = useState(1);
  const [intervalId, setIntervalId] = useState(null);
  const [isCanvasHovered, setIsCanvasHovered] = useState(false); 
  const [addingElement, setAddingElement] = useState(null); // Track the currently adding element
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedMarkerType, setSelectedMarkerType] = useState(MarkerType.ArrowClosed);
  const onElementClick = (event, element) => console.log('click', element);
  const [captureElementClick, setCaptureElementClick] = useState(false);
  const [selectedOption, setSelectedOption] = useState('dots');
  const [tempTable, setTempTable] = useState([]);
  const [showGroupGraphe, setShowGroupGraphe] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
 const edgeUpdateSuccessful = useRef(true);
let petriNetData = null;
  
const CircleMarker = () => {
  useEffect(() => {
    // Create the SVG marker definition for the circle marker
    const circleMarkerElement = (
      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker
            id="circle-marker"
            viewBox="0 0 20 20"
            markerHeight={20}
            markerWidth={20}
            refX={10}
            refY={11}
          >
            <circle cx="10" cy="30" r="30" fill="#1A192B" />
          </marker>
        </defs>
      </svg>
    );

    // Append the circle marker definition to the DOM
    const circleMarkerContainer = document.createElement('div');
    document.body.appendChild(circleMarkerContainer);
    ReactDOM.render(circleMarkerElement, circleMarkerContainer);

    // Clean up the marker definition on component unmount
    return () => {
      document.body.removeChild(circleMarkerContainer);
    };
  }, []);

  return null; // This component doesn't render anything visible
};

const { onPaneClick: addPlace } = useAddingPlace(setFlowElements,pausing,stopping,running);
const { onPaneClickTraI: addTransitionI } = useAddingTransitionI(setFlowElements,pausing,stopping,running );
const { onPaneClickTraT: addTransitionT } = useAddingTransitionT(setFlowElements,pausing,stopping,running );

useEffect(() => {
         loadFromLocalStorage(setTempTable, setFlowElements, setEdges, dispatch);
  }, []);

  const [variant, setVariant] = useState(() => {
    const savedVariant = localStorage.getItem('variant');
    return savedVariant ? savedVariant : 'dots';
  });

  useEffect(() => {
    localStorage.setItem('variant', variant);
  }, [variant]);

const handleImport = () => {
  setTempTable([]); // Reset tempTable after creating edge
  if (stopping === 0) {
        showPromptDialog('On ne peut pas modifier le réseau de Petri durant une pause.');
    return;
  }
  // ✅ Use the fixed version here
  importPetriNetFromJSON().then(() => {
    if (petriNetData) {
            console.log("Imported Petri Net:", petriNetData);
      // clear current data
      PetriNet.nb_place = 0;
      PetriNet.nb_arc = 0;
      PetriNet.nb_transition = 0;
      setFlowElements([]);
      setEdges([]);

      // your functions to rebuild UI
      addPlaceCanva( petriNetData,setFlowElements);
      addTransitionCanva( petriNetData,setFlowElements);
      importArcs(stopping, setEdges, petriNetData);
    }
  }).catch((err) => {
    console.error("Failed to import Petri Net:", err);
  });
};

const importPetriNetFromJSON = async (reactFlowInstance) => {
  const file = await selectFile();
  if (file) {
    const importedData = await readFile(file);
    if (importedData) {
     petriNetData = JSON.parse(importedData);
      console.log("IMEEEEN",petriNetData);
      
    }
  }
};

const handleGridOptionChange = (option) => {
    GridOptionChange(option, setTempTable , setSelectedOption, setVariant);
};

const updateArcLabel = (event,edge) => {
    updatingArcLabel(event, edge, setTempTable, edges, setEdges);
};

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Guard against null reference
  
    canvas.addEventListener('mouseenter', handleCanvasMouseEnter);
    canvas.addEventListener('mouseleave', handleCanvasMouseLeave);
  
    return () => {
      canvas.removeEventListener('mouseenter', handleCanvasMouseEnter);
      canvas.removeEventListener('mouseleave', handleCanvasMouseLeave);
    };
  }, [canvasRef]);

  const handleCanvasMouseEnter = () => {
    setIsCanvasHovered(true);
  };

  const handleCanvasMouseLeave = () => {
    setIsCanvasHovered(false);
  };  
  useEffect(() => { 
      return () => {
        clearInterval(intervalId);
      };
  }, [intervalId]);


const handleClick = (event, nodeId) => {
    switch (lastClickedIcon) {
        case 'place':
            addPlace(event);
            setTempTable([]); // Reset tempTable after creating edge
            break;        
        case 'transitionI':
            addTransitionI(event);
            setTempTable([]); // Reset tempTable after creating edge
            break;
        case 'transitionT':
            addTransitionT(event);
            setTempTable([]); // Reset tempTable after creating edge
            break;
       case 'remove':
            setTempTable([]);
            if (nodeId === undefined) return;
            
            if (nodeId.id === undefined) {
                // nodeId is a string (node ID)
                if (nodeId.startsWith('place-')) {
                    RemovePlace(nodeId, stopping, setFlowElements, flowElements, setEdges, edges);
                } else if (nodeId.startsWith('Transition-')) {
                    RemoveTrans(nodeId, stopping, setFlowElements, flowElements, setEdges, edges);
                }
            } else {
                // nodeId is an object with id property (edge)
                RemoveEdge(nodeId, stopping, setEdges, edges);
            }
            break;
        case null: 
            if (nodeId === undefined ) return;
            if (nodeId.id === undefined ) {
                if (tempTable.length === 0) {
                    setTempTable([nodeId]);
                } else if (tempTable.length === 1) {
                    setTempTable([...tempTable, nodeId]);
    
                    const source = tempTable[0];
                    const target = nodeId;

                    setTempTable([]); // Reset tempTable after creating edge
  
                    // Find source and target nodes
                    const sourceNode = flowElements.find((node) => node.id === source);
                    const sourceId = parseInt(sourceNode.id.split('-')[1]);
                    const targetNode = flowElements.find((node) => node.id === target);
                    const TargetId = parseInt(targetNode.id.split('-')[1]);
  
                    if(sourceNode.id.startsWith('Transition-') && targetNode.id.startsWith('Transition-')) return;
      else if(sourceNode.id.startsWith('place-') && targetNode.id.startsWith('place-')) return;
  
                    // Determine the type based on the selected marker type
                    const type = selectedMarkerType === MarkerType.ArrowClosed ? false : true;
  
                    if (sourceNode.id.startsWith('Transition-') && targetNode.id.startsWith('place-') && type) {
                        // If condition is met, return without creating the arc
                        return;
                    }
  
                    // Add the new arc to your PetriNet
                    PetriNet.addArc(); // Assuming undefined for name
                    if (sourceNode.id.startsWith('place-')) {
                        PetriNet.arc[PetriNet.nb_arc - 1].Place = PetriNet.place[sourceId];
                        PetriNet.arc[PetriNet.nb_arc - 1].Transition = PetriNet.transition[TargetId];
                        PetriNet.arc[PetriNet.nb_arc - 1].placeToTransition = true;
                    }
  
                    if (sourceNode.id.startsWith('Transition-')) {
                        PetriNet.arc[PetriNet.nb_arc - 1].Transition = PetriNet.transition[sourceId];
                        PetriNet.arc[PetriNet.nb_arc - 1].Place = PetriNet.place[TargetId];
                        PetriNet.arc[PetriNet.nb_arc - 1].placeToTransition = false;
                    }
                    PetriNet.arc[PetriNet.nb_arc - 1].Inhibitor = type;
                    PetriNet.arc[PetriNet.nb_arc - 1].weight = 1;
                    const arc = PetriNet.arc[PetriNet.nb_arc - 1];
  
                    // Create a new edge with the selected marker type
                    const newEdge = {
                        id: `Arc-${arc.id_arc}`,
                        type: 'smoothstep',
                        source: source,
                        target:target,
                        label: '1',
                        Inhibitor: arc.Inhibitor,
                        weight: arc.weight,
                        placeToTransition: arc.placeToTransition,
                        markerEnd: { type: selectedMarkerType } // Use selectedMarkerType here
                    };
                    // Add the new edge to the edges state
                    setEdges((prevEdges) => [...prevEdges, newEdge]);
                    setTempTable([]); // Reset tempTable after creating edge
           
                }
            }   
            break;
        default:
          setTempTable([]); // Reset tempTable after creating edge
          break;
    }

    setLastClickedIcon(null);
    setAddingElement(null);
    nodeId = null;
    document.body.style.cursor = 'default';
};

  const onNodeDragStop = (event, node) => {
    const updatedElements = flowElements.map((el) => {
      if (el.id === node.id) {
        if(el.position.x !==  node.position.x || el.position.y !==  node.position.y) setTempTable([]);
        return {
          ...el,
          position: { x: node.position.x, y: node.position.y },
        };
      }
      return el;
    });
    setFlowElements(updatedElements);
  };

  const updatenodes = async (event, node) => {
    setTempTable([]); // Reset tempTable after creating edge

    event.preventDefault();
    if ( stopping === 0)  {
      // Create the prompt dialog container
      const promptContainer = document.createElement('div');
      promptContainer.classList.add('prompt-overlay');
    
      // Create the prompt dialog
      const promptDialog = document.createElement('div');
      promptDialog.classList.add('prompt-dialog');
    
      // Create the cadre for the message
      const cadre = document.createElement('div');
      cadre.classList.add('cadre');
    
      // Create the message element
      const message = document.createElement('div');
      message.classList.add('prompt-message');
      message.textContent = 'On ne peut pas modifier le réseau de Petri durant une pause/simulation.';
    
      // Create the close button
      const closeButton = document.createElement('button');
      closeButton.classList.add('prompt-close-button');
      closeButton.textContent = 'Fermer';
      closeButton.addEventListener('click', () => {
        promptContainer.remove(); // Remove the prompt dialog
      });
    
      // Append message to cadre
      cadre.appendChild(message);
    
      // Append cadre and close button to prompt dialog
      promptDialog.appendChild(cadre);
      promptDialog.appendChild(closeButton);
    
      // Append the prompt dialog to the container
      promptContainer.appendChild(promptDialog);
    
      // Append the container to the document body
      document.body.appendChild(promptContainer);
    
      return;
    }
    
    if (formOpen) return;

    setFormOpen(true);
    const updatedElements = await Promise.all(flowElements.map(async (el) => {
      if (el.id === node.id) {
        let nodeId = parseInt(el.id.split('-')[1]);
        if (el.id.startsWith('place-')) {
          let nodeCapacity = PetriNet.place[nodeId].capacity;
          let nodeTokenCount = PetriNet.place[nodeId].nb_tokens;
          let nodeName = PetriNet.place[nodeId].name;
          await new Promise((resolve) => {
            showFormPlace(nodeName, nodeCapacity, nodeTokenCount, (updatedNodeName, updatedNodeCapacity, updatedNodeTokenCount) => {
              el.data = { ...el.data, label: (
                <div>
                  <div className="place-label">{updatedNodeName}</div>
                  <div className='token-display'>
                    {updatedNodeTokenCount > 0 && updatedNodeTokenCount <= 10 ? 
                      <img alt='tokens' src={`/tokens/${updatedNodeTokenCount}.svg`} style={{ maxWidth: '100%', maxHeight: '100%' }} /> :
                      updatedNodeTokenCount > 10 ? 
                      <div className="number-display">{updatedNodeTokenCount}</div> : 
                      null // Render nothing if nb_tokens is 0
                    }
                  </div>
                </div>
              ),
            capacity: updatedNodeCapacity,
            nbTokens: updatedNodeTokenCount,
            name: updatedNodeName,
            
            };
              PetriNet.place[nodeId].name = updatedNodeName;
              PetriNet.place[nodeId].nb_tokens = updatedNodeTokenCount;
              PetriNet.place[nodeId].capacity = updatedNodeCapacity;
              resolve();
            }, event);
          });

        } else if (el.id.startsWith('Transition-')) {
          let nodeName = PetriNet.transition[nodeId].name;
          await new Promise((resolve) => {
            if (PetriNet.transition[nodeId].priority === 1) {
              let nodeWeight = PetriNet.transition[nodeId].weight;
              showFormTransitionImm(nodeName, nodeWeight, (updatedNodeName, updatedNodeWeight) => {
                el.data = { ...el.data, label: ( <div className="custom-label">{updatedNodeName}</div> ),
              name: updatedNodeName,
              weight: updatedNodeWeight,
              };
                PetriNet.transition[nodeId].name = updatedNodeName;
                PetriNet.transition[nodeId].weight = updatedNodeWeight;
                resolve();
              }, event);
            } else {
              let nodeWeight = PetriNet.transition[nodeId].firing_rate;
              showFormTransitionTem(nodeName,nodeWeight, (updatedNodeName , updatedNodeWeight) => {
                el.data = { ...el.data, label: ( <div className="custom-label">{updatedNodeName}</div> ),
                firingRate: updatedNodeWeight,
                name: updatedNodeName,
              };
                PetriNet.transition[nodeId].name = updatedNodeName;
                PetriNet.transition[nodeId].firing_rate = updatedNodeWeight;
                resolve();
              }, event);
            }
          });
        }
      }
      return el;
    }));
    setFormOpen(false);
    setFlowElements(updatedElements);
  };

  function handleAddElementClick(elementType,e) {
    setTempTable([]); // Reset tempTable after creating edge
    setLastClickedIcon(elementType);
    setAddingElement(elementType);
    document.body.style.cursor = 'crosshair';
  }

  const handleCircleButtonClick = () => {
    //setSelectedMarkerType('circle-marker');
    setSelectedMarkerType(MarkerType.circle);
  };
  
  const handleArrowButtonClick = () => {
    setTempTable([]); // Reset tempTable after creating edge
    setSelectedMarkerType(MarkerType.ArrowClosed); 
  };

  const onConnect = useCallback(
    
    (params) => {
      setTempTable([]); // Reset tempTable after creating edge

      if ( stopping === 0)  {
        // Create the prompt dialog container
        const promptContainer = document.createElement('div');
        promptContainer.classList.add('prompt-overlay');
      
        // Create the prompt dialog
        const promptDialog = document.createElement('div');
        promptDialog.classList.add('prompt-dialog');
      
        // Create the cadre for the message
        const cadre = document.createElement('div');
        cadre.classList.add('cadre');
      
        // Create the message element
        const message = document.createElement('div');
        message.classList.add('prompt-message');
        message.textContent = 'On ne peut pas modifier le réseau de Petri durant une pause/simulation.';
      
        // Create the close button
        const closeButton = document.createElement('button');
        closeButton.classList.add('prompt-close-button');
        closeButton.textContent = 'Fermer';
        closeButton.addEventListener('click', () => {
          promptContainer.remove(); // Remove the prompt dialog
        });
      
        // Append message to cadre
        cadre.appendChild(message);
      
        // Append cadre and close button to prompt dialog
        promptDialog.appendChild(cadre);
        promptDialog.appendChild(closeButton);
      
        // Append the prompt dialog to the container
        promptContainer.appendChild(promptDialog);
      
        // Append the container to the document body
        document.body.appendChild(promptContainer);
      
        return;
      }
      const { source, target } = params;
  
      
      // Find source and target nodes
      const sourceNode = flowElements.find((node) => node.id === source);
      const sourceId = parseInt(sourceNode.id.split('-')[1]);
      const targetNode = flowElements.find((node) => node.id === target);
      const TargetId = parseInt(targetNode.id.split('-')[1]);

  /*
      // Check if source and target nodes exist and have the same style
      if (sourceNode && targetNode && JSON.stringify(sourceNode.style) === JSON.stringify(targetNode.style)) {
        // If they have the same style, prevent edge creation
        return;
      } */

      if(sourceNode.id.startsWith('Transition-') && targetNode.id.startsWith('Transition-')) return;
      else if(sourceNode.id.startsWith('place-') && targetNode.id.startsWith('place-')) return;
  
      // Determine the type based on the selected marker type
      const type = selectedMarkerType === MarkerType.ArrowClosed ? false : true;

      if (sourceNode.id.startsWith('Transition-') && targetNode.id.startsWith('place-') && type) {
        // If condition is met, return without creating the arc
        return;
      }
  
// Add the new arc to your PetriNet
PetriNet.addArc(); // Assuming undefined for name
if (sourceNode.id.startsWith('place-')){
  PetriNet.arc[PetriNet.nb_arc-1].Place = PetriNet.place[sourceId];    
  PetriNet.arc[PetriNet.nb_arc-1].Transition = PetriNet.transition[TargetId];
  PetriNet.arc[PetriNet.nb_arc-1].placeToTransition = true;
}

if (sourceNode.id.startsWith('Transition-')){
  PetriNet.arc[PetriNet.nb_arc-1].Transition = PetriNet.transition[sourceId];
  PetriNet.arc[PetriNet.nb_arc-1].Place = PetriNet.place[TargetId];
  PetriNet.arc[PetriNet.nb_arc-1].placeToTransition = false;
}

PetriNet.arc[PetriNet.nb_arc-1].weight = 1;

const arc = PetriNet.arc[PetriNet.nb_arc - 1];


      // Create a new edge with the selected marker type
      const newEdge = {
        id: `Arc-${arc.id_arc}`,
        type: 'smoothstep',
        source: String(params.source),
        target: String(params.target),
        label: '1',
        Inhibitor: arc.Inhibitor,
        weight: arc.weight,
        placeToTransition: arc.placeToTransition,
        markerEnd: { type: selectedMarkerType } // Use selectedMarkerType here
     
      };
      // Add the new edge to the edges state
      setEdges((prevEdges) => [...prevEdges, newEdge]);
  
      // Determine the direction based on the source and target nodes
      
      PetriNet.arc[PetriNet.nb_arc-1].Inhibitor = type;
  
  
   
  
  
    },
    [edges, flowElements, selectedMarkerType]
  );

  const handleMouseEnter = (text) => {
    setTempTable([]); // Reset tempTable after creating edge
    setTooltipText(text);
  };

  const handleMouseLeave = () => {
    setTempTable([]); // Reset tempTable after creating edge
    setTooltipText('');
  };

const onEdgeUpdateStart = useCallback(() => {
  edgeUpdateSuccessful.current = false;
}, []);

const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
 /* edgeUpdateSuccessful.current = true;
  setEdges((prevEdges) => updateEdge(oldEdge, newConnection, prevEdges)); */
  
}, []);

const onEdgeUpdateEnd = useCallback((_, edge) => { 
  if (stopping === 0) {
showPromptDialog('On ne peut pas modifier le réseau de Petri durant une pause.');
    return;
}
    const arcId = parseInt(edge.id.split('-')[1]);
    PetriNet.removeArc(arcId);
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));

    setEdges(prevEdges => 
      prevEdges.map(el => {
        if (el.id.startsWith('Arc-') && parseInt(el.id.split('-')[1]) > arcId) {
          const updatedId = `Arc-${parseInt(el.id.split('-')[1]) - 1}`;
          return {
            ...el,
            id: updatedId,
          };
        }
        return el;
      })
    );
}, []);

const handleCheckboxChange = () => {
  setShowGroup(!showGroup);
};

const handleCheckboxChangeGraph = () => {
  setShowGroupGraphe(!showGroupGraphe);
};

return (
  <>
    <div className='flex justify-between items-center h-12 mx-auto px-4 bg-[#20B2AA]'>
      <Link to="/" className="logo">
            <img src={LogoPng} alt="Logo" className="w-16 h-10 mr-2 mb-4"/>  
      </Link>    
      <ul className='flex items-center space-x-3'>
        <li id="button_guide" className='text-white cursor-pointer border border-solid border-white py-1 px-3 rounded-2xl bg-[#20B2AA]'> 
          <button onClick={() => initialization(0, setTempTable)}>Guide</button>
        </li>
        <li className='w-8 h-8 rounded-xl cursor-pointer flex items-center justify-center' id='fitToWidth' style={{ backgroundColor: 'rgba(32, 178, 170, 0.36)' }}>
          <FontAwesomeIcon icon={faExpand } style={{ color: '#FFF' }}  onClick={() => fitToWidth(setTempTable)}/>
        </li>

      </ul>
    </div>
    <div className="bg-[#F5F5F5] p-1"></div>
    <IconContext.Provider value={{ color: '#fff' }}>
  
      <div className="navbar">
        <div className="wrapper">
        <div className="groups" >

        
      <input type="checkbox" className="check" id="check" checked={showGroup} onChange={handleCheckboxChange}></input>
      <label htmlFor="check" className="checkbtn">
        <FontAwesomeIcon icon={faBars} />
      </label>
      
      <div className={`group1 ${showGroup ? 'show' : ''}`} >
            <div className="icon-container" id='shape-grille' onMouseEnter={() => handleMouseEnter('Grille')} onMouseLeave={handleMouseLeave}>
                <GridSelector onChange={handleGridOptionChange} />
                {tooltipText === 'Grille' && <div className="tooltip">{tooltipText}</div>}
            </div>
              <div className="icon-container" id='shape-import' onMouseEnter={() => handleMouseEnter('Importer')} onMouseLeave={handleMouseLeave}>
                      <FontAwesomeIcon 
                        icon={faFileImport}
                        style={{
                          color: lastClickedIcon === 'Importer' ? '#008080' : 'white',
                          cursor: 'pointer'
                        }}
                        onClick={() => { 
                          setLastClickedIcon('json');
                          handleImport();
                        }} />
                    {tooltipText === 'Importer' && <div className="tooltip">{tooltipText}</div>}
              </div>
              <div className="icon-container" id='shape-export' onMouseEnter={() => handleMouseEnter('Exporter')} onMouseLeave={handleMouseLeave} >
                
                <ExportIcon  
                  />
                  {tooltipText === 'Exporter' && <div className="tooltip">{tooltipText}</div>}
              </div>

            </div>
            <div className="group">

            <div className="icon-container" id='shape-place' onMouseEnter={() => handleMouseEnter('Ajouter place')} onMouseLeave={handleMouseLeave}>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      color: lastClickedIcon === 'place' ? '#008080' : 'white',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleAddElementClick('place');
                    }}
                    >
                <circle cx="12" cy="12" r="10" fill="white" stroke="black" stroke-width="1" />
              </svg>
                {tooltipText === 'Ajouter place' && <div className="tooltip">{tooltipText}</div>}
              </div>

        

              <div className="icon-container" id='shape-transition1' onMouseEnter={() => handleMouseEnter('Ajouter transition immédiate')} onMouseLeave={handleMouseLeave}>
                <svg
                  width="17"
                  height="18"
                  viewBox="0 0 18 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    color: lastClickedIcon === 'transitionI' ? '#008080' : 'white',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                  onClick={() => {
                    handleAddElementClick('transitionI');
                  }}
                >
                  <rect x="2.13672" y="2.14453" width="13.7646" height="19.7646" fill="black" stroke="black" stroke-width="2" rx="2" />
                </svg>
                {tooltipText === 'Ajouter transition immédiate' && <div className="tooltip">{tooltipText}</div>}
              </div>

              <div className="icon-container" id='shape-transition2' onMouseEnter={() => handleMouseEnter('Ajouter transition temporisée')} onMouseLeave={handleMouseLeave}>
                <svg
                  width="17"
                  height="19"
                  viewBox="0 0 18 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    color: lastClickedIcon === 'transitionT' ? '#008080' : 'white',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                  onClick={() => {
                    handleAddElementClick('transitionT');
                  }}
                >
            <rect x="2.13672" y="2.14453" width="13.7646" height="19.7646" fill="white" stroke="black" stroke-width="1" rx="2" />
          </svg>
                {tooltipText === 'Ajouter transition temporisée' && <div className="tooltip">{tooltipText}</div>}
              </div>


              <div className="icon-container" id='shape-arc1' onMouseEnter={() => handleMouseEnter('Ajouter arc')} onMouseLeave={handleMouseLeave}>
                  <svg
                        width="17"
                        height="17"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: 'white', cursor: 'pointer' }}
                        onClick={handleArrowButtonClick}
                      >
                <path d="M20.1784 0.114041L5.03404 4.11779L16.0215 14.5219L20.1784 0.114041ZM1.90913 20.3015L12.5411 9.61064L10.5628 7.33855L0.025843 18.0206L1.90913 20.3015Z" fill="black" />
              </svg>
                {tooltipText === 'Ajouter arc' && <div className="tooltip">{tooltipText}</div>}
              </div>

              <div className="icon-container"  id='shape-arc2' onMouseEnter={() => handleMouseEnter('Ajouter arc inhibiteur')} onMouseLeave={handleMouseLeave}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: 'white', cursor: 'pointer' }}
                  onClick={handleCircleButtonClick}
                >
                  <line x1="16.3861" y1="4.44301" x2="1.09099" y2="19.7289" stroke="black" stroke-width="2" />
                  <circle cx="14.028" cy="6.57446" r="5.95" fill="white" stroke="black" stroke-width="1" />
                </svg>
                {tooltipText === 'Ajouter arc inhibiteur' && <div className="tooltip">{tooltipText}</div>}
              </div>
            
            </div>
           <div className="group">
             {/*  <div className="icon-container" id='shape-place' onMouseEnter={() => handleMouseEnter('Ajouter place')} onMouseLeave={handleMouseLeave}>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      color: lastClickedIcon === 'place' ? '#008080' : 'white',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleAddElementClick('place');
                    }}
                    >
                <circle cx="12" cy="12" r="10" fill="white" stroke="black" stroke-width="1" />
              </svg>
                {tooltipText === 'Ajouter place' && <div className="tooltip">{tooltipText}</div>}
                  </div>*/}
              <div className="icon-container" id="shape-play" onMouseEnter={() => handleMouseEnter('Simuler')} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon
                    icon={faPlay}
                    style={{
                      color: lastClickedIcon === 'run' ? '#008080' : 'white',
                      cursor: 'pointer'
                    }}
                    onClick={() => { 
                      setLastClickedIcon('run'); 
                      startSimulation( setIntervalId, flowElements, setFlowElements,setPausing,stimulationSpeed,stopping,setStopping) ;
                    }} 
                  />
                  {tooltipText === 'Simuler' && <div className="tooltip">{tooltipText}</div>}
              </div>

              <div className="icon-container" id="shape-nextStep" onMouseEnter={() => handleMouseEnter('Simuler par étape')} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon
                  icon={faStepForward}
                  style={{
                    color: lastClickedIcon === 'step' ? '#008080' : 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => { 
                    setLastClickedIcon('step'); 
                  stepSimulation( flowElements, setFlowElements)} 
                  }
                />
                {tooltipText === 'Simuler par étape' && <div className="tooltip">{tooltipText}</div>}
              </div>

              <div className="icon-container" id="shape-clock" onMouseEnter={() => handleMouseEnter('Changer la vitesse')} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon
                  icon={faClock}
                  style={{
                    color: lastClickedIcon === 'clock' ? '#008080' : 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => { 
                    setLastClickedIcon('clock'); 
                    handleSpeedAdjustment(setTempTable, pausing, stopping,setStimulationSpeed )}}  
                />
                {tooltipText === 'Changer la vitesse' && <div className="tooltip">{tooltipText}</div>}
              </div>

              <div className="icon-container" id="shape-pause" onMouseEnter={() => handleMouseEnter('Suspendre')} onMouseLeave={handleMouseLeave}>
                  <FontAwesomeIcon
                    icon={faPause}
                    style={{
                      color: lastClickedIcon === 'pause' ? '#008080' : 'white',
                      cursor: 'pointer'
                    }}
                    onClick={() => { 
                      setLastClickedIcon('pause'); 
                      pauseSimulation( clearInterval, intervalId,setPausing)}}  
                  />
                  {tooltipText === 'Suspendre' && <div className="tooltip">{tooltipText}</div>}
              </div>

              <div className="icon-container" id="shape-stop" onMouseEnter={() => handleMouseEnter('Arrêter')} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon
                  icon={faStop}
                  style={{
                    color: lastClickedIcon === 'stop' ? '#008080' : 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => { 
                    setLastClickedIcon('stop'); 
                    stopSimulation( clearInterval, intervalId,setStopping)}}
                />
                {tooltipText === 'Arrêter' && <div className="tooltip">{tooltipText}</div>}
              </div>
            </div>
            <div className="group">
              <div className="icon-container" id="shape-exit" onMouseEnter={() => handleMouseEnter('Supprimer')} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon
                  icon={faXmark}
                  style={{
                    color: lastClickedIcon === 'remove' ? '#008080' : 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => { setLastClickedIcon('remove'); }}
                />
                {tooltipText === 'Supprimer' && <div className="tooltip">{tooltipText}</div>}
              </div>

            <div className="icon-container" id="shape-save" onMouseEnter={() => handleMouseEnter('Sauvegarder')} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon
                  icon={faSave}
                  style={{
                    color: lastClickedIcon === 'save' ? '#008080' : 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => { 
                    setLastClickedIcon('save');
                    handleSaveNet(setTempTable, flowElements, edges, variant, setVariant);
                  }}
                />
                {tooltipText === 'Sauvegarder' && <div className="tooltip">{tooltipText}</div>}
              </div>

              <div className="icon-container" id="shape-reset" onMouseEnter={() => handleMouseEnter('Supprimer Tout')} onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{
                    color: lastClickedIcon === 'reset' ? '#008080' : 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => { 
                    setLastClickedIcon('reset'); 
                    handleResetCanvas(dispatch,setTempTable, setFlowElements, setEdges)();
                  }} 
                />
                {tooltipText === 'Supprimer Tout' && <div className="tooltip">{tooltipText}</div>}
              </div>

            </div>


            <input type="checkbox" id="checkGraphe" className="check" checked={showGroupGraphe} onChange={handleCheckboxChangeGraph}></input>
             <label htmlFor="checkGraphe" className="checkbtn">
            <div>GM</div>
            </label>
      
      <div className={`group2 ${showGroupGraphe ? 'show' : ''}`} >
                  <div   className="icon-container" id="shape-graph1"
                      style={{
                        color: lastClickedIcon === 'GrapheTangible' ? '#008080' : 'white',
                        cursor: 'pointer'
                      }} 
                      onClick={() => {
                        setLastClickedIcon('GrapheTangible');
                        ShowMarkingGraph(setTempTable);
                        }}
                      >    
                  GMA
                  </div>
                  <div  className="icon-container"  id="shape-graph2"
                      style={{
                        color: lastClickedIcon === 'GrapheReduit' ? '#008080' : 'white',
                        cursor: 'pointer'
                      }} 
                      onClick={() => {
                        ShowMarkingGraphReduced(setTempTable);
                        setLastClickedIcon('GrapheReduit');
                        }}
                    >       
                  GMR
                  </div>
                  <div  className="icon-container"  id="shape-prop"
                      style={{
                        color: lastClickedIcon === 'proprietes' ? '#008080' : 'white',
                        cursor: 'pointer'
                      }} 
                      onClick={() => {
                        setLastClickedIcon('proprietes');
                        ShowProprieties(setTempTable,stopping );
                        }}
                    >       
                  Propriétes
                  </div>
            </div>
        </div>
      </div>
{/* the popups of the navbar tools */}

<div id="popup1">
     <div>
       <h3>Grille</h3>
       <p>Cliquer pour choisir le type de la grille</p>
       <button class="button_st" onClick={() => continuePop(2,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(1,'shape-grille')}>passer</button>
     </div>
   </div>

   <div id="popup2">
     <div>
       <h3>Importer</h3>
       <p>Cliquer pour importer un fichier</p>
       <button class="button_st" onClick={() => continuePop(3,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(2,'shape-import')}>passer</button>
     </div>
   </div>

   <div id="popup3">
     <div>
       <h3>Exporter</h3>
       <p>Cliquer pour exporter en format:PNG/JPG/PDF/PGO</p>
       <button class="button_st" onClick={() => continuePop(4,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(3,'shape-export')}>passer</button>
     </div>
   </div>

   <div id="popup4">
     <div>
       <h3>Place</h3>
       <p>Cliquer pour ajouter une place</p>
       <button class="button_st" onClick={() => continuePop(5,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(4,'shape-place')}>passer</button>
     </div>
   </div>

   <div id="popup5">
     <div>
       <h3>Transition immédiate</h3>
       <p>Cliquer pour ajouter une transition immédiate</p>
       <button class="button_st" onClick={() => continuePop(6,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(5,'shape-transition1')}>passer</button>
     </div>
   </div>

   <div id="popup6">
     <div>
       <h3>Transition temporisée</h3>
       <p>Cliquer pour ajouter une transition temporisée</p>
       <button class="button_st" onClick={() => continuePop(7,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(6,'shape-transition2')}>passer</button>
     </div>
   </div>

   <div id="popup7">
     <div>
       <h3>Arc</h3>
       <p>Cliquer pour ajouter un arc </p>
       <button class="button_st" onClick={() => continuePop(8,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(7,'shape-arc1')}>passer</button>
     </div>
   </div>

   <div id="popup8">
     <div>
       <h3>Arc inhibiteur</h3>
       <p>Cliquer pour ajouter un arc inhibiteur</p>
       <button class="button_st" onClick={() => continuePop(9,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(8,'shape-arc2')}>passer</button>
     </div>
   </div>

   <div id="popup9">
     <div>
       <h3>Simuler</h3>
       <p>Cliquer pour lancer la simulation</p>
       <button class="button_st" onClick={() => continuePop(10,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(9,'shape-play')}>passer</button>
     </div>
   </div>

   <div id="popup10">
     <div>
       <h3>Simuler étape par étape</h3>
       <p>Cliquer pour simuler étape par étape</p>
       <button class="button_st" onClick={() => continuePop(11,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(10,'shape-nextStep')}>passer</button>
     </div>
   </div>

   <div id="popup11">
     <div>
       <h3>Vitesse</h3>
       <p>Cliquer pour déterminer la vitesse de la simulation</p>
       <button class="button_st" onClick={() => continuePop(12,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(11,'shape-clock')}>passer</button>
     </div>
   </div>

   <div id="popup12">
     <div>
       <h3>Suspendre</h3>
       <p>Cliquer pour suspendre la simulation</p>
       <button class="button_st" onClick={() => continuePop(13,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(12,'shape-pause')}>passer</button>
     </div>
   </div>

   <div id="popup13">
     <div>
       <h3>Arreter</h3>
       <p>Cliquer pour arreter la simulation</p>
       <button class="button_st" onClick={() => continuePop(14,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(13,'shape-stop')}>passer</button>
     </div>
   </div>

   <div id="popup14">
     <div>
       <h3>Supprimer</h3>
       <p>Cliquer pour supprimer une place, une transition ou un arc </p>
       <button class="button_st" onClick={() => continuePop(15,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(14,'shape-exit')}>passer</button>
     </div>
   </div>

   <div id="popup15">
     <div>
       <h3>Sauvegarder</h3>
       <p>Cliquer pour sauvegarder le canva</p>
       <button class="button_st" onClick={() => continuePop(16,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(15,'shape-save')}>passer</button>
     </div>
   </div>

   <div id="popup16">
   <div>
       <h3>Supprimer tout</h3>
       <p>Cliquer pour supprimer le tout</p>
       <button class="button_st" onClick={() => continuePop(17,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip( 16,'shape-reset')}>passer</button>
     </div>
</div>

<div id="popup17">
   <div>
       <h3>Graphe de marquage</h3>
       <p>Cliquer pour afficher le graphe de marquage</p>
       <button class="button_st" onClick={() => continuePop(18,setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(17,'shape-graph1')}>passer</button>
     </div>
</div>

<div id="popup18">
      <div>
       <h3>Graphe de marquage réduit</h3>
       <p>Cliquer pour afficher le graphe de marquage réduit</p>
       <button class="button_st" onClick={() => continuePop(19, setTempTable)}>continuer</button>
       <button class="button_st" onClick={() => skip(18,'shape-graph2')}>passer</button>
     </div>
</div>

<div id="popup19">
      <div>
       <h3>Propiétes</h3>
       <p>Cliquer pour afficher les propriétes du system crée </p>
       <button class="button_finguide" onClick={() => skip(19,'shape-prop',setTempTable)}>Terminer</button>
     </div>
</div>
 </div>
 {/* end of groups */}

{/* popup of the guide */}
 <div id="popup0">
   <div>
     <h3 className='text-white'>GUIDE</h3>
     <button class="button_st" onClick={() => continuePop(1,setTempTable)}>continuer</button>
     <button class="button_st" onClick={() => skip(0)}>passer</button>
    </div>
 </div>
      <div id='graph' style={{ height: '100vh', backgroundColor: '#F5F5F5'}}>

        <ReactFlow 
            nodes={flowElements}
            edges={edges} 
            snapToGrid={true} 
            onEdgeUpdate={onEdgeUpdate} 
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            //onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionLineType="smoothstep" 
            animated={true} 
            onNodeDragStop={onNodeDragStop}
            onNodeContextMenu={updatenodes}
            onEdgeContextMenu={updateArcLabel}

            zoomOnScroll={false} 
            zoomOnDoubleClick={false}        

            onEdgeClick={handleClick} 
            onClick={(event) => {
              const nodeId = event.target.dataset.id;   
              if (nodeId === undefined )  setTempTable([]); // Reset tempTable after creating edge
              else 
              if (nodeId.id !== undefined )     setTempTable([]); // Reset tempTable after creating edge
  
                handleClick(event, nodeId);
            }}  
        >
       {/* <CircleMarker/>*/}
            <Background color="#ccc" gap={30} variant={variant} />
               
        </ReactFlow>
      </div>
      </IconContext.Provider>
    </>
  );
}
export default Navbar;