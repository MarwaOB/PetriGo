import vis from 'vis';

export class Marking_graphe {
    constructor(e) {
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        this.e = e ;
    }

    create_nodes() {
        // Iterate through accessible_marking to create nodes
        for (let i = 0; i < this.e.accessible_marking.length; i++) {
            const marking = this.e.accessible_marking[i];
            const nodeId = `Node${i + 1}`;
    
            // Format the marking information separately
            const markingInfo = `[${marking.current_marking.join(', ')}]`;
    
            // Définir les options de style pour le premier nœud
            let nodeOptions = {}; 
            if (i === 0) {
                    nodeOptions = {
                        color: {
                            border: 'black' // Ajouter une bordure noire au premier nœud si nécessaire
                        },
                        borderWidth: 2, // Ajuster la largeur du bord
                        size: 50, // Ajuster la taille du nœud
                    };
                };
           
            // Ajouter le nœud avec les options de style appropriées
            const nodeToAdd = { id: nodeId, label: `Marking ${i + 1}: ${markingInfo}` };
            Object.assign(nodeToAdd, nodeOptions); // Assigner explicitement les propriétés de nodeOptions
            this.nodes.add(nodeToAdd);
        }
}


create_edges() {
    for (let j = 0; j < this.e.accessible_marking.length; j++) {
        for (let i = 0; i < this.e.accessible_marking.length; i++) {
            const weight = this.e.relationship[i][j].weight.toFixed(2);
            const transition = this.e.relationship[i][j].transition;
            const match = transition.match(/T(\d+)/);
            let id_Transition = 0;
            if (match) {
                id_Transition = parseInt(match[1], 10);
            }
            if (weight > 0) {
                this.edges.add({
                    from: `Node${j + 1}`,
                    to: `Node${i + 1}`,
                    label: `${transition}:${weight}`,
                });
            }
        }
    }

 
    for (let i = 0; i < this.e.Connectionslength; i++) {
        const weight = this.e.Connections[i].proba.toFixed(2);
        const transition = this.e.Connections[i].name;

        this.edges.add({
            from: `Node${this.e.Connections[i].Source + 1}`,
            to: `Node${this.e.Connections[i].Destination + 1}`,
            label: `${transition}:${weight}`,
        });
    }
}

}
