import { PetriNet } from '../modules/Petri_Net.js';

export  function showFormPlace(nodeName, nodeCapacity, nodeTokenCount, callback, event) {
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

export  function showFormTransitionImm(nodeName, nodeWeight, callback, event) {
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

export  function showFormTransitionTem(nodeName,nodeWeight, callback, event) {
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

export  const updatingArcLabel = (event, edge, setTempTable, edges, setEdges) => {
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
  
export function showPromptDialog(message) {
  const promptContainer = document.createElement('div');
  promptContainer.classList.add('prompt-overlay');

  const promptDialog = document.createElement('div');
  promptDialog.classList.add('prompt-dialog');

  const cadre = document.createElement('div');
  cadre.classList.add('cadre');

  const msg = document.createElement('div');
  msg.classList.add('prompt-message');
  msg.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.classList.add('prompt-close-button');
  closeButton.textContent = 'Fermer';
  closeButton.addEventListener('click', () => {
    promptContainer.remove();
  });

  cadre.appendChild(msg);
  promptDialog.appendChild(cadre);
  promptDialog.appendChild(closeButton);
  promptContainer.appendChild(promptDialog);
  document.body.appendChild(promptContainer);
}  