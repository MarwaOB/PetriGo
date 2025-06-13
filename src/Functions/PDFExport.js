import React from 'react';
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';

class PDFExport extends React.Component {
  exportToPDF = () => {
    const graphContainer = document.getElementById('graph');
    
    const marginLeft = 0;
    const marginTop = 25;
    const marginRight = 20;
    const marginBottom = 0;
    
    domtoimage.toPng(graphContainer)
      .then((dataUrl) => {

        const pdf = new jsPDF('landscape', 'mm', 'a4');
        
        pdf.addImage(dataUrl, 'PNG', marginLeft, marginTop);
        pdf.save('Petri_Graph.pdf');
      })
      .catch((error) => {
        console.error('Error exporting to PDF:', error);
      });
  };

  render() {
    return (
      <button onClick={this.exportToPDF}>
        Export as PDF with Margins
      </button>
    );
  }
}

export default PDFExport;
