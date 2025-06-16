import { PetriNet } from '../modules/Petri_Net.js';
import { MarkingGraph } from '../modules/MarkingGraph.js';
import '../pages/Navbar.css';
import { showPromptDialog } from './handleForms';

export const startSimulation = async (  setIntervalId,  flowElements, setFlowElements, setPausing, stimulationSpeed, stopping, setStopping) => {
    let i = 0;
      setPausing(0); // Incrementing pausing state
    if(stopping !== 0)   { 
      setStopping(0);      }
    PetriNet.getMarquageInitial();
    PetriNet.create_pre_post();
    const e = new MarkingGraph();
    e.markingGraph();
  
 const id = setInterval(() => {
        PetriNet.Enabling();

        if (PetriNet.blocked === true || i >= PetriNet.nb_simulation) {
          setStopping(1);
            stopSimulation( clearInterval, id,setStopping);
            showPromptDialog('La simulation est terminée !');    
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

export const pauseSimulation = ( clearInterval, intervalId, setPausing) => {
  clearInterval(intervalId);
   setPausing(1);
};

export const stopSimulation = (clearInterval, intervalId,setStopping) => {
  setStopping(1); 
  clearInterval(intervalId);
};

export const stepSimulation = ( flowElements, setFlowElements) => {
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

export  const handleSpeedAdjustment = (setTempTable, pausing, stopping,setStimulationSpeed ) => {
    setTempTable([]); // Reset tempTable after creating edge
    const speeds = [0.25, 0.5, 1, 1.5, 2, 3]; // Define available speed options
    const currentSpeed = PetriNet.simulationSpeedCoefficient; // Get the current speed coefficient
    if ( pausing === 0 && stopping === 0   ) {
      showPromptDialog('On ne peut pas changer la vitesse durant la simulation.');    
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