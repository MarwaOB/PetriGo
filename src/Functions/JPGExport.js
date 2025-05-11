import React from 'react';
import domtoimage from 'dom-to-image';

class JPGExport extends React.Component {
  exportToJPEG = (filename) => {
    const graphContainer = document.getElementById('graph');
    domtoimage.toJpeg(graphContainer)
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = filename || 'Petri_Graph.jpg';
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error('Error exporting to JPG:', error);
      });
  }

  render() {
    return (
      <button onClick={this.exportToJPEG}>Export JPG</button>
    );
  }
}

export default JPGExport;