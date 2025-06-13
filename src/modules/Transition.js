import { PetriNet } from "./Petri_Net.js";

export default class Transition {
    constructor(name,priority,weight,rate,  rotation) {
        this.weight = weight || 1;
        this.firing_rate =rate ||  Math.random();   // a changer
        this.name = name || "T" + (PetriNet.nb_transition );
        this.priority = priority || 1;
        this.x = 0;
        this.y = 0;
        this.width =  2;
        this.height = 5;
        this.rotation = rotation || 0;
        this.is_enabled = false;
        this.id_transition = PetriNet.nb_transition;
        this.probabibility = 0;
 
    }
  
    getId_transition() {
        return this.id_transition;
    }
  
    setId_transition(id_transition) {
        this.id_transition = id_transition;
    }
  
    getWeight() {
        return this.weight;
    }
  
    setWeight(weight) {
        this.weight = weight;
    }
  
    getFiring_rate() {
        return this.firing_rate;
    }
  
    setFiring_rate(firing_rate) {
        this.firing_rate = firing_rate;
    }
  
    getName() {
        return this.name;
    }
  
    setName(name) {
        this.name = name;
    }
  
    getPriority() {
        return this.priority;
    }
  
    setPriority(priority) {
        this.priority = priority;
    }
  
    getX1() {
        return this.x1;
    }
  
    setX1(x1) {
        this.x1 = x1;
    }
  
    getY1() {
        return this.y1;
    }
  
    setY1(y1) {
        this.y1 = y1;
    }
  
    getWidth() {
        return this.width;
    }
  
    setWidth(width) {
        this.width = width;
    }
  
    getHeight() {
        return this.height;
    }
  
    setHeight(height) {
        this.height = height;
    }
  
    getRotation() {
        return this.rotation;
    }
  
    setRotation(rotation) {
        this.rotation = rotation;
    }
  
    is_enabled() {
        return this.is_enabled;
    }
  
    enabled() {  
        let enable = true;
        let i = 0;
        let k =0;
        let bool1 = false;
        let bool2 = false;

        for(k=0;k<PetriNet.nb_place;k++){
            if ( PetriNet.pre[k][this.id_transition].arc_weight !== 0) bool1 = true;
            if (PetriNet.post[k][this.id_transition] !== 0) bool2 = true;
        }

        if (bool1 === false && bool2 === false) enable = false;
        else { 

        while (i < PetriNet.nb_place && enable) {
            if (!PetriNet.pre[i][this.id_transition].inhibitor && PetriNet.pre[i][this.id_transition].arc_weight > PetriNet.place[i].getNb_tokens()) {
                enable = false;
            }
            if (PetriNet.pre[i][this.id_transition].inhibitor && PetriNet.pre[i][this.id_transition].arc_weight <= PetriNet.place[i].getNb_tokens()) {
                enable = false;
            }
            if (PetriNet.post[i][this.id_transition] + PetriNet.place[i].getNb_tokens() > PetriNet.place[i].getCapacity()) {
                enable = false;
            }
            i++;
        }
    };
        
        this.is_enabled = enable;
    }
  
  
    
    fire(){
    
        for( let i = 0 ; i< PetriNet.nb_place ; i ++ ){
            if (PetriNet.pre[i][this.id_transition].inhibitor === false ){
         PetriNet.place[i].nb_tokens +=  PetriNet.post[i][this.id_transition] - PetriNet.pre[i][this.id_transition].arc_weight ; 
         PetriNet.currant_marking[i] = PetriNet.place[i].nb_tokens ;
        }
        else {
            PetriNet.place[i].nb_tokens +=  PetriNet.post[i][this.id_transition]; 
            PetriNet.currant_marking[i] = PetriNet.place[i].nb_tokens ;
        }
         
        }
  
    }
  
  
  }
