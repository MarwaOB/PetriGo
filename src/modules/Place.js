import { PetriNet } from "./Petri_Net.js";

export default class Place{
    constructor(name, capacity, nb_tokens) {
        this.name = name || "P" + (PetriNet.nb_place);
        this.nb_tokens = nb_tokens || 0;
        this.capacity = capacity || 99999;
        this.ray = 5;
        this.id_place = PetriNet.nb_place;
        this.x = 0;
        this.y = 0;
      
    }
  
    getName(){
       return this.name;
    }
    getX(){
       return this.x;
    }
    getY(){
       return this.y;
    }
    getNb_tokens(){
       return this.nb_tokens;
    }
    getCapacity() {
       return this.capacity;
   }
   
   setName(name){
       this.name = name;
   }
   setX(x) {
       this.x = x;
   }
   setY(y) {
       this.y = y;
   }
   
   setNb_tokens(Nb_tokens) {
     this.nb_tokens = Nb_tokens;
   }
   
  }  
  
