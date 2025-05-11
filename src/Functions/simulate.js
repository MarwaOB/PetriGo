import { PetriNet } from '../modules/Petri_Net.js';
import { MarkingGraph } from '../modules/MarkingGraph.js';
import '../pages/Navbar.css';


export const startSimulation = async (setCounter, setRunning, setIntervalId, setFormOpen, formOpen, flowElements, setFlowElements, setPausing, pausing, stimulationSpeed, stopping, setStopping, running) => {
    let i = 0;

      setPausing(0); // Incrementing pausing state
    if(stopping !== 0)   { 
      setStopping(0);      }


    PetriNet.getMarquageInitial();
    PetriNet.create_pre_post();
    const e = new MarkingGraph();
    e.markingGraph();
  
    
 const id = setInterval(() => {
        setCounter(prevCounter => prevCounter + 1);
        PetriNet.Enabling();

        if (PetriNet.blocked === true || i >= PetriNet.nb_simulation) {
          setStopping(1);
            stopSimulation(setCounter, clearInterval, id,stopping,setStopping,setRunning,running);
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
            message.textContent = 'La simulation est terminée !';

            // Append message to cadre
            cadre.appendChild(message);

            // Create the close button
            const closeButton = document.createElement('button');
            closeButton.classList.add('prompt-close');
            closeButton.textContent = 'Fermer';

            // Event listener for close button
            closeButton.addEventListener('click', () => {
                promptContainer.remove(); // Remove the prompt dialog
            });

            // Append cadre and close button to prompt dialog
            promptDialog.appendChild(cadre);
            promptDialog.appendChild(closeButton);

            // Append the prompt dialog to the container
            promptContainer.appendChild(promptDialog);

            // Append the container to the document body
            document.body.appendChild(promptContainer);
        } else {
            PetriNet.establish_probability();
            PetriNet.firing(setFlowElements,flowElements,stimulationSpeed);
            i++;
            PetriNet.getCurrantMarking();
            console.log(PetriNet.currant_marking);
        }
    }, (1/stimulationSpeed) * 1000);
    setIntervalId(id);
};

export const pauseSimulation = (setRunning, clearInterval, intervalId, setPausing, pausing, running) => {
  clearInterval(intervalId);
   setPausing(1);
};

export const stopSimulation = (setCounter, clearInterval, intervalId,stopping,setStopping,setRunning,running) => {
  setCounter(0);
  setStopping(1); 

  clearInterval(intervalId);
};

export const stepSimulation = (setCounter, flowElements, setFlowElements, counter) => {
  setCounter(prevCounter => prevCounter + 1);

  PetriNet.create_pre_post();
  PetriNet.Enabling();

  if (PetriNet.blocked === true) {
      alert("Simulation stopped");
      return; // Stop simulation
  }

  PetriNet.establish_probability();
  PetriNet.firing(setFlowElements, flowElements);
  PetriNet.getCurrantMarking();
};

function showNbSim(nbSim, callback) {
  var tokensInputContainer = document.createElement('div');
  tokensInputContainer.classList.add('Question');

  tokensInputContainer.innerHTML = `
  <div class="Questions">
      <label for="name">Veuillez entrer le nombre maximal de simulation</label>
      <input type="text" id="name" placeholder="100" />
      <button id="SubmitTokens">Submit</button>
  </div>`;

  document.body.appendChild(tokensInputContainer);

  var submitTokensButton = tokensInputContainer.querySelector('#SubmitTokens');
  submitTokensButton.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default form submission behavior
      const nbSim = parseInt(tokensInputContainer.querySelector('#name').value, 10);
      tokensInputContainer.remove();
      callback(nbSim);
  });
}
