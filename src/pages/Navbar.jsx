import React, { useState, useRef, useEffect, useCallback  }from 'react';
import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { IconContext } from 'react-icons';
import 'reactflow/dist/style.css';
import  {  MarkerType } from 'reactflow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay,faStepForward , faStop, faXmark, faTrash,faClock,faExpand,faSave,faFileImport } from '@fortawesome/free-solid-svg-icons';
import useAddingPlace from '../Functions/AddingPlace.js';
import useAddingTransitionI from '../Functions/AddingTransI.js';
import useAddingTransitionT from '../Functions/AddingTransT.js';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { PetriNet } from '../modules/Petri_Net.js';
import  { startSimulation, pauseSimulation, stopSimulation, stepSimulation } from '../Functions/simulate.js';
import {Marking_graphe} from '../modules/Marking_graphe.js';
import {MarkingGraph} from '../modules/MarkingGraph.js';
import LogoPng from '../logo/logoPng2.png';
import {  onEdgeClick,onNodeClick } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { saveNet, resetNet ,clearFlowElements,selectNodes, selectEdges,loadNet } from '../redux/netSlice';
import {Marking_reduced} from '../modules/Marking_reduced.js';
import ExportIcon from "../components/ExportIcon";
import GridSelector from '../components/GridSelector.js';
import { faBars } from '@fortawesome/free-solid-svg-icons'; // Import
//import CircleMarker from './CircleMarker.js';
import ReactDOM from 'react-dom';
import  { 
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  updateEdge,
  ReactFlowProvider,
} from 'reactflow';



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
  const [counter, setCounter] = useState(0);
  const [isCanvasHovered, setIsCanvasHovered] = useState(false); 
  const [addingElement, setAddingElement] = useState(null); // Track the currently adding element
  const canvasRef = useRef(null);
  const nodes = useSelector(selectNodes);
  const edge = useSelector(selectEdges);
  const dispatch = useDispatch();
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedMarkerType, setSelectedMarkerType] = useState(MarkerType.ArrowClosed);
  const onElementClick = (event, element) => console.log('click', element);
  const [captureElementClick, setCaptureElementClick] = useState(false);
  const [selectedOption, setSelectedOption] = useState('dots');
  const [popup16Visible, setPopup16Visible] = useState(true);
  const [popup17Visible, setPopup17Visible] = useState(false);
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
  
  const fitToWidth = () => {
    setTempTable([]); // Reset tempTable after creating edge
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };
  const handleGridOptionChange = (option) => {
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


  const loadNetFromLocalStorage = useCallback(() => {
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
    
  }, [dispatch]);
    
  useEffect(() => {
    loadNetFromLocalStorage();
  }, []);

  const [variant, setVariant] = useState(() => {
    const savedVariant = localStorage.getItem('variant');
    return savedVariant ? savedVariant : 'dots';
  });

  useEffect(() => {
    localStorage.setItem('variant', variant);
  }, [variant]);

  const handleSaveNet = () => {
    setTempTable([]); // Reset tempTable after creating edge
    const nodesData = JSON.stringify(flowElements);
    const edgesData = JSON.stringify(edges);
    localStorage.setItem('nodes', nodesData);
    localStorage.setItem('edges', edgesData);
    setVariant(variant);
  };
  const handleImport = () => {
    setTempTable([]); // Reset tempTable after creating edge

    if ( stopping === 0) {
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
      message.textContent = 'On ne peut pas modifier le réseau de Petri durant une pause.';
    
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
  
   importPetriNetFromJSON().then(() => {
    PetriNet.nb_place = 0;
    PetriNet.nb_arc = 0;
    PetriNet.nb_transition = 0;
    setFlowElements([]);
    setEdges([]);
    addPlaceCanva(); 
    addTransitionCanva();
    importArcs();
  }).catch(error => {
    // Handle errors if importPetriNetFromJSON() fails
    console.error('Error importing Petri net:', error);
  });
  };

    const handleResetCanvas = () => {
      setTempTable([]); // Reset tempTable after creating edge
      dispatch(resetNet());
      dispatch(clearFlowElements());
      setFlowElements([]);
      setEdges([]);
     

    };

    function ShowMarkingGraph() {
      setTempTable([]); // Reset tempTable after creating edge
          PetriNet.getMarquageInitial();
          PetriNet.create_pre_post();
    
      const e = new MarkingGraph();
      e.markingGraph();
      const Graph = new Marking_graphe(e);
      Graph.create_nodes();
      Graph.create_edges();
    
       
const nodesArray = Graph.nodes.map((node, i) => {
  if (node.id === 'Node1') {
      return { id: node.id ,label: node.label, 
        color: 'white' ,
        color: {
          background: 'white', 
          border: 'black' 
      },
        borderWidth: 3, 
        size: 120,
  } }else {
    const match = node.id.match(/Node(\d+)/);
    let id_node = 0;
    if (match) {
        id_node = parseInt(match[1], 10);
    }
    if ( e.accessible_marking[id_node-1].tangible ){
      return { id: node.id, label: node.label,color: {
        background: '#FEEFAD', 
        border: 'black' // Ajouter une bordure noire au premier nœud si nécessaire
    },
  }} else {
    return { id: node.id, label: node.label, color: 'white',  color: {
      background: '#D8E4FF', 
      border: 'black' 
  }, };
  }
  }
});
    const edgesArray = Graph.edges.map(edge => {
      const [transition, weight] = edge.label.split(':');
      const match = transition.match(/T(\d+)/);
      let id_Transition = 0;
      if (match) {
          id_Transition = parseInt(match[1], 10);
      }
      // Check priority of the transition and set edge color accordingly
      let edgeOptions = {};
      if (PetriNet.transition[id_Transition].priority == 0) {
          edgeOptions = {
              color: {
                  color: 'red', // Set edge color to red for high priority transitions
                  highlight: 'red', // Highlight color for red edges
                  hover: 'red', // Hover color for red edges
              },
          };
      }
      return { 
          from: edge.from, 
          to: edge.to, 
          label: `${PetriNet.transition[id_Transition].name}: ${weight}`, // Fix the label format
          font: {
              strokeWidth: 0,
              size: 16,
              bold: true,
          },
          length: 200,
          ...edgeOptions 
      };
  });
  
    
      // Create HTML content for the graph
      const graphHTMLContent = `
          <!DOCTYPE html>
          <html>
          <head>
              <title>Marking Graph</title>
              <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
              <style>
              body, html {
                  margin: 0;
                  padding: 0;
                  height: 1000px;
              }
              
              body {
                  display: flex;
                  align-items: stretch; /* Ensure body stretches to full height */
              }
              
              .graph-container {
                  flex: 1; /* Take up remaining space */
                  cursor: pointer;
                  height: 100vh; /* Set the height of the container to the full viewport height */
              }
              
              .vis-network canvas {
                  width: 100% !important; /* Ensure the canvas takes up the full width of the container */
                  height: 100% !important; /* Ensure the canvas takes up the full height of the container */
              }
          </style>
          
          </head>
          <body>
              <div id="graph-container"></div>
              <script>
              const nodes = ${JSON.stringify(nodesArray)};
              const edges = ${JSON.stringify(edgesArray)};
              const graphData = {
                  nodes: nodes,
                  edges: edges,
              };
          
              var container = document.getElementById("graph-container");
              var options = {
                edges: {
                    color: {
                        color: 'black',
                        hover: 'red',
                        inherit: false,
                    },
                    arrows: {
                        to: {
                            enabled: true,
                            scaleFactor: 0.5,
                            type: 'arrow',
                        },
                    },
                },
                physics: {
                  barnesHut: {
                      "gravitationalConstant": -3900,
                      "centralGravity": 0
                  },
                  minVelocity: 1
              }, autoResize: true,
              interaction: {
                navigationButtons: true,
                zoomView: false, 
            },
            };
            

              const graphOptions = {
                  nodes: {
                      shape: 'ellipse',
                      size: 30, // Increase the size of the nodes
                  },
                  edges: {
                      // fontsize: 10,
                  },
              };
          
              var net = new vis.Network(container, graphData, options);
          </script>
          
          </body>
          </html>
      `;
    
      // Create Blob URL
      const graphBlobURL = URL.createObjectURL(new Blob([graphHTMLContent], { type: 'text/html' }));
    
      // Open the Blob URL in a new window
      window.open(graphBlobURL);
    } 


    function ShowMarkingGraphReduced() {
      setTempTable([]); // Reset tempTable after creating edge
          PetriNet.getMarquageInitial();
          PetriNet.create_pre_post();
  
      const e = new MarkingGraph();
      e.markingGraph(); 
    const Graph = new Marking_reduced (e);
      Graph.create_nodes();
      Graph.create_edges();
 
    



      const nodesArray = Graph.nodes.map((node, i) => {
        if (node.id === 'Node1') {
            return { id: node.id ,label: node.label, 
          
              color: {
                background: 'white', 
                border: 'black' }
        } }else {
          return { id: node.id, label: node.label,color: {
            background: '#FEEFAD', 
            border: 'black' // Ajouter une bordure noire au premier nœud si nécessaire
        },
        }
     } });
      const edgesArray = Graph.edges.map(edge => ({ from: edge.from, to: edge.to, label: edge.label }));
      const graphHTMLContent = `
          <!DOCTYPE html>
          <html>
          <head>
              <title>Marking Graph Reduced </title>
              <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
              <style>
              body, html {
                margin: 0;
                padding: 0;
                height: 1000px;
            }
            
            body {
                display: flex;
                align-items: stretch; /* Ensure body stretches to full height */
            }
            
            .graph-container2 {
                flex: 1; /* Take up remaining space */
                cursor: pointer;
            }
            
            .vis-network {
                width: 100%;
                height: 100%;
                position: relative; /* Ensure the container stretches properly */
            }
            
            </style>
          </head>
          <body>
              <div id="graph-container2"></div>
              <script>
                  const nodes = ${JSON.stringify(nodesArray)};
                  const edges = ${JSON.stringify(edgesArray)};
                  const graphData = {
                      nodes: nodes,
                      edges: edges,
                  };
  
                  var container = document.getElementById("graph-container2");
                  var options = {
                    edges: {
                        color: {
                            color: 'black',
                            hover: 'red',
                            inherit: false,
                        },
                        arrows: {
                            to: {
                                enabled: true,
                                scaleFactor: 0.5,
                                type: 'arrow',
                            },
                        },
                    },
                 
                    physics:
                    {
                     enabled: false,
                    }, autoResize: true,
                  interaction: {
                      navigationButtons: true,
                      zoomView: false, 
                  },
                };
                
        
                const graphOptions = {
                    nodes: {
                        shape: 'ellipse',
                        color: '#ffffff',
                    },
                    edges: {
                       // fontsize: 10,
                    },
                };
        
                  var net = new vis.Network(container, graphData, options);
              </script>
          </body>
          </html>
      `;
  
      // Create Blob URL
      const graphBlobURL = URL.createObjectURL(new Blob([graphHTMLContent], { type: 'text/html' }));
  
      // Open the Blob URL in a new window
      window.open(graphBlobURL);
  }
  
  const handleSpeedAdjustment = () => {
    setTempTable([]); // Reset tempTable after creating edge
    const speeds = [0.25, 0.5, 1, 1.5, 2, 3]; // Define available speed options
    const currentSpeed = PetriNet.simulationSpeedCoefficient; // Get the current speed coefficient
    if ( pausing === 0 && stopping === 0   ) {
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
      message.textContent = 'On ne peut pas changer la vitesse durant la simulation.';
    
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
    // Create the prompt dialog container
    const promptContainer = document.createElement('div');
    promptContainer.classList.add('prompt-overlay'); // Add overlay class
  
    // Create the prompt dialog
    const promptDialog = document.createElement('div');
    promptDialog.classList.add('prompt-dialog-speed'); // Add dialog class
  
  
    // Create buttons for each speed option
    speeds.forEach(speed => {
        const button = document.createElement('button');
        button.textContent = `x${speed}`;
        button.classList.add('speed-button');
        if (speed === currentSpeed) {
            button.classList.add('selected-speed'); // Add selected-speed class if the speed matches the current speed coefficient
        }
        button.addEventListener('click', () => {
            setStimulationSpeed(speed);
            PetriNet.simulationSpeedCoefficient = speed;

            // Remove the selected-speed class from all speed buttons
            document.querySelectorAll('.speed-button').forEach(btn => {
                btn.classList.remove('selected-speed');
            });

            // Add the selected-speed class to the clicked button
            button.classList.add('selected-speed');

            document.body.removeChild(promptContainer); // Remove the prompt container from the DOM
        });
        promptDialog.appendChild(button);
    });
  
    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = "Fermer";
    closeButton.classList.add('closee-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(promptContainer); // Remove the prompt container from the DOM
    });
    promptDialog.appendChild(closeButton);
  
    // Append elements to the dialog
    promptContainer.appendChild(promptDialog);
  
    // Append the prompt container to the body
    document.body.appendChild(promptContainer);
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
        console.log(PetriNet.pre);
      };
  }, [intervalId]);

const [tempTable, setTempTable] = useState([]);


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
          setTempTable([]); // Reset tempTable after creating edge
            if (nodeId === undefined) return;
            if (nodeId.id === undefined) {
                if (nodeId.startsWith('place-')) {
                    removePlace(nodeId);
                } else {
                    removeTrans(nodeId);
                }
            } else {
                removeEdge(nodeId);
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


  const addPlaceCanva = (nodeId) => {  
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


   

  const addTransitionCanva = (nodeId) => {  
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



  const removeEdge = (nodeId) => {
  console.log('Removing edge with ID:', nodeId.id);

  if (stopping === 0) {
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
      message.textContent = 'On ne peut pas modifier le réseau de Petri durant une pause.';

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
  } else {
      if (nodeId.id.startsWith('Arc-')) {

      console.log("dkhelt");
      const arcId = parseInt(nodeId.id.split('-')[1]);
      PetriNet.removeArc(arcId);
      let updatedEdges = edges.filter((el) => el.id !== nodeId.id);
      
      updatedEdges = updatedEdges.map(el => {
        if (el.id.startsWith('Arc-') && parseInt(el.id.split('-')[1]) > arcId) {
            const updatedId = `Arc-${parseInt(el.id.split('-')[1]) - 1}`;
            return {
                ...el,
                id: updatedId,
            };
        }
        return el;
    });
      setEdges(updatedEdges);
      
  };

  } }

  const removeTrans = (nodeId) => {
    console.log('Removing trans with ID:', nodeId);

    if (stopping === 0) {
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
        message.textContent = 'On ne peut pas modifier le réseau de Petri durant une pause.';

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

    if  ( nodeId.startsWith('Transition-')) {
        const transId = parseInt(nodeId.split('-')[1]);


        let updatedEdges = edges;

        let i =0;
        while ( i < PetriNet.nb_arc) {
            if (PetriNet.arc[i].Transition.id_transition === transId) {
              console.log('heyyy ');
                const arcId = PetriNet.arc[i].id_arc;
                console.log('arc attached: ', PetriNet.arc[arcId]);
                PetriNet.removeArc(arcId);
                const Id = `Arc-${arcId}`;
                updatedEdges = updatedEdges.filter(el => el.id !== Id);
                updatedEdges = updatedEdges.map(el => {
                  if (el.id.startsWith('Arc-') && parseInt(el.id.split('-')[1]) > arcId) {
                      const updatedId = `Arc-${parseInt(el.id.split('-')[1]) - 1}`;
                      return {
                          ...el,
                          id: updatedId,
                      };
                  }
                  return el;
              });
            } else i++;
        }

        PetriNet.removeTransition(transId);
        const updatedElements = flowElements.filter(el => el.id !== nodeId);

        


        const updatedElementsWithNewIds = updatedElements.map(el => {
            if (el.id.startsWith('Transition-') && parseInt(el.id.split('-')[1]) > transId) {
                const updatedId = `Transition-${parseInt(el.id.split('-')[1]) - 1}`;
                let name = el.data.name; 

                // Check if the name follows the pattern P(number)
                const nameMatch = name.match(/^T(\d+)$/);
                if (nameMatch) {
                    // If it matches, update the name with the new ID
                    name = `T${parseInt(updatedId.split('-')[1])}`;
                    let idd = parseInt(updatedId.split('-')[1]);
                    PetriNet.transition[idd].name = name;
                }
                
                return {
                    ...el,
                    id: updatedId,
                    data: { ...el.data, label: <div className="custom-label">{name}</div>, name:name }
                };
            }
            return el;
        });

        setFlowElements(updatedElementsWithNewIds);  

        // Update edges connected to the updated places
        const updatedEdgesWithNewIds = updatedEdges.map(edge => {
            if (edge.source.startsWith('Transition-')) {
                const sourceId = parseInt(edge.source.split('-')[1]);
                if (sourceId > transId) {
                    edge.source = `Transition-${sourceId - 1}`;
                }
            } else if (edge.target.startsWith('Transition-')) {
                const targetId = parseInt(edge.target.split('-')[1]);
                if (targetId > transId) {
                    edge.target = `Transition-${targetId - 1}`;
                }
            }
            return edge;
        });

        setEdges(updatedEdgesWithNewIds);
        

    }


  };

  const removePlace = (nodeId) => {
  console.log('Removing node with ID:', nodeId);

  if (stopping === 0) {
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
      message.textContent = 'On ne peut pas modifier le réseau de Petri durant une pause.';

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

  if  ( nodeId.startsWith('place-')) {
      const placeId = parseInt(nodeId.split('-')[1]);


      let updatedEdges = edges;

      let i =0;
      while ( i < PetriNet.nb_arc) {
          if (PetriNet.arc[i].Place.id_place === placeId) {
            console.log('heyyy ');
              const arcId = PetriNet.arc[i].id_arc;
              console.log('arc attached: ', PetriNet.arc[arcId]);
              PetriNet.removeArc(arcId);
              const Id = `Arc-${arcId}`;
              updatedEdges = updatedEdges.filter(el => el.id !== Id);
              updatedEdges = updatedEdges.map(el => {
                if (el.id.startsWith('Arc-') && parseInt(el.id.split('-')[1]) > arcId) {
                    const updatedId = `Arc-${parseInt(el.id.split('-')[1]) - 1}`;
                    return {
                        ...el,
                        id: updatedId,
                    };
                }
                return el;
            });
          } else i++;
      }

      PetriNet.removePlace(placeId);
      const updatedElements = flowElements.filter(el => el.id !== nodeId);

      


      let updatedElementsWithNewIds = updatedElements.map(el => {
          if (el.id.startsWith('place-') && parseInt(el.id.split('-')[1]) > placeId) {
              const updatedId = `place-${parseInt(el.id.split('-')[1]) - 1}`;
              let name = el.data.name; 

              // Check if the name follows the pattern P(number)
              const nameMatch = name.match(/^P(\d+)$/);
              if (nameMatch) {
                  // If it matches, update the name with the new ID
                  name = `P${parseInt(updatedId.split('-')[1])}`;
                  let idd = parseInt(updatedId.split('-')[1]);
                  PetriNet.place[idd].name = name;
              }
              
              return {
                  ...el,
                  id: updatedId,
                  data: {
                    ...el.data,
                      name: name
                  }
              };
          }
          return el;
      });


        updatedElementsWithNewIds = updatedElementsWithNewIds.map(el => {
        if (el.id.startsWith('place-') ) {
            const Id = parseInt(el.id.split('-')[1]);
            let name = PetriNet.place[Id].name ;
            console.log('nameee = ', PetriNet.place[Id].name  );

            const tok =  PetriNet.place[Id].nb_tokens;
            const label = (
              <div>
                <div className="place-label">{name}</div>
                <div className='token-display'>
                  {/* Render token image or token count based on the tok */}
                  {tok > 0 && tok <= 10 ? (
                    <img alt='tokens' src={`/tokens/${tok}.svg`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  ) : tok > 10 ? (
                    <div className="number-display">{tok}</div>
                  ) : null}
                </div>
              </div>
            );
            

  
            
            return {
                ...el,
                data: { ...el.data, label: <div><div className="place-label">{name}</div>{el.data.label.props.children[1]}</div> }
            };
        }
        return el;
    });


      setFlowElements(updatedElementsWithNewIds);  

      // Update edges connected to the updated places
      const updatedEdgesWithNewIds = updatedEdges.map(edge => {
          if (edge.source.startsWith('place-')) {
              const sourceId = parseInt(edge.source.split('-')[1]);
              if (sourceId > placeId) {
                  edge.source = `place-${sourceId - 1}`;
              }
          } else if (edge.target.startsWith('place-')) {
              const targetId = parseInt(edge.target.split('-')[1]);
              if (targetId > placeId) {
                  edge.target = `place-${targetId - 1}`;
              }
          }
          return edge;
      });

      setEdges(updatedEdgesWithNewIds);
    /*   for(let i =0; i<PetriNet.nb_arc;i++){
        if(PetriNet.arc[i] !== null)
        if(PetriNet.arc[i].Place.id_place > placeId){
          PetriNet.arc[i].Place.id_place--;
        }
      }       */

  }


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

  function showFormPlace(nodeName, nodeCapacity, nodeTokenCount, callback, event) {
    const { clientX, clientY } = event;
    

    var tokensInputContainer = document.createElement('div');
    tokensInputContainer.classList.add('Question'); // Add the 'Question' class
    tokensInputContainer.style.left = `${clientX}px`; // Set left position
    tokensInputContainer.style.top = `${clientY}px`; // Set top position

    tokensInputContainer.innerHTML = `
      <div class="Questions">
      <div id="errors"></div>
        <label for="name">Nom</label>
        <input type="text" id="name" placeholder="nodename" value="${nodeName}" tabindex="0"/>
        <label for="tokens">Nombre de Jetons</label>
        <input type="text" id="tokens" placeholder="0" value="${nodeTokenCount}" tabindex="0"/>
        <label for="capacity">Capacité</label>
        <input type="text" id="capacity" value="${nodeCapacity}" tabindex="0"/>
        <button id="SubmitTokens">Submit</button>
      </div>`;

    document.body.appendChild(tokensInputContainer);

    // Attach event listener to the submit button
    var submitTokensButton = tokensInputContainer.querySelector('#SubmitTokens');
    submitTokensButton.addEventListener('click', function() {
      const updatedNodeName = tokensInputContainer.querySelector('#name').value;
      const updatedNodeTokenCount = parseInt(tokensInputContainer.querySelector('#tokens').value, 10);
      const updatedNodeCapacity = parseInt(tokensInputContainer.querySelector('#capacity').value, 10);
      const errorElement =  tokensInputContainer.querySelector('#errors');
      let messages = [];
  
      if (isNaN(updatedNodeTokenCount)) {
          messages.push('Le nombre de jetons doit être un nombre.');
      } else if (updatedNodeTokenCount < 0) {
          messages.push('Le nombre de jetons doit être positif.');
      }

      if (isNaN(updatedNodeCapacity)) {
        messages.push('La capacité doit être un nombre.');
    } else if (updatedNodeCapacity < 0) {
        messages.push('La capacité doit être positif.');
    }
    if (messages.length >0 ){
      errorElement.innerText = messages.join(',');
      errorElement.style.color = 'red';
    }else {
      errorElement.innerText = ''; // Clear any previous error messages
      tokensInputContainer.remove();
      callback(updatedNodeName, updatedNodeCapacity, updatedNodeTokenCount);
    }
    });
  }

  function showFormTransitionImm(nodeName, nodeWeight, callback, event) {
    const { clientX, clientY } = event;

    var tokensInputContainer = document.createElement('div');
    tokensInputContainer.classList.add('Question');
    tokensInputContainer.style.left = `${clientX}px`;
        tokensInputContainer.style.top = `${clientY}px`;
    tokensInputContainer.innerHTML = `
      <div class="Questions">
      <div id="errors"></div>
        <label for="name">Nom</label>
        <input type="text" id="name" placeholder="nodename" value="${nodeName}" tabindex="0"/>
        <label for="tokens">Poid</label>
        <input type="text" id="tokens" placeholder="0" value="${nodeWeight}" tabindex="0"/>
        <button id="SubmitTokens">Submit</button>
      </div>`;

    document.body.appendChild(tokensInputContainer);

    var submitTokensButton = tokensInputContainer.querySelector('#SubmitTokens');
    submitTokensButton.addEventListener('click', function() {
      const updatedNodeName = tokensInputContainer.querySelector('#name').value;
      const updatedNodeWeight = parseInt(tokensInputContainer.querySelector('#tokens').value, 10);
      const errorElement =  tokensInputContainer.querySelector('#errors');
      let messages = [];
  
      if (isNaN(updatedNodeWeight)) {
          messages.push('Le poids doit être un nombre.');
      } else if (updatedNodeWeight < 0) {
          messages.push('Le poids doit être positif.');
      }
    if (messages.length >0 ){
      errorElement.innerText = messages.join(',');
      errorElement.style.color = 'red';
    }else {
      errorElement.innerText = ''; // Clear any previous error messages
      tokensInputContainer.remove();
      callback(updatedNodeName, updatedNodeWeight);
    }
    });

    
  }

  function showFormTransitionTem(nodeName,nodeWeight, callback, event) {
    const { clientX, clientY } = event;

    var tokensInputContainer = document.createElement('div');
    tokensInputContainer.classList.add('Question');
    tokensInputContainer.style.left = `${clientX}px`;
    tokensInputContainer.style.top = `${clientY}px`;

    tokensInputContainer.innerHTML = `
    
      <div class="Questions">
      <div id="errors"></div>
        <label for="name">Nom</label>
        <input type="text" id="name" placeholder="nodename" value="${nodeName}" tabindex="0"/>
        <label for="name">Taux De Franchissement </label>
        <input type="text" id="Taux" placeholder="Taux" value="${nodeWeight}" tabindex="0"/>
        <button id="SubmitTokens">Submit</button>
      </div>`;

    document.body.appendChild(tokensInputContainer);

    var submitTokensButton = tokensInputContainer.querySelector('#SubmitTokens');
    submitTokensButton.addEventListener('click', function() {
      const updatedNodeName = tokensInputContainer.querySelector('#name').value;
      const updatedNodeWeight = parseFloat(tokensInputContainer.querySelector('#Taux').value, 10);
      const errorElement =  tokensInputContainer.querySelector('#errors');
      let messages = [];
  
      if (isNaN(updatedNodeWeight)) {
          messages.push('Le poids doit être un nombre.');
      } else if (updatedNodeWeight < 0) {
          messages.push('Le poids doit être positif.');
      }
    if (messages.length >0 ){
      errorElement.innerText = messages.join(',');
      errorElement.style.color = 'red';
    }else {
      errorElement.innerText = ''; // Clear any previous error messages
      tokensInputContainer.remove();
      callback(updatedNodeName, updatedNodeWeight);
    }
    });

   
  }

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


function importArcs(){
  
  if ( stopping === 0) {
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
    message.textContent = 'On ne peut pas modifier le réseau de Petri durant une pause.';
  
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
const updateArcLabel = (event, edge) => {
  setTempTable([]); // Reset tempTable after creating edge

  event.preventDefault();
  if (edge.id === undefined) 
      return;
  // Create the prompt dialog container
  const promptContainer = document.createElement('div');
  promptContainer.classList.add('prompt-overlay');

  // Create the prompt dialog
  const promptDialog = document.createElement('div');
  promptDialog.classList.add('prompt-dialog-arc');


  // Create the label element
  const label = document.createElement('div');
  label.classList.add('prompt-label');
  label.textContent = "Entrer le poids de l'arc:";
  const errorMessage = document.createElement('div');
  errorMessage.classList.add('prompt-error-message');
  
  // Append the error message element to the prompt dialog
  promptDialog.appendChild(errorMessage);
  // Create the input field
  const input = document.createElement('input');
  input.classList.add('prompt-input');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'Enter label');
  input.value = edge.label;

  // Create the submit button
  const submitButton = document.createElement('button');
  submitButton.classList.add('prompt-submit-arc');
  submitButton.textContent = 'Submit';

  // Event listener for submit button
  submitButton.addEventListener('click', () => {
    const weightInput = parseFloat(input.value.trim());

    if (isNaN(weightInput) || weightInput <= 0) {
        errorMessage.textContent = "Le poids doit être un nombre positif.";
        errorMessage.style.color = 'red';
    }else
   { const newLabel = input.value;
    const newWeight = parseInt(input.value);
    const idd = parseInt(edge.id.split('-')[1]);
    PetriNet.arc[idd].weight = newWeight;
    const updatedEdge = edges.map((e) => {
      if (e.id === edge.id) {
        return { ...e, weight: newWeight };
      }
      return e;
    });

    if (newLabel !== '') {
      // Update the label of the corresponding arc
      const updatedEdges = updatedEdge.map((e) => {
        if (e.id === edge.id) {
          return { ...e, label: newLabel };
        }
        return e;
      });
      setEdges(updatedEdges);
    }
    promptContainer.remove(); // Remove the prompt dialog
 } });

  // Append elements to the prompt dialog
  promptDialog.appendChild(label);
  promptDialog.appendChild(input);
  promptDialog.appendChild(submitButton);

  // Append the prompt dialog to the container
  promptContainer.appendChild(promptDialog);

  // Append the container to the document body
  document.body.appendChild(promptContainer);

 
  

};



const [tooltipText, setTooltipText] = useState('');

  const handleMouseEnter = (text) => {
    setTempTable([]); // Reset tempTable after creating edge
    setTooltipText(text);
  };

  const handleMouseLeave = () => {
    setTempTable([]); // Reset tempTable after creating edge
    setTooltipText('');
  };


  function ShowProprieties(){
    setTempTable([]); // Reset tempTable after creating edge


    if (stopping === 1) {
      PetriNet.getMarquageInitial();
      PetriNet.create_pre_post();
  }

  const e = new MarkingGraph();
  e.markingGraph();
    var tokensInputContainer = document.createElement('div');
    tokensInputContainer.classList.add('Question'); 
    tokensInputContainer.innerHTML = `
    <div class="Questions">
    <label for="name">Propriétés </label>
    <p id="BornitudeDisplay">Bornitude: ${e.bornetude}</p>
    <p id="BornitudeDisplay">Infini: ${e.Infini}</p>
    <p id="BornitudeDisplay">Vivacité: ${PetriNet.alive}</p>
    <p id="BornitudeDisplay">Persistance: ${ PetriNet.persistent}</p>
    <p id="BornitudeDisplay">Reinitiabilité: ${ e.resettable}</p>
    <button id="SubmitTokens">Fermer</button>
  </div>`;
    document.body.appendChild(tokensInputContainer);

    // Attach event listener to the submit button
    var submitTokensButton = tokensInputContainer.querySelector('#SubmitTokens');
    submitTokensButton.addEventListener('click', function() {
      tokensInputContainer.remove();
    });
  }



// functions of the guide 

const blurElem = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.style.filter = "blur(7px)";
    element.style.transition = "filter 0.3s ease"; // Apply transition for a smooth effect
    element.style.transform = `scale(${1})`; // Scale the elemen

    

  }
};

const inBlurElem = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.style.filter = "blur(0px)";
    element.style.transition = "filter 0.2s ease"; // Apply transition for a smooth effect
    element.style.transform = `scale(${1.3})`; // Scale the elemen
  }
};


const blurBackground = () => {
  const elements = ["logo","button_guide","fitToWidth","shape-grille","shape-import","shape-export","shape-place","shape-transition1","shape-transition2","shape-arc1","shape-arc2" , "shape-play","shape-nextStep" , "shape-clock", "shape-pause","shape-stop","shape-exit","shape-save","shape-reset","shape-graph1","shape-graph2","shape-prop"];
  elements.forEach((id) => {
    if (id !== "popup0") {
      blurElem(id);
    }
  });
};

const initialization = (p) => {
  setTempTable([]); // Reset tempTable after creating edge

  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  blurBackground();
  document.getElementById("popup" + String(p)).classList.toggle('active');
};

const inBlurBackground = () => {
  const elements = ["logo","button_guide","fitToWidth","shape-grille","shape-import","shape-export","shape-place","shape-transition1","shape-transition2","shape-arc1","shape-arc2" , "shape-play","shape-nextStep" , "shape-clock", "shape-pause","shape-stop","shape-exit","shape-save","shape-reset","shape-graph1","shape-graph2","shape-prop"];
  elements.forEach((id) => {
    inBlurElem(id);
    const element = document.getElementById(id);
    if (element) {
      element.style.transform = `scale(1)`; 
    }
  });
};

// Function to skip the popup
const skip = (p, id) => {
document.getElementById("popup" + String(p)).classList.toggle('active');
inBlurBackground();

window.scroll({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
};

// Function to finish the popup
const finish = (p) => {
document.getElementById("popup" + String(p)).classList.toggle('active');
inBlurBackground();
window.scroll({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
};



// continue funct
const continuePop = (p) => {
  setTempTable([]); // Reset tempTable after creating edge

  const popupPrevious = document.getElementById("popup" + String(p - 1));
  const popupCurrent = document.getElementById("popup" + String(p));

  if (popupPrevious) {
    popupPrevious.classList.toggle('active');
  }
  if (popupCurrent && p !== 20) {
    popupCurrent.classList.toggle('active');
  }

  switch (p) {
    case 1:
      inBlurElem("shape-grille");
      break;
    case 2:
      inBlurElem("shape-import");
      blurElem("shape-grille");    
      break;
    case 3:
      inBlurElem("shape-export");
      blurElem("shape-import");    

      break;
    case 4:
        inBlurElem("shape-place");
        blurElem("shape-export");    

       break;
    case 5:
        inBlurElem("shape-transition1");
        blurElem("shape-place");    

       break;
    case 6:
        inBlurElem("shape-transition2");
        blurElem("shape-transition1");    

       break;
    case 7:
        inBlurElem("shape-arc1");
        blurElem("shape-transition2");    

       break;
    case 8:
        inBlurElem("shape-arc2");
        blurElem("shape-arc1");    

       break;
    case 9:
        inBlurElem("shape-play");
        blurElem("shape-arc2");    

       break;
    case 10:
        inBlurElem("shape-nextStep");
        blurElem("shape-play");    

       break;
    case 11:
        inBlurElem("shape-clock");
        blurElem("shape-nextStep");    

       break;
    case 12:
        inBlurElem("shape-pause");
        blurElem("shape-clock");    

       break;
    case 13:
        inBlurElem("shape-stop");
        blurElem("shape-pause");    

       break;
   case 14:
        inBlurElem("shape-exit");
        blurElem("shape-stop");    

       break;
  case 15:
      inBlurElem("shape-save");
      blurElem("shape-exit");    

    break;
  case 16:
      inBlurElem("shape-reset");
      blurElem("shape-save");    
    break;
    case 17:
      inBlurElem("shape-graph1");
      blurElem("shape-reset");    
    break;
    case 18:
      inBlurElem("shape-graph2");
      blurElem("shape-graph1");    
    break;
    case 19:
      inBlurElem("shape-prop");
      blurElem("shape-graph2");    
    break;
    case 20:
      inBlurBackground();
      break;
    default:
      break;
  }
};


const selectFile = () => {
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


const readFile = (file) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsText(file);
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




const onEdgeUpdateStart = useCallback(() => {
  edgeUpdateSuccessful.current = false;
}, []);


const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
 /* edgeUpdateSuccessful.current = true;
  setEdges((prevEdges) => updateEdge(oldEdge, newConnection, prevEdges)); */
  
}, []);

const onEdgeUpdateEnd = useCallback((_, edge) => {
  
  if (stopping === 0) {
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
    message.textContent = 'On ne peut pas modifier le réseau de Petri durant une pause.';

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

 
const [showGroup, setShowGroup] = useState(false);
const handleCheckboxChange = () => {
  setShowGroup(!showGroup);
};

const [showGroupGraphe, setShowGroupGraphe] = useState(false);

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
          <button onClick={() => initialization(0)}>Guide</button>
        </li>
        <li className='w-8 h-8 rounded-xl cursor-pointer flex items-center justify-center' id='fitToWidth' style={{ backgroundColor: 'rgba(32, 178, 170, 0.36)' }}>
          <FontAwesomeIcon icon={faExpand } style={{ color: '#FFF' }}   onClick={fitToWidth}/>
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
                      startSimulation(setCounter, setRunning, setIntervalId, setFormOpen, formOpen, flowElements, setFlowElements,setPausing, pausing,stimulationSpeed,stopping,setStopping,running) ;
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
                  stepSimulation(setCounter, flowElements, setFlowElements,counter)} 
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
                    handleSpeedAdjustment()}}  
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
                      pauseSimulation(setRunning, clearInterval, intervalId,setPausing, pausing,running)}}  
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
                    stopSimulation(setCounter, clearInterval, intervalId,stopping,setStopping,setRunning,running)}}
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
                    handleSaveNet();
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
                    handleResetCanvas();
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
                        ShowMarkingGraph();
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
                        ShowMarkingGraphReduced();
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
                        ShowProprieties();
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
       <button class="button_st" onClick={() => continuePop(2)}>continuer</button>
       <button class="button_st" onClick={() => skip(1,'shape-grille')}>passer</button>
     </div>
   </div>

   <div id="popup2">
     <div>
       <h3>Importer</h3>
       <p>Cliquer pour importer un fichier</p>
       <button class="button_st" onClick={() => continuePop(3)}>continuer</button>
       <button class="button_st" onClick={() => skip(2,'shape-import')}>passer</button>
     </div>
   </div>

   <div id="popup3">
     <div>
       <h3>Exporter</h3>
       <p>Cliquer pour exporter en format:PNG/JPG/PDF/PGO</p>
       <button class="button_st" onClick={() => continuePop(4)}>continuer</button>
       <button class="button_st" onClick={() => skip(3,'shape-export')}>passer</button>
     </div>
   </div>

   <div id="popup4">
     <div>
       <h3>Place</h3>
       <p>Cliquer pour ajouter une place</p>
       <button class="button_st" onClick={() => continuePop(5)}>continuer</button>
       <button class="button_st" onClick={() => skip(4,'shape-place')}>passer</button>
     </div>
   </div>


   <div id="popup5">
     <div>
       <h3>Transition immédiate</h3>
       <p>Cliquer pour ajouter une transition immédiate</p>
       <button class="button_st" onClick={() => continuePop(6)}>continuer</button>
       <button class="button_st" onClick={() => skip(5,'shape-transition1')}>passer</button>
     </div>
   </div>

   <div id="popup6">
     <div>
       <h3>Transition temporisée</h3>
       <p>Cliquer pour ajouter une transition temporisée</p>
       <button class="button_st" onClick={() => continuePop(7)}>continuer</button>
       <button class="button_st" onClick={() => skip(6,'shape-transition2')}>passer</button>
     </div>
   </div>


   <div id="popup7">
     <div>
       <h3>Arc</h3>
       <p>Cliquer pour ajouter un arc </p>
       <button class="button_st" onClick={() => continuePop(8)}>continuer</button>
       <button class="button_st" onClick={() => skip(7,'shape-arc1')}>passer</button>
     </div>
   </div>


   <div id="popup8">
     <div>
       <h3>Arc inhibiteur</h3>
       <p>Cliquer pour ajouter un arc inhibiteur</p>
       <button class="button_st" onClick={() => continuePop(9)}>continuer</button>
       <button class="button_st" onClick={() => skip(8,'shape-arc2')}>passer</button>
     </div>
   </div>

   <div id="popup9">
     <div>
       <h3>Simuler</h3>
       <p>Cliquer pour lancer la simulation</p>
       <button class="button_st" onClick={() => continuePop(10)}>continuer</button>
       <button class="button_st" onClick={() => skip(9,'shape-play')}>passer</button>
     </div>
   </div>

   <div id="popup10">
     <div>
       <h3>Simuler étape par étape</h3>
       <p>Cliquer pour simuler étape par étape</p>
       <button class="button_st" onClick={() => continuePop(11)}>continuer</button>
       <button class="button_st" onClick={() => skip(10,'shape-nextStep')}>passer</button>
     </div>
   </div>

   <div id="popup11">
     <div>
       <h3>Vitesse</h3>
       <p>Cliquer pour déterminer la vitesse de la simulation</p>
       <button class="button_st" onClick={() => continuePop(12)}>continuer</button>
       <button class="button_st" onClick={() => skip(11,'shape-clock')}>passer</button>
     </div>
   </div>

   <div id="popup12">
     <div>
       <h3>Suspendre</h3>
       <p>Cliquer pour suspendre la simulation</p>
       <button class="button_st" onClick={() => continuePop(13)}>continuer</button>
       <button class="button_st" onClick={() => skip(12,'shape-pause')}>passer</button>
     </div>
   </div>

   <div id="popup13">
     <div>
       <h3>Arreter</h3>
       <p>Cliquer pour arreter la simulation</p>
       <button class="button_st" onClick={() => continuePop(14)}>continuer</button>
       <button class="button_st" onClick={() => skip(13,'shape-stop')}>passer</button>
     </div>
   </div>

   <div id="popup14">
     <div>
       <h3>Supprimer</h3>
       <p>Cliquer pour supprimer une place, une transition ou un arc </p>
       <button class="button_st" onClick={() => continuePop(15)}>continuer</button>
       <button class="button_st" onClick={() => skip(14,'shape-exit')}>passer</button>
     </div>
   </div>

   <div id="popup15">
     <div>
       <h3>Sauvegarder</h3>
       <p>Cliquer pour sauvegarder le canva</p>
       <button class="button_st" onClick={() => continuePop(16)}>continuer</button>
       <button class="button_st" onClick={() => skip(15,'shape-save')}>passer</button>
     </div>
   </div>

   <div id="popup16">
   <div>
       <h3>Supprimer tout</h3>
       <p>Cliquer pour supprimer le tout</p>
       <button class="button_st" onClick={() => continuePop(17)}>continuer</button>
       <button class="button_st" onClick={() => skip( 16,'shape-reset')}>passer</button>
     </div>
</div>

<div id="popup17">
   <div>
       <h3>Graphe de marquage</h3>
       <p>Cliquer pour afficher le graphe de marquage</p>
       <button class="button_st" onClick={() => continuePop(18)}>continuer</button>
       <button class="button_st" onClick={() => skip(17,'shape-graph1')}>passer</button>
     </div>
</div>



<div id="popup18">
      <div>
       <h3>Graphe de marquage réduit</h3>
       <p>Cliquer pour afficher le graphe de marquage réduit</p>
       <button class="button_st" onClick={() => continuePop(19)}>continuer</button>
       <button class="button_st" onClick={() => skip(18,'shape-graph2')}>passer</button>
     </div>
</div>

<div id="popup19">
      <div>
       <h3>Propiétes</h3>
       <p>Cliquer pour afficher les propriétes du system crée </p>
       <button class="button_finguide" onClick={() => skip(19,'shape-prop')}>Terminer</button>
     </div>
</div>



 </div>
 {/* end of groups */}

{/* popup of the guide */}
 <div id="popup0">
   <div>
     <h3 className='text-white'>GUIDE</h3>
     <button class="button_st" onClick={() => continuePop(1)}>continuer</button>
     <button class="button_st" onClick={() => skip(0, null)}>passer</button>
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