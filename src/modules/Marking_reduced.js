import {PetriNet} from "./Petri_Net.js";
import vis from 'vis';

export class Marking_reduced {
    constructor(e) {
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        this.e = e ;
        this.save = [];
    }


    create_nodes() {
        const marking = this.e.accessible_marking[0];
        const nodeId = `Node${0 + 1}`;

        const markingInfo = `[${marking.current_marking.join(', ')}]`;
        let nodeOptions = {}; 
       
                nodeOptions = {
                    color: {
                        border: 'black' // Ajouter une bordure noire au premier nœud si nécessaire
                    },
                    borderWidth: 2, // Ajuster la largeur du bord
                    size: 50, // Ajuster la taille du nœud
                };
         
       
        // Ajouter le nœud avec les options de style appropriées
        const nodeToAdd = { id: nodeId, label: `Marking ${0 + 1}: ${markingInfo}` };
        Object.assign(nodeToAdd, nodeOptions); // Assigner explicitement les propriétés de nodeOptions
        this.nodes.add(nodeToAdd);



        for (let i = 1; i < this.e.accessible_marking.length; i++) {
            if (this.e.accessible_marking[i].tangible ){
            const marking = this.e.accessible_marking[i];
            const nodeId = `Node${i + 1}`;

            // Format the marking information separately
            const markingInfo = `[${marking.current_marking.join(', ')}]`;

            this.nodes.add({ id: nodeId, label: `Marking ${i + 1}: ${markingInfo}` });}
        }
    }

    create_edges() {

        for (let i = 0; i < 10000 ; i++) {
            this.save[i] = {
              indiceP : 0, 
              indiceM : 0, 
              proba : 0, 
            };
          }
    let k =  0 ; 
     for (let i= 0 ; i<this.e.accessible_marking.length ; i++){
        if (i== 0 || this.e.accessible_marking[i].tangible ){
           for (let j=0 ; j<this.e.accessible_marking.length ; j++ ){
           if (this.e.relationship[j][i].weight >0 ){
         if (this.e.accessible_marking[j].tangible){
            const weight = this.e.relationship[j][i].weight;
            const transition = this.e.relationship[j][i].transition;

            if (weight > 0) {
                this.edges.add({ 
                    from: `Node${i + 1}`, 
                    to: `Node${j + 1}`, 
                    label: ""+ transition +":" + weight.toFixed(2),
                    font: {
                        strokeWidth: 0, // Set the stroke width to 0 to remove the stroke
                        size: 16, // Set the font size to make it bigger
                        bold: true, // Set bold to true to make it bold
                    },})
         }}
         else{
         if (! this.e.accessible_marking[j].blocked )  { 
            this.save[k].indiceP = i;
            this.save[k].indiceM = j;
            this.save[k].proba = this.e.relationship[j][i].weight;
            k++;
        }}
           }
           }}
       
      }
   for ( let i=0 ; i<this.e.Connectionslength ; i++){
     if (  this.e.accessible_marking[this.e.Connections[i].Source].tangible )
     { if (this.e.accessible_marking[this.e.Connections[i].Destination].tangible )
    {
        this.edges.add({ 
            from: `Node${this.e.Connections[i].Source + 1}`, 
            to: `Node${this.e.Connections[i].Destination+ 1}`, 
            label: ""+ this.e.Connections[i].name +":" + this.e.Connections[i].proba.toFixed(2) ,
          })

    }
    else {
        if (! this.e.accessible_marking[this.e.Connections[i].Destination].blocked )  { 
            this.save[k].indiceP = this.e.Connections[i].Source ;
            this.save[k].indiceM = this.e.Connections[i].Destination;
            this.save[k].proba =  this.e.Connections[i].proba ;
            k++;
        }

    }
     }}
    
    

     let min = 0 ; 
     let max = k ; 
      while (min < max) {
        for (let i = 0; i < this.e.accessible_marking.length; i++) {
            for (let r = min; r < max; r++) {
                if (this.save[r].indiceM === i) {
                    for (let j = 0; j < this.e.accessible_marking.length; j++) {
                        if (this.e.relationship[j][i].weight > 0) {
                            if (this.e.accessible_marking[j].tangible) {
                                const weight = this.save[r].proba * this.e.relationship[j][i].weight;
                         if (weight > 0) {
                                    this.edges.add({
                                        from: `Node${this.save[r].indiceP + 1}`,
                                        to: `Node${j + 1}`,
                                        label:  weight.toFixed(2),
                            
                                      });
                                    }
                            } else {
                                if (i !== j && (this.e.relationship[j][i].weight * this.e.relationship[i][j].weight === 0)) {
                                    this.save[k].indiceP = this.save[r].indiceP;
                                    this.save[k].indiceM = j;
                                    this.save[k].proba =this.save[r].proba * this.e.relationship[j][i].weight;
                                    k++;
                                }
                            }
                        }}
                    
for ( let h= 0 ; h< this.e.Connectionslength ; i++){
  if ( this.e.Connections[h].Source === i){
   if ( this.e.accessible_marking[   this.e.Connections[h].Destination].tangible ){
    const weight = this.save[r].proba * this.e.Connections[h].proba ;
        this.edges.add({
            from: `Node${this.save[r].indiceP + 1}`,
            to: `Node${this.e.Connections[h].Destination + 1}`,
            label:  weight.toFixed(2),
           
        });
  

   }
  } else {
    if (i !== this.e.Connections[h].Destination && (this.e.relationship[this.e.Connections[h].Destination][i].weight * this.e.relationship[i][this.e.Connections[h].Destination].weight === 0)) {
        this.save[k].indiceP = this.save[r].indiceP;
        this.save[k].indiceM = this.e.Connections[h].Destination;
        this.save[k].proba =this.save[r].proba * this.e.Connections[h].proba ;
        k++;
    }

  }
    
}

                }
            }
          
         
        }
        min = max ; 
        max = k ; 
    }

}

}
