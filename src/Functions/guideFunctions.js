
// functions of the guide 

export const bluringElem = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.style.filter = "blur(7px)";
    element.style.transition = "filter 0.3s ease"; // Apply transition for a smooth effect
    element.style.transform = `scale(${1})`; // Scale the elemen

    

  }
};

export const inBluringElem = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.style.filter = "blur(0px)";
    element.style.transition = "filter 0.2s ease"; // Apply transition for a smooth effect
    element.style.transform = `scale(${1.3})`; // Scale the elemen
  }
};


export const blurBackground = () => {
  const elements = ["logo","button_guide","fitToWidth","shape-grille","shape-import","shape-export","shape-place","shape-transition1","shape-transition2","shape-arc1","shape-arc2" , "shape-play","shape-nextStep" , "shape-clock", "shape-pause","shape-stop","shape-exit","shape-save","shape-reset","shape-graph1","shape-graph2","shape-prop"];
  elements.forEach((id) => {
    if (id !== "popup0") {
      bluringElem(id);
    }
  });
};

export const initialization = (p, setTempTable) => {
  setTempTable([]); // Reset tempTable after creating edge

  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  blurBackground();
  document.getElementById("popup" + String(p)).classList.toggle('active');
};

export const inBlurBackground = () => {
  const elements = ["logo","button_guide","fitToWidth","shape-grille","shape-import","shape-export","shape-place","shape-transition1","shape-transition2","shape-arc1","shape-arc2" , "shape-play","shape-nextStep" , "shape-clock", "shape-pause","shape-stop","shape-exit","shape-save","shape-reset","shape-graph1","shape-graph2","shape-prop"];
  elements.forEach((id) => {
    inBluringElem(id);
    const element = document.getElementById(id);
    if (element) {
      element.style.transform = `scale(1)`; 
    }
  });
};

// Function to skip the popup
export const skip = (p) => {
document.getElementById("popup" + String(p)).classList.toggle('active');
inBlurBackground();

window.scroll({
  top: 0,
  left: 0,
  behavior: 'smooth'
});
};

// continue funct
export const continuePop = (p, setTempTable) => {
  setTempTable([]); // Reset tempTable after creating edge

  const popupPrevious = document.getElementById("popup" + String(p - 1));
  const popupCurrent = document.getElementById("popup" + String(p));

  if (popupPrevious) {
    popupPrevious.classList.toggle('active');
  }
  if (popupCurrent && p !== 20) {
    popupCurrent.classList.toggle('active');
  }

  switch (p) {
    case 1:
      inBluringElem("shape-grille");
      break;
    case 2:
      inBluringElem("shape-import");
      bluringElem("shape-grille");    
      break;
    case 3:
      inBluringElem("shape-export");
      bluringElem("shape-import");    

      break;
    case 4:
        inBluringElem("shape-place");
        bluringElem("shape-export");    

       break;
    case 5:
        inBluringElem("shape-transition1");
        bluringElem("shape-place");    

       break;
    case 6:
        inBluringElem("shape-transition2");
        bluringElem("shape-transition1");    

       break;
    case 7:
        inBluringElem("shape-arc1");
        bluringElem("shape-transition2");    

       break;
    case 8:
        inBluringElem("shape-arc2");
        bluringElem("shape-arc1");    

       break;
    case 9:
        inBluringElem("shape-play");
        bluringElem("shape-arc2");    

       break;
    case 10:
        inBluringElem("shape-nextStep");
        bluringElem("shape-play");    

       break;
    case 11:
        inBluringElem("shape-clock");
        bluringElem("shape-nextStep");    

       break;
    case 12:
        inBluringElem("shape-pause");
        bluringElem("shape-clock");    

       break;
    case 13:
        inBluringElem("shape-stop");
        bluringElem("shape-pause");    

       break;
   case 14:
        inBluringElem("shape-exit");
        bluringElem("shape-stop");    

       break;
  case 15:
      inBluringElem("shape-save");
      bluringElem("shape-exit");    

    break;
  case 16:
      inBluringElem("shape-reset");
      bluringElem("shape-save");    
    break;
    case 17:
      inBluringElem("shape-graph1");
      bluringElem("shape-reset");    
    break;
    case 18:
      inBluringElem("shape-graph2");
      bluringElem("shape-graph1");    
    break;
    case 19:
      inBluringElem("shape-prop");
      bluringElem("shape-graph2");    
    break;
    case 20:
      inBlurBackground();
      break;
    default:
      break;
  }
};
