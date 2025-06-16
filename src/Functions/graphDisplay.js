import { PetriNet } from '../modules/Petri_Net.js';
import {Marking_reduced} from '../modules/Marking_reduced.js';
import {Marking_graphe} from '../modules/Marking_graphe.js';
import {MarkingGraph} from '../modules/MarkingGraph.js';


export const ShowMarkingGraph = (setTempTable) => {
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


export const ShowMarkingGraphReduced = (setTempTable) => {
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
  

  
export const ShowProprieties = (setTempTable, stopping) => {
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

