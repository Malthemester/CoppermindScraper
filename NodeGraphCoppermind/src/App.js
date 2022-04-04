import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import * as d3 from 'd3'
import SliderInput from './Slider'
import Tag from './Tag'

import './App.css';

function App() {
  const graphRef = useRef();
  const [hiddenTags, setHiddenTags] = useState([ "The Rithmatist", "Reckoners", "Legion", "Skyward", "Alcatraz"]);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  
  const [minLink, setMinLink] = useState(5);
  const [linkDistance, setlinkDistance] = useState(40);
  const [strength, setStrength] = useState(-700);

  useEffect(() => {

    // console.log(d3)
    console.log(linkDistance)
    // graphRef.current.d3Force('collide', d3.forceCollide(100));

    graphRef.current.d3Force("link").distance(linkDistance);
    graphRef.current.d3Force('charge').strength(strength);

  }, [linkDistance]);

  const nodesData = require('./nodesData.json');
  const linksData = require('./linksData.json');

  const neighborData = useMemo(() =>{
    console.log("here")
    linksData.forEach(link => {
      const a = nodesData.find(node => node.id == link.source)
      const b = nodesData.find(node => node.id == link.target)
      !a.neighbors && (a.neighbors = [])
      !b.neighbors && (b.neighbors = [])
      !a.neighbors.includes(b.id) && a.neighbors.push(b.id)
      !b.neighbors.includes(a.id) && b.neighbors.push(a.id)
    })

    nodesData.forEach(node => {
      node.val = node.neighbors.length
    })
  }, [])

  const graphData = useMemo(() => {

    console.log(hiddenTags)
    var filterdNodes = nodesData.filter((node) => (node.bookTags.every(tag => hiddenTags.includes(tag)) || node.val < minLink))
    var filterdNodesIDs = filterdNodes.map(node => node.id)

    const data = {
      nodes: nodesData.filter((node) => !filterdNodesIDs.includes(node.id)),
      links: linksData.filter((link) => !(filterdNodesIDs.includes(link.target) || filterdNodesIDs.includes(link.source)))
    };
    
    return data
  }, [hiddenTags, minLink, linkDistance, strength]);

  const handleClick = (node) => {
    window.open(node.url);
  }

  const handleNodeHover = (node) => {
    console.log(node)
    
    highlightNodes.clear();

    if(node){
      highlightNodes.add(node.id)

    }

    setHighlightNodes(highlightNodes);
  }

  const NODE_R = 2;
  const paintRing = useCallback((node, ctx) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, (7.2 * Math.pow((node.val), 0.36)) + 1 , 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
  }, []);

  var one = 1

  return (
    <div>

      {/* <SliderInput value={minLink} setValue={setMinLink}></SliderInput>
      <SliderInput value={linkDistance} setValue={setlinkDistance} max={300}></SliderInput>
      <SliderInput value={strength} setValue={setStrength} max={300} min={-2000}></SliderInput>
  
      <Tag value={hiddenTags} setValue={setHiddenTags} tag={"Alcatraz"}></Tag>
      <Tag value={hiddenTags} setValue={setHiddenTags} tag={"Warbreaker"}></Tag>
      <Tag value={hiddenTags} setValue={setHiddenTags} tag={"Stormlight Archive"}></Tag> */}

      <ForceGraph2D
        ref={graphRef}
        nodeRelSize={NODE_R}
        autoPauseRedraw={false}
        warmupTicks={100}
        cooldownTicks={0}
        graphData={graphData}
        enableNodeDrag={false}
        onNodeClick={handleClick}
        nodeCanvasObjectMode={node => highlightNodes.has(node.id) ? 'before' : undefined}
        nodeCanvasObject={paintRing}
        onNodeHover={handleNodeHover}
        linkColor={(link) => (highlightNodes.has(link.target.id) || highlightNodes.has(link.source.id) ? "red" : "black")}
        linkOpacity={() => 0.5}
        linkWidth={link => (highlightNodes.has(link.target.id) || highlightNodes.has(link.source.id) ? 1 : 0)}

      />
    </div>
  );
}

export default App;
