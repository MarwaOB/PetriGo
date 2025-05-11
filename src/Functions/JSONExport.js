import { PetriNet } from "../modules/Petri_Net";

const JSONExport = (fileName) => {
  const dataToExport = getData();
  const jsonData = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const finalFileName = fileName.endsWith('.pgo') ? fileName : `${fileName}.pgo`;

  link.href = url;
  link.setAttribute('download', finalFileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const getData = () => {
 
  return {
    nb_place: PetriNet.nb_place,
    nb_arc: PetriNet.nb_arc,
    nb_transition: PetriNet.nb_transition,
    nb_immediate_enabled: PetriNet.nb_immediate_enabled,
    nb_temp_enabled: PetriNet.nb_temp_enabled,
    description: PetriNet.description,
    date_creation: PetriNet.date_creation,
    name: PetriNet.name,
    currant_marking: PetriNet.currant_marking,
    initial_marking: PetriNet.initial_marking,
    currant_marking_tangible: PetriNet.currant_marking_tangible,
    nb_simulation: PetriNet.nb_simulation,
    simulationSpeedCoefficient: PetriNet.simulationSpeedCoefficient,
    arc: PetriNet.arc,
    pre: PetriNet.pre,
    post: PetriNet.post,
    place: PetriNet.place,
    transition: PetriNet.transition,
    parameter: PetriNet.parameter,
    enabled_immediate: PetriNet.enabled_immediate,
    enabled_temporary: PetriNet.enabled_temporary,
    weight_sum: PetriNet.weight_sum,
    blocked: PetriNet.blocked,
    bounded: PetriNet.bounded
  };
};

export { JSONExport, getData };
