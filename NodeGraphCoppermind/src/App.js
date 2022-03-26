import React, { useEffect, useRef, useState } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';

import './App.css';

function App() {


  const myData= require('./myData.json'); 
  console.log(myData)

  return (
    <ForceGraph3D
      graphData={myData}
    />
  );
}

export default App;
