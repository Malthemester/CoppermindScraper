import React, { useEffect, useRef, useState, useMemo } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';

import './App.css';

function App() {
  const graphRef = useRef();
  const [hiddenTags, setHiddenTags] = useState(["Alcatraz", "The Rithmatist", "Reckoners", "Legion", "Skyward"]);


  useEffect(() => {

    graphRef.current.d3Force("link").distance(30);
    graphRef.current.d3Force('charge').strength(-500);
    // graphRef.current.d3Force('collide', d3.forceCollide(4));

    // graphRef.current.d3Force('center', null);
    // graphRef.current.d3Force('charge', null);

  }, []);

  const nodesData = require('./nodesData.json');
  const linksData = require('./linksData.json');


  // console.log(nodesData.filter((node) => node.bookTags.some(tag => hiddenTags.includes(tag))))

  const graphData = useMemo(() => {

    // var data = {
    //   nodes: nodesData.filter((node) => !hiddenTags.includes(node.bookTags)),
    //   links: linksData
    // }.filter((node) => node.bookTags.some(tag => !hiddenTags.includes(tag)))

    var filterdNodes = nodesData.filter((node) => node.bookTags.every(tag => hiddenTags.includes(tag)))
    console.log(filterdNodes)

    var filterdNodesIDs = filterdNodes.map(node => node.id)

    console.log(filterdNodesIDs)
    console.log("Here")

    const data = {
      nodes: nodesData.filter((node) => !filterdNodesIDs.includes(node.id)),
      links: linksData.filter((link) => !(filterdNodesIDs.includes(link.target) || filterdNodesIDs.includes(link.source)))
    };

    console.log("Here2")

    console.log(data.nodes)
    console.log(data.links)

    return data
  }, [hiddenTags]);

  const handleClick = (node) => {
    window.open(node.url);
  }

  return (
    <ForceGraph2D
      ref={graphRef}
      warmupTicks={100}
      cooldownTicks={0}
      graphData={graphData}
      enableNodeDrag={false}
      onNodeClick={handleClick}
    />
  );
}

export default App;
