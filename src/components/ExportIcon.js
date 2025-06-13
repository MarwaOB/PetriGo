import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBook, faFileExport, faFileImport } from "@fortawesome/free-solid-svg-icons";
import PNGExport from "../Functions/PNGExport";
import JPGExport from "../Functions/JPGExport";
import PDFExport from "../Functions/PDFExport";
import { JSONExport } from "../Functions/JSONExport"; 
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './style.css'

const ExportIcon = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState('');
    const [fileName, setFileName] = useState('Petri_Graph');
    const [clickedButton, setClickedButton] = useState(null);
    const handleDialogOpen = () => {
      setDialogOpen(true);
    };
  
    const handleDialogClose = () => {
      setDialogOpen(false);
    };
  
    const handleExport = () => {
      if (exportFormat && fileName.trim() !== '') {
        const pngExportComponent = new PNGExport();
        const jpgExportComponent = new JPGExport();
        const pdfExportComponent = new PDFExport();
        console.log("gggg");

        switch (exportFormat.toLowerCase()) {
          case "png":
            pngExportComponent.exportToPNG(fileName);
            break;
          case "jpg":
            jpgExportComponent.exportToJPEG(fileName);
            break;
          case "pdf":
            pdfExportComponent.exportToPDF(fileName);
            break;
          case "json":
            JSONExport(fileName);
            break;
          default:
            alert("Invalid export format. Please choose PNG, JPG, PDF, or JSON.");
        }
      }
    };
    const [clickedFormat, setClickedFormat] = useState(null);
    return (
      <>
        <FontAwesomeIcon 
          icon={faFileExport} 
          className="sidebar-icon" 
          style={{ color: "white", padding: "0px 0px 0px 3px", cursor: "pointer" }} 
          onClick={handleDialogOpen}
        />
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm"className="Rayane-dialog" >
          <div className="export-dialog-content">
            <div className="export-format-input">
              <div>
                <p>Format d'exportation:</p>
               
                <div>
                <Button 
                  variant={exportFormat === "PNG" ? "contained" : "outlined"} 
                  onClick={() => {
                    setExportFormat("PNG");
                    setClickedFormat("PNG");
                     }}
                    style={{ backgroundColor: exportFormat === "PNG" ? "#008080 " : "white", 
                            color:exportFormat === "PNG" ?"white" :" #008080 ",
                }}
                >
                PNG
                </Button>
  
              <Button 
                variant={exportFormat === "JPG" ? "contained" : "outlined"} 
                onClick={() => {
                  setExportFormat("JPG");
                  setClickedFormat("JPG");
                }}
                style={{ backgroundColor: exportFormat === "JPG" ? "#008080 " : "white",
                color:exportFormat === "JPG" ?"white" :"#008080",
             }}
              >
              JPG
              </Button>
  
              <Button 
                variant={exportFormat === "PDF" ? "contained" : "outlined"} 
                onClick={() => {
                  setExportFormat("PDF");
                  setClickedFormat("PDF");
                }}
                style={{ backgroundColor: exportFormat === "PDF" ? "#008080 " : "white",
                color:exportFormat === "PDF" ?"white" :"#008080",
            }}
              >
              PDF
              </Button>
  
              <Button 
                variant={exportFormat === "JSON" ? "contained" : "outlined"} 
                onClick={() => {
                  setExportFormat("JSON");
                  setClickedFormat("JSON");
                }}
                style={{ backgroundColor: exportFormat === "JSON" ? "#008080 " : "white" ,
                color:exportFormat === "JSON" ?"white" :"#008080",

            }}
              >
              PGO
              </Button>
            </div>
  
                
              </div>
            </div>
            <div className="file-name-input">
            <p>Nom du fichier:</p>
              <TextField
               
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                InputProps={{ placeholder: 'File name' }}
              />
            </div>
            <div className="export-button-container">
                <Button 

                      onClick={() => {
                          handleExport();
                          setClickedButton("export");
                          handleDialogClose();
                        }}
                      className="export-button"
                      style={{ backgroundColor: clickedButton === "export" ? "#008080 " : "white" ,

          }}
          
                >
              Exporter
              </Button>
              <span style={{ margin: "0 10px" }}></span>
              <Button 
              
                                              
              onClick={() => {
                  setClickedButton("fermer");
                      handleDialogClose();
                  }}
              className="fermer-button"
              style={{ backgroundColor: clickedButton === "fermer" ? "#008080 " : "white" ,


              }}

              >
              Fermer
              </Button>
            </div>
          
          </div>
        </Dialog>
      </>
    );
  };
  
  export default ExportIcon;
