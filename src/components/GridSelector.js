import React, { useState } from "react";
import { RiGridFill } from "react-icons/ri";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import './style.css';

const GridSelector = ({ onChange }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [clickedButton, setClickedButton] = useState(null);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleGridOptionSelect = (option) => {
        onChange(option); // Pass the selected option value to the onChange function
        setDialogOpen(false);
    };

    return (
        <>
            <RiGridFill
                className="grid-icon"
                style={{ color: "white", padding: "0px 0px 0px 3px", cursor: "pointer" }}
                onClick={handleDialogOpen}
            />
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" className="Rayane-dialog">
                <div className="grid-selector-content">
                    <Button
                    className="dots-button"
                        variant="outlined"
                        onClick={() =>{ 
                            handleGridOptionSelect("dots")
                            setClickedButton("dots")
                        }}
                        style={{ backgroundColor: clickedButton === "dots" ? "#008080 " : "white" ,}}
                    >
                        Dots
                    </Button>
                    <Button
                    className="lines-button"
                        variant="outlined"
                        onClick={() => {
                            handleGridOptionSelect("lines")
                            setClickedButton("lines")
                        }}
                        style={{ backgroundColor: clickedButton === "lines" ? "#008080 " : "white" ,}}
                    >
                        Lines
                    </Button>
                    <Button
                        className="cross-button"
                        variant="outlined"
                        onClick={() =>{ 
                            setClickedButton("cross")
                            handleGridOptionSelect("cross")
                        }}
                        style={{ backgroundColor: clickedButton === "cross" ? "#008080 " : "white" ,}}
                    >
                        Cross
                    </Button>
                    <div style={{ marginTop: "6px" }}></div>

                    <div  className="fermer-button-container" >
                    <Button
                        className="fermer-button"

                        variant="outlined"
                        onClick={() =>{ 
                            setClickedButton("cross")
                            handleDialogClose()
                        }}
                        style={{ backgroundColor: clickedButton === "fermer" ? "#008080 " : "white" ,}}
                    >
                        Fermer
                    </Button>
                   </div>
                </div>
            
            </Dialog>
        </>
    );
};

export default GridSelector;
