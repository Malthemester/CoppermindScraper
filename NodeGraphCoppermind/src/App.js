import React, { useEffect, useRef, useState } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';

import './App.css';

function App() {
  const graphRef = useRef();


  useEffect(() => {

    graphRef.current.d3Force("link").distance(100);
    graphRef.current.d3Force('charge').strength(0);
    // graphRef.current.d3Force('center', null);
    // graphRef.current.d3Force('charge', null);

  }, []);

  const myData1 = require('./nodesData.json');
  const linksData = require('./linksData.json');

  const myData3 =
  {
    nodes: myData1,
    links: linksData
  }

  return (
    <ForceGraph2D
      ref={graphRef}
      warmupTicks={100}
      cooldownTicks={0}
      graphData={myData3}
    />
  );
}

export default App;
