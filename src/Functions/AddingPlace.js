import React, { useState } from 'react';
import { PetriNet } from "../modules/Petri_Net.js";
import '../pages/Navbar.css';

function useAddingPlace(setFlowElements, pausing,stopping,running) {
  const [elements, setElements] = useState([]);
  const [addingPlaceMode, setAddingPlaceMode] = useState(false);

  const onPaneClick = (event) => {
    console.log('pause place = ',pausing);
    console.log("++++Adding place++");

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
    
    if(running === 1) {
      alert('Ne changer pas le réseau de Petri durant la simulation!');
      return;
    }

      setAddingPlaceMode(true);

      const canvasRect = event.target.getBoundingClientRect();
      const clientX = event.clientX - canvasRect.left;
      const clientY = event.clientY - canvasRect.top;

      PetriNet.addPlace();
      const place = PetriNet.place[PetriNet.nb_place - 1];
      place.x=clientX;
      place.y=clientY;

      console.log(place.capacity);

      const newElement = {
        id: `place-${place.id_place}`,
         
sourcePosition: 'right',
targetPosition: 'left',
        data: {
          label: (
            <div className="place-label">
              {place.name}
              <div className='token-display'>
                {place.nb_tokens > 0 && place.nb_tokens <= 10 ?
                  <img alt='tokens' src={`/tokens/${place.nb_tokens}.svg`} style={{ maxWidth: '100%', maxHeight: '100%' }} /> :
                   place.nb_tokens > 10 ?
                    <div className="number-display">{place.nb_tokens}</div> :
                    null
                }
              </div>
            </div>
          ),
          capacity: place.capacity,
          nbTokens: place.nb_tokens,
          name:place.name,
        },
        position: { x: clientX - 35, y: clientY - 35 },
        style: {
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          borderColor: '#008080',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'default'
        },
        type: 'default',
        draggable: true,
      };

      setElements(prevElements => [...prevElements, newElement]);
      setFlowElements(prevFlowElements => [...prevFlowElements, newElement]);
      setAddingPlaceMode(false);
    
  };

  return { elements, onPaneClick, setAddingPlaceMode };
}

export default useAddingPlace;
