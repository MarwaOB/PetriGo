import { create, all } from 'mathjs';

import {PetriNet} from "./Petri_Net.js"
import {Marking} from "./Marking.js"

const math = create(all);



function extractSubMatrix(matrix, rank) {
  const subMatrix = [];
  const pivotColumns = [];
  
  // Identification des colonnes des pivots
  for (let i = 0; i < matrix[0].length; i++) {
      const column = matrix.map(row => row[i]);
      if (column.some(entry => entry !== 0)) {
          pivotColumns.push(i);
      }
  }

  // Extraire les lignes correspondant aux colonnes des pivots
  for (let row of matrix) {
      const subRow = [];
      for (let colIdx of pivotColumns) {
          subRow.push(row[colIdx]);
      }
      subMatrix.push(subRow);
  }

  return subMatrix;
}

function calculateRank(matrix) {
  // Clone the matrix to avoid modifying the original one
  const clonedMatrix = matrix.map(row => [...row]);
  const rowCount = clonedMatrix.length;
  const columnCount = clonedMatrix[0].length;

  let rank = 0;
  for (let col = 0; col < columnCount; col++) {
      // Find pivot element
      let pivotRow = rank;
      while (pivotRow < rowCount && clonedMatrix[pivotRow][col] === 0) {
          pivotRow++;
      }

      if (pivotRow < rowCount) {
          // Swap current row with pivot row
          [clonedMatrix[rank], clonedMatrix[pivotRow]] = [clonedMatrix[pivotRow], clonedMatrix[rank]];

          // Scale the pivot row to make the pivot element 1
          const pivot = clonedMatrix[rank][col];
          for (let i = col; i < columnCount; i++) {
              clonedMatrix[rank][i] /= pivot;
          }

          // Make other rows zero in the current column
          for (let i = 0; i < rowCount; i++) {
              if (i !== rank && clonedMatrix[i][col] !== 0) {
                  const factor = clonedMatrix[i][col];
                  for (let j = col; j < columnCount; j++) {
                      clonedMatrix[i][j] -= factor * clonedMatrix[rank][j];
                  }
              }
          }

          rank++;
      }
  }

  return rank;
}


function estInversible(matrice) {
  if (matrice.length === 0) {
      return false; 
  }
  if (matrice.length !== matrice[0].length) {
    return false; 
}
  const determinant = calculerDeterminant(matrice);
  return determinant !== 0;
}

function obtenirSousMatrice(matrice, ligne, colonne) {
  return matrice.filter((row, i) => i !== ligne).map(row => row.filter((_, j) => j !== colonne));
}

function calculerDeterminant(matrice) {
  if (matrice.length === 2 && matrice[0].length === 2) {
      return (matrice[0][0] * matrice[1][1]) - (matrice[0][1] * matrice[1][0]);
  }

  let determinant = 0;
  for (let i = 0; i < matrice.length; i++) {
      const cofacteur = matrice[0][i] * Math.pow(-1, i) * calculerDeterminant(obtenirSousMatrice(matrice, 0, i));
      determinant += cofacteur;
  }
  return determinant;
}




export  class MarkingGraph {
    constructor() {
      this.accessible_marking = [];
      this.to_explore = [];
      this.relationship = []; 
      this.Connections= [];
      this.Connectionslength =0;
      this.bornetude = false ; 
      this.Infini = true  ; 
      this.resettable=false;
      this.alive=false;
    }
  
    markingGraph() {
      for (let i = 0; i < 100; i++) {
        this.Connections[i] = {
          Source: 0, 
          Destination  : 0, 
          name:'',
          proba : 0, 
        };
      }


      let Mark = [];
      for(let i=0 ; i< PetriNet.nb_place ; i++){
        Mark[i]= PetriNet.initial_marking[i];
      }
     let e = new Marking(Mark);
      e.id = 0;
      this.accessible_marking.push(e);
      this.to_explore.push(e);
      let i1 = 0;
      let i2 = 0;
  
      for (let i = 0; i < PetriNet.nb_simulation; i++) {
        this.relationship[i] = [];
        for (let j = 0; j < PetriNet.nb_simulation; j++) {
          this.relationship[i][j] = {
            weight: 0,
            transition: '',
          };
        }
      }
  
      while (i2 !== -1 && i1 < PetriNet.nb_simulation) {
        this.to_explore[i2].enabling();
        var mc = this.to_explore[i2];
        i2--;
  
        if (mc.blocked_marking === false) {
          mc.establish_probability();
  
          if (mc.tangible === false) {
            for (let i = 0; i < mc.nb_enabled_imm; i++) {
              let index = mc.immediate_transition_taken[i][0];
              mc.create_child(index);
  
              let k = 0;
              let stop = false;
  
              while (k < this.accessible_marking.length && !stop) {
                stop = mc.marking_comparison(this.accessible_marking[k].current_marking);
                k++;
              }
  
              if (stop === true) {
                if (this.relationship[k - 1][mc.id].weight > 0)
              {  this.Connections[this.Connectionslength].Source=mc.id ;
                this.Connections[this.Connectionslength].Destination= k - 1;
                this.Connections[this.Connectionslength].proba=mc.probability[i] ;
                this.Connections[this.Connectionslength].name= 'T' + index;
                this.Connectionslength++ ;}
                else 
                {
                  this.relationship[k - 1][mc.id].weight = mc.probability[i];
                  this.relationship[k - 1][mc.id].transition = 'T' + index;
                }
            
              } else {
                let e = new Marking(mc.child_marking.slice()); // Clone the child marking
i1++;
if(i1 < PetriNet.nb_simulation) { 

e.setId(i1);
this.accessible_marking[i1] = e;
i2++;
this.to_explore[i2] = e;

this.relationship[i1][mc.id].weight = mc.probability[i];
this.relationship[i1][mc.id].transition = 'T' + index;
}
              }
            }
          } else {
            for (let i = 0; i < mc.nb_temp_enabled; i++) {
              let index = mc.delayed_transition_taken[i];
              mc.create_child(index);
  
              let k = 0;
              let stop = false;
  
              while (k < this.accessible_marking.length  && !stop) {
                stop = mc.marking_comparison(this.accessible_marking[k].current_marking);
                k++;
              }
  
              if (stop === true) {
                if (this.relationship[k - 1][mc.id].weight > 0)
              {  this.Connections[this.Connectionslength].Source=mc.id ;
                this.Connections[this.Connectionslength].Destination= k - 1;
                this.Connections[this.Connectionslength].proba=mc.probability[i] ;
                this.Connections[this.Connectionslength].name= 'T' + index;
                this.Connectionslength++ ;}
                else 
                {
                  this.relationship[k - 1][mc.id].weight = mc.probability[i];
                  this.relationship[k - 1][mc.id].transition = 'T' + index;
                }
              } else {
                let e = new Marking(mc.child_marking.slice()); // Clone the child marking
i1++;
if(i1 < PetriNet.nb_simulation) { 

e.setId(i1);
this.accessible_marking[i1] = e;
i2++;
this.to_explore[i2] = e;
this.relationship[i1][mc.id].weight = mc.probability[i];
this.relationship[i1][mc.id].transition = 'T' + index;
}
              }
            }
                }
              }
            }
      if (this.accessible_marking.length < PetriNet.nb_simulation -1 ){
        this.bornetude = true ;
        this.Infini = false ;
      }
  this.Bornitude();

          }
    
    
        Bornitude() {
            if (!this.bornetude) {
                PetriNet.CreateIncidenceMarking();
                if (estInversible(PetriNet.incidenceSysteme) ) {
                    let Vecteur = [];
                    let solutions= [];
                  
                for (let i = 0; i < PetriNet.PlacesC.length; i++) {
                   Vecteur[i] = PetriNet.initial_marking[PetriNet.PlacesC[i]];  }
                
                  solutions = math.lusolve(PetriNet.incidenceSysteme, Vecteur);
                 
                    let NonNul = false;
                    let stop = false;
    
                    for (let j = 0; j < solutions.length && !stop; j++) { 
                        if (solutions[0][j] !== 0) {
                            NonNul = true;
                        }
                        if (solutions[0][j] < 0) { 
                           stop = true;
                            }
                    }
    
                    if (NonNul && !stop) {
                        this.bornetude = true;
                    }else {
                      this.bornetude = false;
                    }
    
                    this.Infini = !this.bornetude;
    
                }
                if ( PetriNet.incidenceSysteme.length ===0 ||PetriNet.incidenceSysteme[0].length ===0  ){
                  this.bornetude = true;
                  this.Infini = !this.bornetude;
                }
                
                else { 
                      let modifiedMatrix =[] 
                      modifiedMatrix = new Array(PetriNet.PlacesC.length ).fill(null).map(() => new Array(PetriNet.incidenceSysteme[0].length).fill(0));
                      for (let r=0 ;r< PetriNet.PlacesC.length ; r++ ){
                       const tokens =  PetriNet.initial_marking[PetriNet.PlacesC[r]];
                       for (let j=0 ; j< PetriNet.incidenceSysteme[0].length && tokens !== 0 ; j++){
                   modifiedMatrix[r][j]= PetriNet.incidenceSysteme[r][j]* tokens;
                       }}
            
                      const rank = calculateRank(modifiedMatrix);
                     const subMatrix = extractSubMatrix(modifiedMatrix, rank);
                     const Vecteur = [];
                    for (let i = 0; i < PetriNet.PlacesC.length; i++) {
                    Vecteur[i] = PetriNet.initial_marking[PetriNet.PlacesC[i]];
                    }

                    if (subMatrix.length > 0 && subMatrix[0].length > 0) {
                      const transposedMatrix = math.transpose(subMatrix);
                  
                      const VecteurMatrix = math.matrix([Vecteur]); // Convertir Vecteur en une matrice à une seule ligne
                      const augmentedMatrix = math.concat(transposedMatrix, VecteurMatrix, 0); // Concaténer sur les lignes
                      
                      const numRows = subMatrix.length;
                      if (numRows > rank) {
                          const borderDeterminants = [];
                          for (let l = rank + 1; l <= numRows; l++) {
                            if (l <= augmentedMatrix.size()[0]) { // Vérifier que l ne dépasse pas le nombre de lignes de augmentedMatrix
                                const determinant = math.det(math.subset(augmentedMatrix, math.index(math.range(0, l), math.range(0, l))));
                                borderDeterminants.push(determinant);
                            }
                        }
                        
                          const allBorderDeterminantsZero = borderDeterminants.every(determinant => math.abs(determinant) < 1e-10);
                      
                          if (allBorderDeterminantsZero) {
                            this.bornetude = true;
                            this.Infini = !this.bornetude;
                          } else {
                            this.bornetude = false;
                            this.Infini = !this.bornetude;
                          }
                      } else {
                        this.bornetude = true;
                        this.Infini = !this.bornetude;
                      }
                    }else {
                      this.bornetude = false;
                      this.Infini = !this.bornetude;
                    }
             
                    }
                   
                }
             
            }

            
            verifier_Reinitiabilite() {
              const initialMarking = this.accessible_marking[0];
          
              
              if (this.accessible_marking.length <= 1) {
                  this.resettable = true;
                  PetriNet.resettable= true ; 
                  return;
              }
          
              
              const visited = new Set();  
              const queue = [initialMarking]; 
              visited.add(initialMarking); 
          
              while (queue.length > 0) {
                  const currentMarking = queue.shift(); 
                  const relationshipRow = this.relationship[currentMarking.id]; // 
                  for (let j = 0; j < relationshipRow.length; j++) {
                      const weight = relationshipRow[j].weight;
                      if (weight > 0) {
                          const childMarking = this.accessible_marking[j]; 
                          if (!visited.has(childMarking)) {
                              visited.add(childMarking); 
                              queue.push(childMarking); 
                          }
                      }
                  }
              }
          
              for (let i = 1; i < this.accessible_marking.length; i++) {
                  const marking = this.accessible_marking[i];
                  if (!visited.has(marking)) {
                      this.resettable = false;
                      PetriNet.resettable= false ; 

                      return;
                  }
              }
          
              this.resettable = true;
              PetriNet.resettable= true ; 

          }
          
       
        }
