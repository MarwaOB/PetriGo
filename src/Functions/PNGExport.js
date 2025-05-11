import React from 'react';
import domtoimage from 'dom-to-image';

class PNGExport extends React.Component {
  exportToPNG = (filename) => {
    const graphContainer = document.getElementById('graph');
    domtoimage.toPng(graphContainer)
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = filename ||'Petri_Graph.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error('Error exporting to PNG:', error);
      });
  }

  render() {
    return (
      <button onClick={this.exportToPNG}>Export PNG</button>
    );
  }
}

export default PNGExport;