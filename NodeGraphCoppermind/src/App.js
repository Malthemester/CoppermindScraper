import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import { forceCollide } from "d3-force";
import SliderInput from './Slider'
import Tag from './Tag'

import './App.css';

function App() {
  const graphRef = useRef();
  const [hiddenTags, setHiddenTags] = useState(["The Rithmatist", "Reckoners", "Legion", "Skyward", "Alcatraz"]);
  const [highlightNodes, setHighlightNodes] = useState(new Set())
  const [hoverNode, sethoverNode] = useState(null)
  const [toggelHighlight, setToggelHighlight] = useState(false)

  const [minLink, setMinLink] = useState(0);

  const [linkDistance, setlinkDistance] = useState(40);
  const [strength, setStrength] = useState(-1000);

  useEffect(() => {

    graphRef.current.d3Force("link").distance(linkDistance);
    graphRef.current.d3Force('charge').strength(strength);
    graphRef.current.d3Force("collide", forceCollide(80));

  }, [linkDistance]);

  const nodesData = require('./nodesData.json');
  const linksData = require('./linksData.json');

  const nodeColors = ["#0000FF", "#FF0000", "#00FF00", "FF00FF", "#00FFFF", "#FFFF00"]
  const bookGroups = [
    ["Mistborn", "Stormlight Archive", "The Emperor's Soul", "Warbreaker", "Sixth of the Dusk", "White Sand"]
    ["Reckoners"],
    ["Legion"],
    ["Skyward"],
    ["The Rithmatist"],
    ["Alcatraz"],
  ]
  // const bookGroups = [
  //   ["Elantris"],
  //   ["Mistborn"],
  //   ["Mistborn Era 1"],
  //   ["Mistborn Era 2"],
  //   ["Stormlight Archive"],
  //   ["The Emperor's Soul"],
  //   ["Warbreaker"],
  //   ["White Sand"],
  //   ["Sixth of the Dusk"],
  //   ["Cosmere"],
  //   ["Cosmere", "Mistborn", "Stormlight Archive", "The Emperor's Soul", "Warbreaker", "Sixth of the Dusk", "White Sand"]
  //   ["Reckoners"],
  //   ["Legion"],
  //   ["Skyward"],
  //   ["The Rithmatist"],
  //   ["Alcatraz"],
  // ]

  const nodeColor = () => {
    nodesData.forEach(node => {
      let isSubArr = bookGroups.forEach(group => group.every(e => node.bookTags.includes(e)))


    })
  }

  const neighborData = useMemo(() => {
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
    var filterdNodes = nodesData.filter((node) => (node.bookTags.every(tag => hiddenTags.includes(tag)) || node.val < minLink))
    var filterdNodesIDs = filterdNodes.map(node => node.id)

    const data = {
      nodes: nodesData.filter((node) => !filterdNodesIDs.includes(node.id)),
      links: linksData.filter((link) => !(filterdNodesIDs.includes(link.target) || filterdNodesIDs.includes(link.source)))
    };

    return data
  }, [hiddenTags, minLink, linkDistance, strength, highlightNodes])

  const handleRightClick = (node) => {
    window.open(node.url);
  }

  const handleClick = (node) => {

    if (toggelHighlight && hoverNode == node.id) {
      setToggelHighlight(false)
      highlightNodes.clear();
      setHighlightNodes(highlightNodes);
      sethoverNode(null)
    }
    else {
      highlightNodes.clear();
      highlightNodes.add(node.id)
      node.neighbors.forEach(neighbor => highlightNodes.add(neighbor))
      sethoverNode(node.id)
      setHighlightNodes(highlightNodes)
      setToggelHighlight(true)
      // graphRef.current.zoomToFit(node);

    }
  }

  const handleNodeHover = (node) => {
    console.log(node)

    if (!toggelHighlight) {
      highlightNodes.clear();

      if (node) {
        highlightNodes.add(node.id)
        node.neighbors.forEach(neighbor => highlightNodes.add(neighbor))
        sethoverNode(node.id)
      }
      else {
        sethoverNode(null)
      }
      setHighlightNodes(highlightNodes)
    }
  }


  const NameTag = (ctx, node, radius) => {

    const scale = graphRef.current.zoom() * 5 + 1
    const offset = (6 * Math.pow((node.val), 0.3)) + 10

    const width = (3 + node.name.length) * 50 / scale
    const height = (120 / scale);

    const x = node.x - (width / 2)
    const y = node.y - (height * 0.8) + offset

    if (width < 2 * radius) radius = width / 2
    if (height < 2 * radius) radius = height / 2

    ctx.fillStyle = 'gray'

    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + width, y, x + width, y + height, radius)
    ctx.arcTo(x + width, y + height, x, y + height, radius)
    ctx.arcTo(x, y + height, x, y, radius)
    ctx.arcTo(x, y, x + width, y, radius)
    ctx.closePath()
    ctx.fill()

    ctx.font = `${120 / scale}px sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = "center"
    ctx.fillText(node.name, node.x, node.y + offset)
  }

  const NODE_R = 2;

  const paintRing = useCallback((node, ctx) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, (0.8 * Math.pow((node.val), 0.6)), 0, 2 * Math.PI, false);
    ctx.fillStyle = node.id == hoverNode ? 'yellow' : 'orange';
    ctx.fill();

    NameTag(ctx, node, 5)

  }, [hoverNode])

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
        onEngineStop={() => graphRef.current.zoomToFit()}
        nodeRelSize={NODE_R}
        autoPauseRedraw={false}
        warmupTicks={100}
        cooldownTicks={0}
        graphData={graphData}
        backgroundColor={"#2e2b28"}
        enableNodeDrag={false}
        onNodeClick={handleClick}
        onNodeRightClick={handleRightClick}
        nodeCanvasObjectMode={node => highlightNodes.has(node.id) ? 'after' : undefined}
        nodeCanvasObject={paintRing}
        onNodeHover={handleNodeHover}
        onBackgroundClick={() => {
          setToggelHighlight(false)
          highlightNodes.clear();
          setHighlightNodes(highlightNodes);
          sethoverNode(null)
        }}
        linkVisibility={link => (hoverNode == link.target.id || hoverNode == link.source.id)}
        linkOpacity={link => (hoverNode == link.target.id || hoverNode == link.source.id) ? 0.5 : 0.05}
        linkWidth={link => (hoverNode == link.target.id || hoverNode == link.source.id) ? 1.4 : 0.05}
        linkColor={link => (hoverNode == link.target.id || hoverNode == link.source.id) ? "#f1f1f1" : "black"}
      />
    </div>
  );
}

export default App;
