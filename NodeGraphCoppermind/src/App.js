import React, { useEffect, useRef, useState } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';

import './App.css';

function App() {


  const myData = require('./myData.json');
  console.log(myData)

  const myData1 = require('./nodesData.json');
  const myData2 = require('./linksData.json');
  console.log(myData1)
  console.log(myData2)

  const myData3 =
  {
    nodes: myData1,
    links: myData2
  }

  console.log(myData3)
  return (
    <ForceGraph3D
      graphData={myData3}
    />
  );
}

export default App;
