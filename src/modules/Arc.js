import { PetriNet } from "./Petri_Net.js";
export default class Arc {
    constructor(name, weight, type, direction,place,trans) {
        this.name = name || "Arc" + (PetriNet.nb_arc);
        this.weight = weight || 1;
        this.Inhibitor = type || false;
        this.Place = place; // you have to check place type 
        this.Transition = trans; // you have to check transition type 
        this.placeToTransition = direction || true;
        this.id_arc = 1;
    }
    // getter and setter of the attribute name 
    getName (){
        return this.name;
    }
  
    setName(name) {
        this.name = name;
    }
  
  
    // getter and setter of the attribute weight
    getWeight() {
        return this.weight;
    }
  
    setWeight(weight) {
        this.weight = weight;
    }
  
  
    isInhibitor() {
        return this.Inhibitor;
    }
    
   
    getTransition() {
        return this.Transition;
    }
    
    setPlace(source) {
        this.Place = source;
    }
    
  
    getPlace() {
        return this.Place;
    }
    
    setTransition(destination) {
        this.Transition = destination;
    }
  
  
    // getter and setter of the attribute placeToTransition
    isPlaceToTransition() {
        return this.placeToTransition;
    }
    
    setPlaceToTransition(placeToTransition) {
        this.placeToTransition = placeToTransition;
    }}
