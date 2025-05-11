import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBook, faFileExport, faFileImport } from "@fortawesome/free-solid-svg-icons";
import PNGExport from "../Functions/PNGExport";
import JPGExport from "../Functions/JPGExport";
import PDFExport from "../Functions/PDFExport";
import "./style.css";

const SidebarData = () => {
  const [tooltipTextSide, setTooltipTextSide] = useState('');
  const [lastClickedIcon, setLastClickedIcon] = useState('');

  const handleMouseEnter = (text) => {
    setTooltipTextSide(text);
  };

  const handleMouseLeave = () => {
    setTooltipTextSide('');
  };


  return [
    
    {
      id: 1,
      icon: (
        <div 
          className="icon-containerSideBar"  
          onMouseEnter={() => handleMouseEnter('Importer')} 
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative' }} // Ensure the container is positioned relatively
        >
          <FontAwesomeIcon
            icon={faFileImport}
            style={{
              color: lastClickedIcon === 'import' ? '#008080' : 'white',
              cursor: 'pointer'
            }}
            onClick={() => {  }}
          />
          {tooltipTextSide === 'Importer' && (
            <div 
              className="tooltipSideBar" 
              style={{
                position: 'absolute',
                top: '-50px', // Adjust as needed to position the tooltip above the sidebar
                left: '50%', // Center horizontally
                transform: 'translateX(-50%)',
                backgroundColor: '#FFF',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                zIndex: 1001, 
              }}
            >
              {tooltipTextSide}
            </div>
          )}
        </div>
      ),
    },
    
    {
      id: 2,
      icon: <FontAwesomeIcon 
              icon={faFileExport} 
              className="sidebar-icon" 
              style={{ color: "white", padding: "0px 0px 0px 3px", cursor: "pointer" }} 
              onClick={() => {
                const exportFormat = window.prompt("Choose export format (PNG, JPG, PDF):");
                if (exportFormat) {
                  const pngExportComponent = new PNGExport();
                  const jpgExportComponent = new JPGExport();
                  const pdfExportComponent = new PDFExport();
                  switch (exportFormat.toLowerCase()) {
                    case "png":
                      pngExportComponent.exportToPNG();
                      break;
                    case "jpg":
                      jpgExportComponent.exportToJPEG();
                      break;
                    case "pdf":
                      pdfExportComponent.exportToPDF();
                      break;
                    default:
                      alert("Invalid export format. Please choose PNG, JPG, or PDF.");
                  }
                }
              }}
            />,
    },
    {
      id: 3,
      icon: <FontAwesomeIcon icon={faBook} className="sidebar-icon" style={{ color: "white", padding: "0px 0px 0px 3px" }} />,
    },
    {
      id: 4,
      icon: <FontAwesomeIcon icon={faArrowRight} className="sidebar-icon mt-16" style={{ color: "white", padding: "0px 0px 0px 3px" }} />,
    },
  ];
};

export default SidebarData;
