import React, { useEffect, useRef, useState } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';

import './App.css';

function App() {
  const graphRef = useRef();


  useEffect(() => {

    graphRef.current.d3Force("link").distance(30);
    graphRef.current.d3Force('charge').strength(-500);
    // graphRef.current.d3Force('collide', d3.forceCollide(4));

    // graphRef.current.d3Force('center', null);
    // graphRef.current.d3Force('charge', null);

  }, []);

  const nodesData = require('./nodesData.json');
  const linksData = require('./linksData.json');

  console.log(nodesData.length) // 3245
  console.log(linksData.length) // 75804

  const graphData =
  {
    nodes: nodesData,
    links: linksData
  }

  return (
    <ForceGraph2D
      ref={graphRef}
      warmupTicks={100}
      cooldownTicks={0}
      graphData={graphData}
      enableNodeDrag={false} 
    />
  );
}

export default App;
