import Place from "./Place.js"
import Transition from "./Transition.js"
import Arc from "./Arc.js"



class Petri_Net {  
   constructor(nbSim,simulationSpeedCoefficient) {

    this.isFiring = false; // Flag to track if firing is in progress
       this.nb_place = 0;
       this.nb_arc = 0;
       this.nb_transition = 0;

       this.place = [];
       this.transition = [];
       this.arc = [];

       this.pre = [];
       this.post = [];

       this.nb_immediate_enabled = 0;
       this.nb_temp_enabled = 0;

       this.enabled_immediate = [];
       this.enabled_temporary = [];

      
       this.currant_marking = [];
       this.initial_marking=[];
       this.currant_marking_tangible = false;

       this.nb_simulation = nbSim||100;
       this.simulationSpeedCoefficient = simulationSpeedCoefficient || 1;
    
    
       this.parameter = 0;
       this.weight_sum = [];
       
       this.blocked = false;
       this.bounded = false;
       this.persistent = true;
       this.alive= false;
       this.resettable=false;
       this.incidence = [];
       this.incidenceSysteme = [];
       this.PlacesC = [];
   }
 
   create_pre_post() {
       this.pre = new Array(this.nb_place).fill(null).map(() => new Array(this.nb_transition).fill(null).map(() => ({ arc_weight: 0, inhibitor: false })));
       this.post = new Array(this.nb_place).fill(null).map(() => new Array(this.nb_transition).fill(0));
   
       // Assigning arcs' weights and types
       for (let i = 0; i < this.nb_arc; i++) {
           if (this.arc[i].placeToTransition === true) {
               this.pre[this.arc[i].Place.id_place][this.arc[i].Transition.id_transition].arc_weight = this.arc[i].weight;
               this.pre[this.arc[i].Place.id_place][this.arc[i].Transition.id_transition].inhibitor = this.arc[i].Inhibitor;
           } else {
               this.post[this.arc[i].Place.id_place][this.arc[i].Transition.id_transition] = this.arc[i].weight;
           }
       }
   }
   
   
 
   getMarquageInitial (){
       for( let i = 0 ; i< this.nb_place ; i ++ ){
       this.initial_marking[i]= this.place[i].nb_tokens ; 
       }
   }
 
   getCurrantMarking (){
    for( let i = 0 ; i< this.nb_place ; i ++ ){
    this.currant_marking[i]= this.place[i].nb_tokens ; 
    }
}
 
   Enabling() {
       let temp = 0;
       this.currant_marking_tangible = false;
       this.nb_immediate_enabled = 0;
       this.nb_temp_enabled = 0;
       this.blocked = false;


       let stop_timed = false;
       for (let i = 0; i < this.nb_transition; i++) {
           this.transition[i].enabled();
           if (this.transition[i].is_enabled) {
               if (this.transition[i].getPriority() === 1) {
                this.enabled_immediate[this.nb_immediate_enabled] = [i, -1];


                   this.nb_immediate_enabled++;
                   stop_timed = true;

                   
               } else {
                   if (!stop_timed) {
                       temp += this.transition[i].getFiring_rate();
                       this.enabled_temporary[this.nb_temp_enabled] = i;
                       this.nb_temp_enabled++;
                   }
               }
           }
       }
       if (this.nb_temp_enabled === 0 && this.nb_immediate_enabled === 0) {
           this.blocked = true;
           this.bounded = true;
       }
       if (this.nb_immediate_enabled === 0 && this.nb_temp_enabled !== 0) {
           this.currant_marking_tangible = true;
       }
 
       this.parameter = temp;


   }
 
   addPlace(name, nb_tokens, capacity) {
       const newPlace = new Place(name, nb_tokens, capacity );
       this.place[this.nb_place] = newPlace;
       this.nb_place++;
   }
 
   addTransition(name,priority,weight,rate,  rotation) {
       const newTransition = new Transition(name,priority,weight,rate,  rotation);
       this.transition[this.nb_transition]= newTransition;
       this.nb_transition++;
   }
   addArc(name, weight, inhibitor,placeTotrans,place,trans) {
    const newArc = new Arc(name, weight, inhibitor,placeTotrans,place,trans);
     this.arc[this.nb_arc] = newArc;
     this.arc[this.nb_arc].id_arc =  this.nb_arc;
    this.nb_arc++;
}

 
removeArc(id) {  
      for (let i = id; i < this.nb_arc-1; i++) {
        this.arc[i] = this.arc[i + 1];
        this.arc[i].id_arc = i; // Update the id
      }
      this.nb_arc--;
  }
   
   removePlace(id) {
       for (let i = id; i < this.nb_place-1 ; i++) 
       {
           this.place[i] = this.place[i + 1];
           this.place[i].id_place= i ; // updating the id
       }        
       this.nb_place--;
   }
 
   removeTransition(id) {
       for (let i = id; i < this.nb_transition-1 ; i++) 
       {
           this.transition[i] = this.transition[i + 1];
           this.transition[i].id_transition = i ; // updating the id
       }             this.nb_transition--;
   }
 
   getnb_place() {
       return this.nb_place;
   } 
   conflict(i, j) {
       let conf = false;
       let k = 0;
       while (!conf && k < this.nb_place) {
           if (this.pre[k][i].arc_weight === this.pre[k][j].arc_weight) {
               conf = true;
           }
           k++;
       }
       return conf;
   }
 
   establish_probability() {
       if (this.currant_marking_tangible) {
           for (let i = 0; i < this.nb_temp_enabled; i++) {
               this.transition[this.enabled_temporary[i]].probabibility = this.transition[this.enabled_temporary[i]].getFiring_rate() / this.parameter;
           }
       } else {
           let max = -1;
           for (let i = 0; i < this.nb_immediate_enabled; i++) {
               if (this.enabled_immediate[i][1] === -1) {
                   max++;
                   this.weight_sum[max] = this.transition[this.enabled_immediate[i][0]].weight;
                   this.enabled_immediate[i][1] = max;
               }
               for (let j = i + 1; j < this.nb_immediate_enabled; j++) {
                   if (this.enabled_immediate[j][1] === -1 && this.conflict(this.enabled_immediate[j][0], this.enabled_immediate[i][0])) {
                       this.weight_sum[this.enabled_immediate[i][1]] += this.transition[this.enabled_immediate[j][0]].weight;
                       this.enabled_immediate[j][1] = this.enabled_immediate[i][1]; 
                   }
               }
           }
 
           for (let i = 0; i < this.nb_immediate_enabled; i++) {
               this.transition[this.enabled_immediate[i][0]].probabibility = ((this.transition[this.enabled_immediate[i][0]].weight / this.weight_sum[this.enabled_immediate[i][1]])) / this.weight_sum.length;
             
           }
       }
   }

    // Function to generate numbers according to a negative exponential distribution
    generateNegativeExponential(lambda) {
        return -Math.log(1 - Math.random()) / lambda;
     }
      blockForAWhile(milliseconds) {
        var start = new Date().getTime();
        while (new Date().getTime() - start < milliseconds);
    }
    generateNegativeExponential(lambda) {
        return -Math.log(1 - Math.random()) / lambda;
    }
    
    blockForAWhile(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    
    highlight(setFlowElements, flowElements, id) {
        const updatedElementsWithNewIds = flowElements.map(el => {
            const idd = `Transition-${id}`;
            if (el.id === idd) {
                // Update style properties
                el.style.borderColor = 'red';
                el.style.backgroundColor = 'red';
            }
            return el;
        });
        setFlowElements(updatedElementsWithNewIds);
    }
    
    updateTokensInPlaces(flowElements, setFlowElements) {
        const updatedFlowElements = flowElements.map(el => {
            if (el.id.startsWith('place-')) {
                const nodeId = parseInt(el.id.split('-')[1]);
                const place = PetriNet.place[nodeId];
    
                el.data = {
                    ...el.data,
                    label: (
                        <div>
                          <div className="place-label">{place.name}</div>
                          <div className='token-display'>
                            {place.nb_tokens > 0 && place.nb_tokens <= 10 ?
                              <img alt='tokens' src={`/tokens/${place.nb_tokens}.svg`} style={{ maxWidth: '100%', maxHeight: '100%' }} /> :
                              place.nb_tokens > 10 ?
                                <div className="number-display">{place.nb_tokens}</div> :
                                null // Render nothing if nb_tokens is 0
                            }
                          </div>
                        </div>
                      ),
                      
                    nbTokens: place.nb_tokens,
                };
            }
            return el;
        });
    
        setFlowElements(updatedFlowElements);
    }
    
    async firing(setFlowElements, flowElements,stimulationSpeed) {
        if (this.isFiring) return; // If already firing, exit
    
        this.isFiring = true; // Set firing flag
    
        let min = 0;
        let j = Math.random();
        let i = 0;
        let stop = false;
        if (!this.blocked) {
            if (this.currant_marking_tangible) {
                while (!stop && i < this.nb_temp_enabled) {
                    if (min <= j && j <= (this.transition[this.enabled_temporary[i]].probabibility + min)) {
                        stop = true;
                        const transitionIndex = this.enabled_temporary[i];
                        // Fire the transition with highlighting
                        const transitionId = this.transition[transitionIndex].id_transition;
    
                        this.highlight(setFlowElements, flowElements, transitionId); // Execute myFunction
    
                        await this.blockForAWhile(this.generateNegativeExponential(this.parameter) * 1000 / this.simulationSpeedCoefficient); // Block for a certain duration
    
                        this.transition[transitionIndex].fire();
    
                        this.updateTokensInPlaces(flowElements, setFlowElements);
    
                        const updateddElementsWithNewIds = flowElements.map(el => {
                            const idd = `Transition-${transitionId}`;
                            if (el.id === idd) {
                                // Update style properties
                                el.style.borderColor = '#008080';
                                el.style.backgroundColor = 'white';
                            }
                            return el;
                        });
                        setFlowElements(updateddElementsWithNewIds);
                    }
                    min = this.transition[this.enabled_temporary[i]].probabibility + min;
                    i++;
                }
            } else {
                while (!stop && i < this.nb_immediate_enabled) {
                    if (min <= j && j <= (this.transition[this.enabled_immediate[i][0]].probabibility + min)) {
                        stop = true;
                        const transitionIndex = this.enabled_immediate[i][0];
                        // Fire the transition with highlighting
                        const transitionId = this.transition[transitionIndex].id_transition;
        
                        this.highlight(setFlowElements, flowElements, transitionId); // Highlight in red immediately
        
                        // Allow the UI to update before continuing with the firing process
                        await new Promise(resolve => setTimeout(resolve, 1000 / stimulationSpeed)); // Adjust timing based on stimulation speed
        
                        this.transition[transitionIndex].fire();
        
                        this.updateTokensInPlaces(flowElements, setFlowElements);
        
                        // Reset the color back to black
                        const updateddElementsWithNewIds = flowElements.map(el => {
                            const idd = `Transition-${transitionId}`;
                            if (el.id === idd) {
                                // Update style properties
                                el.style.borderColor = '#008080';
                                el.style.backgroundColor = 'black';
                            }
                            return el;
                        });
                        setFlowElements(updateddElementsWithNewIds);
                    }
                    min = this.transition[this.enabled_immediate[i][0]].probabibility + min;
                    i++;
                }
            }
        }
    
        this.isFiring = false; // Reset firing flag after firing completes
        // Now you can proceed with the simulation end or any other subsequent actions
        }
    
    
  suppTout(){
   PetriNet.place = [];
   PetriNet.transition = [];
   PetriNet.arc = [];
    PetriNet.nb_place =0;
    PetriNet.nb_transition =0;
    PetriNet.nb_arc =0;
   }   
    
   CreateIncidenceMarking() {
 
    this.incidence = new Array(this.nb_place).fill(null).map(() => new Array(this.nb_transition).fill(0));
 let Transition=[];
   let p=0; 
   let t=0;
    for (let i = 0; i < this.nb_place; i++) {
        let hasEffect = false;
         for (let j = 0; j < this.nb_transition; j++) {
            if (!hasEffect && this.pre[i][j].arc_weight > 0 ) {  
                hasEffect = true;
                this.PlacesC[p]= i; 
                p++ ;
            }

             if (this.pre[i][j].inhibitor) {
                 this.incidence[i][j] = -this.pre[i][j].arc_weight - this.post[i][j];
             } else {
                 this.incidence[i][j] = this.pre[i][j].arc_weight - this.post[i][j];
             }
         }
     }

     for (let i = 0; i < this.nb_transition; i++) {
        let hasEffect = false;
         for (let j = 0; j < this.nb_place; j++) {
            if (!hasEffect && this.pre[j][i].arc_weight > 0 ) {  
                hasEffect = true;
                Transition[t]= i; 
                t++ ;
            }
         }
     }
     if (p !== this.nb_place || t !== this.nb_transition){
        this.incidenceSysteme = new Array(p).fill(null).map(() => new Array(t).fill(0));
        for (let i = 0; i < p; i++) {
            for (let j = 0; j < t; j++) {
                if (this.pre[this.PlacesC[i]][Transition[j]].inhibitor) {
                    this.incidenceSysteme[i][j] = -this.pre[this.PlacesC[i]][Transition[j]].arc_weight - this.post[this.PlacesC[i]][Transition[j]];
                } else {
                    this.incidenceSysteme[i][j] = this.pre[this.PlacesC[i]][Transition[j]].arc_weight - this.post[this.PlacesC[i]][Transition[j]];
                }
            }
            
         }

     }else {
        this.incidenceSysteme = this.incidence;
     }
    


      
 }
 }    
 
 export const PetriNet = new Petri_Net();