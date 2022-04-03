import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';

import './App.css';

function App() {
  const graphRef = useRef();
  const [hiddenTags, setHiddenTags] = useState(["Alcatraz", "The Rithmatist", "Reckoners", "Legion", "Skyward"]);

  useEffect(() => {
    graphRef.current.d3Force("link").distance(30);
    graphRef.current.d3Force('charge').strength(-600);
  }, []);

  const nodesData = require('./nodesData.json');
  const linksData = require('./linksData.json');

  const graphData = useMemo(() => {

    var filterdNodes = nodesData.filter((node) => node.bookTags.every(tag => hiddenTags.includes(tag)))
    var filterdNodesIDs = filterdNodes.map(node => node.id)

    const data = {
      nodes: nodesData.filter((node) => !filterdNodesIDs.includes(node.id)),
      links: linksData.filter((link) => !(filterdNodesIDs.includes(link.target) || filterdNodesIDs.includes(link.source)))
    };

    return data
  }, [hiddenTags]);

  const handleClick = (node) => {
    window.open(node.url);
  }

  const NODE_R = 4;
  const paintRing = useCallback((node, ctx) => {
    // add ring just for highlighted nodes
    ctx.beginPath();
    ctx.arc(node.x, node.y, (4 * Math.pow((node.val), 0.5056)) + 4 , 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    console.log(node)
    console.log(3.8763 * Math.pow((node.val), 0.5056))
    console.log(3.8763 * 40)
  }, []);

  return (
    <ForceGraph2D
      ref={graphRef}
      nodeRelSize={NODE_R}
      autoPauseRedraw={false}
      warmupTicks={100}
      cooldownTicks={0}
      graphData={graphData}
      enableNodeDrag={false}
      onNodeClick={handleClick}
      nodeCanvasObjectMode={node => (((node.id == 'Nightblood' || node.id == 'Cosmere') || node.id == 'Cognitive Shadow')  || node.id == 'Tress of the Emerald Sea')? 'before' : undefined}
      nodeCanvasObject={paintRing}
    />
  );
}

export default App;
