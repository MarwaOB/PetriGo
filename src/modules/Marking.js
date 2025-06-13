import { MarkingGraph } from "./MarkingGraph.js";
import {PetriNet} from "./Petri_Net.js"

export  class Marking {
    constructor(markin) {
      this.current_marking = markin;
      this.tangible = false;
      this.child_marking = new Array(PetriNet.nb_place).fill(0);
      this.immediate_transition_taken = [];
      this.delayed_transition_taken = [];
      this.probability = new Array(PetriNet.nb_transition).fill(0.0);
      this.sump = [];
      this.blocked_marking = false;
      this.nb_enabled_imm = 0;
      this.nb_temp_enabled = 0;
      this.id = 0;
      this.parameter = 0;
      this.blocked = false;
    }
  
    create_child(j) {
      for( let i = 0 ; i< PetriNet.nb_place ; i ++ ){
        if (PetriNet.pre[i][j].inhibitor === false ){
      this.child_marking[i]=  this.current_marking[i]+ PetriNet.post[i][j] - PetriNet.pre[i][j].arc_weight ; 
   
    }else {
      this.child_marking[i]=  this.current_marking[i]+ PetriNet.post[i][j]; 
    }
     
    }
    }
  
    setId(i) {
      this.id = i;
    }
  
    marking_comparison(m) {
      let k = 0;
      let similar = true;
      while (k < PetriNet.nb_place && similar) {
        if (this.child_marking[k] !== m[k]) {
          similar = false;
        }
        k++;
      }
      return similar;
    }
  
    establish_probability() {
      if (this.tangible) {
        for (let i = 0; i < this.nb_temp_enabled; i++) {
         /* console.log( this.parameter);
          console.log( PetriNet.transition[this.delayed_transition_taken[i]]);*/
          this.probability[i] = PetriNet.transition[this.delayed_transition_taken[i]].getFiring_rate() / this.parameter;
        }
      } else {
        let max = -1;
        for (let i = 0; i < this.nb_enabled_imm; i++) {
          if (this.immediate_transition_taken[i][1] === -1) {
            max++;
            this.sump[max] = PetriNet.transition[this.immediate_transition_taken[i][0]].weight;
            this.immediate_transition_taken[i][1] = max;
          }
          for (let j = i + 1; j < this.nb_enabled_imm; j++) {
            if (this.immediate_transition_taken[j][1] === -1 && PetriNet.conflict(this.immediate_transition_taken[j][0], this.immediate_transition_taken[i][0])) {
              this.sump[this.immediate_transition_taken[i][1]] += PetriNet.transition[this.immediate_transition_taken[j][0]].weight;
              this.immediate_transition_taken[j][1] = this.immediate_transition_taken[i][1];
            }
          }
        }
  
        for (let i = 0; i < this.nb_enabled_imm; i++) {
          this.probability[i] = (PetriNet.transition[this.immediate_transition_taken[i][0]].weight / this.sump[this.immediate_transition_taken[i][1]]) / this.sump.length;
        }
      }
    }
  
    enabling() {
      let temp = 0;
      this.nb_temp_enabled = 0;
      this.blocked = false;
      this.blocked = false;

      this.nb_enabled_imm = 0;
      let stop_timed = false;

      for (let i = 0; i < PetriNet.nb_transition; i++) {
        if (this.trans_enabling(i)) {
          if (PetriNet.transition[i].getPriority() === 1) {
            this.immediate_transition_taken.push([i, -1]);
            this.nb_enabled_imm++;
            stop_timed = true;
          } else {
            if (!stop_timed) {
              temp += PetriNet.transition[i].getFiring_rate();
              this.delayed_transition_taken[this.nb_temp_enabled] = i;
              this.nb_temp_enabled++;
            }
          }
        }
      }
      if (this.nb_temp_enabled === 0 && this.nb_enabled_imm === 0) {
        PetriNet.blocked = true;
        PetriNet.bounded = true;
        
        this.blocked = true;
      }
      if (this.nb_enabled_imm === 0 && this.nb_temp_enabled !== 0) {
        this.tangible = true;
      }
  
      this.parameter = temp;
    }
  
    trans_enabling(j) {
        let enable = true;
        let i = 0;
        let k =0;
        let bool1 = false;
        let bool2 = false;

        for(k=0;k<PetriNet.nb_place;k++){
          if ( PetriNet.pre[k][j].arc_weight !== 0) bool1 = true;
          if (PetriNet.post[k][j] !== 0) bool2 = true;
      }

      if (bool1 === false && bool2 === false) enable = false;
      else { 
        while (i < PetriNet.nb_place && enable) {
          
    
            if (!PetriNet.pre[i][j].inhibitor && PetriNet.pre[i][j].arc_weight > this.current_marking[i]) {
                enable = false;
            }
            if (PetriNet.pre[i][j].inhibitor && PetriNet.pre[i][j].arc_weight <= this.current_marking[i]) {
                enable = false;
            }
            if (PetriNet.post[i][j] + this.current_marking[i] > PetriNet.place[i].capacity) {
                enable = false;
            }
            i++;
        }
      };
  
       return enable;
    }
    
    
    verify_persistence_immediate(){
      if(PetriNet.persistent === false) return;
      let temp = this.current_marking;
      console.log('curr = ', temp);
      let i = 0;

      let bool1 = true;
      let a1 = Array(PetriNet.nb_place).fill(0);
      let b1 = Array(PetriNet.nb_place).fill(0);
      

      while(bool1 && i<this.nb_enabled_imm -1 ){

        let t1 =  this.immediate_transition_taken[i][0];
        let j = i+1;
        while(bool1 && j <this.nb_enabled_imm ) { 
          let t2 =  this.immediate_transition_taken[j][0];
          console.log('heyy =');

        for (let k = 0; k < PetriNet.nb_place; k++){
         a1[k] = temp[k] + PetriNet.post[k][t1] - PetriNet.pre[k][t1].arc_weight;
        }
        console.log('a1 =', a1 );

        bool1 = this.trans_enabled_persistance(t2,a1);
        console.log('bool1 =', bool1 );
        if(!bool1){
          PetriNet.persistent = false;
          return;
        }


         for (let k = 0; k < PetriNet.nb_place; k++){
          b1[k] = temp[k] + PetriNet.post[k][t2] - PetriNet.pre[k][t2].arc_weight;
         }
         bool1 = this.trans_enabled_persistance(t1,a1);
        
         if(!bool1){
          PetriNet.persistent = false;
          return;
        }
j++;
        }
        i++;
      }
    }


    verify_persistence_temp(){
      if(PetriNet.persistent === false) return;
      let temp = this.current_marking;
      console.log('curr = ', temp);
      let i = 0;

      let bool1 = true;
      let a1 = Array(PetriNet.nb_place).fill(0);
      let b1 = Array(PetriNet.nb_place).fill(0);
      

      while(bool1 && i<this.nb_temp_enabled -1 ){

        let t1 = this.delayed_transition_taken[i];
        let j = i+1;
        while(bool1 && j <this.nb_temp_enabled ) { 
          let t2 = this.delayed_transition_taken[j];
          console.log('heyy =');

        for (let k = 0; k < PetriNet.nb_place; k++){
         a1[k] = temp[k] + PetriNet.post[k][t1] - PetriNet.pre[k][t1].arc_weight;
        }
        console.log('a1 =', a1 );

        bool1 = this.trans_enabled_persistance(t2,a1);
        console.log('bool1 =', bool1 );
        if(!bool1){
          PetriNet.persistent = false;
          return;
        }


         for (let k = 0; k < PetriNet.nb_place; k++){
          b1[k] = temp[k] + PetriNet.post[k][t2] - PetriNet.pre[k][t2].arc_weight;
         }
         bool1 = this.trans_enabled_persistance(t1,a1);
        
         if(!bool1){
          PetriNet.persistent = false;
          return;
        }
j++;
        }
        i++;
      }
    }

     
  trans_enabled_persistance(j,vect) {
      let enable = true;
      let i = 0;
      let k =0;
      let bool1 = false;
      let bool2 = false;

      for(k=0;k<PetriNet.nb_place;k++){
        if ( PetriNet.pre[k][j].arc_weight !== 0) bool1 = true;
        if (PetriNet.post[k][j] !== 0) bool2 = true;
    }

    if (bool1 === false && bool2 === false) enable = false;
    else { 
      while (i < PetriNet.nb_place && enable) {
        
  
          if (!PetriNet.pre[i][j].inhibitor && PetriNet.pre[i][j].arc_weight > vect[i]) {
              enable = false;
          }
          if (PetriNet.pre[i][j].inhibitor && PetriNet.pre[i][j].arc_weight <= vect[i]) {
              enable = false;
          }
          if (PetriNet.post[i][j] + vect[i] > PetriNet.place[i].capacity) {
              enable = false;
          }
          i++;
      }
    };

     return enable;
  }

  tran_sensibiliser(j, marking) {
    let enable = true;
    let i = 0;

    for (i = 0; i < PetriNet.nb_place && enable; i++) {
        if (!PetriNet.pre[i][j].inhibitor && PetriNet.pre[i][j].arc_weight > marking[i]) {
            enable = false;
            console.log("Transition not enabled due to pre condition not met.");
        }
        if (PetriNet.pre[i][j].inhibitor && PetriNet.pre[i][j].arc_weight <= marking[i]) {
            enable = false;
            console.log("Transition not enabled due to inhibitor arc condition not met.");
        }
        if (PetriNet.post[i][j] + marking[i] > PetriNet.place[i].capacity) {
            enable = false;
            console.log("Transition not enabled due to post condition not met.");
        }
    }

    return enable;
}

isTransitionAlive(t, accessible_marking) {
    // Check if the transition is enabled
    if (!this.trans_enabling(t)) {
        return false;
    }

    // Check if the transition leads to an accessible marking
    for (let i = 0; i < accessible_marking.length; i++) {
        let marking = accessible_marking[i];
        if (!this.tran_sensibiliser(t, marking)) {
            console.log("Transition not enabled for accessible marking.");
            return false;
        }
    }

    console.log("Transition is enabled for all accessible markings.");
    return true;
}


   
    



 
isPetriNetAlive(e,accessible_marking) {
  // Check if each transition can be fired from every accessible marking
  let t = 0;
  let stop = false;
  while (!stop && t < PetriNet.nb_transition) {
      if (!this.isTransitionAlive(t,accessible_marking))
          stop = true;
      t++;
  }

  PetriNet.alive = !stop;
  e.alive=!stop;

  
}



  }
    
  
  
