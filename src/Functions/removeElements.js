import { PetriNet } from '../modules/Petri_Net.js';
import { showPromptDialog } from './handleForms';

export const RemoveEdge = (nodeId, stopping, setEdges, edges) => {
  console.log('Removing edge with ID:', nodeId.id);

  if (stopping === 0) {
showPromptDialog('On ne peut pas modifier le réseau de Petri durant une pause.');
  }
 else {
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

export const RemoveTrans = (nodeId, stopping, setFlowElements, flowElements, setEdges, edges) => {
    console.log('Removing trans with ID:', nodeId);

    if (stopping === 0) {
showPromptDialog('On ne peut pas modifier le réseau de Petri durant une pause.');
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

export const RemovePlace = (nodeId, stopping, setFlowElements, flowElements, setEdges, edges) => {
  console.log('Removing node with ID:', nodeId);

  if (stopping === 0) {
showPromptDialog('On ne peut pas modifier le réseau de Petri durant une pause.');
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
 

