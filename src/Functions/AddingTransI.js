import React, { useState } from 'react';
import { PetriNet } from "../modules/Petri_Net.js";
import '../pages/Navbar.css';


function useAddingTransitionI(setFlowElements,pausing,stopping,running) {
    const [elements, setElements] = useState([]);
    const [addingTransitionMode, setAddingTransIMode] = useState(false);

    const onPaneClickTraI = (event) => {
        console.log('pause place = ',pausing);

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
          
        const canvasRect = event.target.getBoundingClientRect();
        const clientX = event.clientX - canvasRect.left;
        const clientY = event.clientY - canvasRect.top;

     
            PetriNet.addTransition(); // Assuming this function adds a transition to PetriNet
            const transition = PetriNet.transition[PetriNet.nb_transition - 1];
            transition.x=clientX;
            transition.y=clientY;
            const newElement = {
                id: `Transition-${transition.id_transition}`,
                 
sourcePosition: 'right',
targetPosition: 'left',
                data: {
                    label: <div className="custom-label">{transition.name}</div>,
                    name: transition.name,
                    weight: transition.weight,
                    firingRate: transition.firing_rate,
                    priority: transition.priority,
                },
                position: { x: clientX - 20, y: clientY - 20 }, // Adjust position based on click coordinates
                style: {
                  borderRadius: '5px',
                  width: '40px',
                  height: '100px',
                  borderColor: '#008080',
                  backgroundColor: 'black',
                },
                type: 'default',
                draggable: true,
            };
            setElements(prevElements => [...prevElements, newElement]);
            setFlowElements(prevFlowElements => [...prevFlowElements, newElement]);
           
    };

    return { elements, onPaneClickTraI, setAddingTransIMode };
}





export default useAddingTransitionI;
