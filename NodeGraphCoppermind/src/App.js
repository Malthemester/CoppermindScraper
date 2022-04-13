import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import { forceCollide, forceCenter } from "d3-force";
import TagsManager from './Components/TagsManager'
import SearchBar from './Components/SearchBar'
import './App.css';

function App() {
  const graphRef = useRef();
  const [hiddenTags, setHiddenTags] = useState([""]);
  const [highlightNodes, setHighlightNodes] = useState(new Set())
  const [hoverNode, sethoverNode] = useState(null)
  const [toggelHighlight, setToggelHighlight] = useState(false)

  const [threeD, setThreeD] = useState(false)

  const [toggelLinks, setToggelLinks] = useState(false)
  const [minLink, setMinLink] = useState(0);
  const [linkDistance, setlinkDistance] = useState(5);

  const [strength, setStrength] = useState(-100);

  const [data, setData] = useState({nodes:[],links:[]});
  const [filterData, setFilterData] = useState();

  useEffect(() => {
    graphRef.current.d3Force('charge').distanceMax(2000)
    graphRef.current.d3Force("link").distance(linkDistance);
    graphRef.current.d3Force('charge').strength(strength);
    graphRef.current.d3Force("collide", forceCollide((node) => (0.7 * Math.pow((node.val), 0.65) + 8)))

    // graphRef.current.zoom(0.2)

  }, [linkDistance]);

  const nodesData = require('./nodesData.json');
  const linksData = require('./linksData.json');

  const colorPicker = (tag) => {
    switch (tag) {
        case "mistborn":
            return "#d26407"
        case "mistborn era 1":
            return "#c93814"
        case "mistborn era 2":
            return "#ff6c36"
        case "stormlight archive":
          return "#004cff"
        case "white sand":
          return "#f2ff9c"
        case "elantris":
          return "#c4b20a"
        case "emperor's soul":
          return "#b01048"
        case "reckoners":
          return "#9cfff0"
        case "first of the sun":
          return "#04c75c"
        case "threnody":
          return "#195a80"
        case "legion":
          return "#b80b5e"
        case "skyward":
          return "#010a38"
        case "rithmatist":
          return "#c400b4"
        case "warbreaker":
          return "#808080"
        case "cosmere":
          return "#1d052e"
        case "brandon sanderson":
          return "#8f5acc"
        case "dark one":
          return "black"
        case "alcatraz":
          return "#80576f"
        default:
          return "white"
      }
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
      
      if (node.tags.mainTag == "mistborn"){
        if (node.tags.bookTags.includes("mistborn era 1") && !node.tags.bookTags.includes("mistborn era 2")) {
          node.tags.mainTag = "mistborn era 1"
        } else if (!node.tags.bookTags.includes("mistborn era 1") && node.tags.bookTags.includes("mistborn era 2")) {
          node.tags.mainTag = "mistborn era 2"
        } 
      }
      node.color = colorPicker(node.tags.mainTag)
    })
  }, [])

  const graphData = useMemo(() => {
    console.log(hiddenTags)

    var filterdNodes = nodesData.filter((node) => (hiddenTags.includes(node.tags.mainTag) || node.val < minLink))
    var filterdNodesIDs = filterdNodes.map(node => node.id)

    const data = {
      nodes: nodesData.filter((node) => !filterdNodesIDs.includes(node.id)),
      links: linksData.filter((link) => !(filterdNodesIDs.includes(link.target) || filterdNodesIDs.includes(link.source)))
    };
    const newData = JSON.parse(JSON.stringify(data))

    setFilterData(newData)
  }, [hiddenTags, minLink, linkDistance, strength, highlightNodes, data])

  const handleRightClick = (node) => {
    window.open(node.url);
  }

  const handleClick = (id) => {

    const clickNode = filterData.nodes.find(node => node.id == id)

    if (toggelHighlight && hoverNode == id) {
      setToggelHighlight(false)
      highlightNodes.clear();
      setHighlightNodes(highlightNodes);
      sethoverNode(null)
    }
    else {
      highlightNodes.clear();
      highlightNodes.add(id)
      clickNode.neighbors.forEach(neighbor => highlightNodes.add(neighbor))
      sethoverNode(id)
      setHighlightNodes(highlightNodes)
      setToggelHighlight(true)
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

    const scale = graphRef.current.zoom() * 5 + 3
    const offset = (4 * Math.pow((node.val), 0.3)) + 10

    const width = ctx.measureText(node.name + "  ").width
    const height = (138 / scale);

    const x = node.x - (width / 2)
    const y = node.y - (height * 0.77) + offset

    if (width < 2 * radius) radius = width / 2
    if (height < 2 * radius) radius = height / 2

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.globalAlpha = 0.5

    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + width, y, x + width, y + height, radius)
    ctx.arcTo(x + width, y + height, x, y + height, radius)
    ctx.arcTo(x, y + height, x, y, radius)
    ctx.arcTo(x, y, x + width, y, radius)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1

    ctx.font = `${120 / scale}px sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = "center"
    ctx.fillText(node.name, node.x, node.y + offset)
    ctx.globalAlpha = 0.2
  }

  const paintRing = useCallback((node, ctx) => {
    
      ctx.beginPath()
      ctx.arc(node.x, node.y, (0.8 * Math.pow((node.val), 0.6)), 0, 2 * Math.PI, false)
      ctx.fillStyle = node.id == hoverNode ? "white" : node.color
      ctx.globalAlpha = 1
      ctx.fill()

      NameTag(ctx, node, 1)

  }, [hoverNode])

  var one = 1

  return (
    <div>

      <SearchBar data={filterData} handleClick={handleClick}></SearchBar>
      <TagsManager 
        threeD={threeD}
        setThreeD={setThreeD}
        colorPicker={colorPicker}
        hiddenTags={hiddenTags} 
        setHiddenTags={setHiddenTags}
        setToggelLinks={setToggelLinks}
        toggelLinks={toggelLinks}
      ></TagsManager>

      {threeD ? 
        <ForceGraph3D
          ref={graphRef}
          nodeRelSize={2}
          autoPauseRedraw={false}
          warmupTicks={100}
          cooldownTicks={0}
          enableNodeDrag={false}
          graphData={filterData}
          backgroundColor={"#2e2b28"}
          onNodeClick={(node) => handleClick(node.id)}
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
          linkVisibility={link => toggelLinks ? true : (hoverNode == link.target.id || hoverNode == link.source.id)}
          linkOpacity={link => (hoverNode == link.target.id || hoverNode == link.source.id) ? 0.3 : 0.1}
          linkWidth={link => (hoverNode == link.target.id || hoverNode == link.source.id) ? 1 : 0.1}
          linkColor={link => (hoverNode == link.target.id || hoverNode == link.source.id) ? "#5454ff" : "black"} 
        /> 
      :
        <ForceGraph2D
        ref={graphRef}
        nodeRelSize={2}
        autoPauseRedraw={false}
        warmupTicks={100}
        cooldownTicks={0}
        enableNodeDrag={false}
        graphData={filterData}
        backgroundColor={"#2e2b28"}
        onNodeClick={(node) => handleClick(node.id)}
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
        linkVisibility={link => toggelLinks ? true : (hoverNode == link.target.id || hoverNode == link.source.id)}
        linkOpacity={link => (hoverNode == link.target.id || hoverNode == link.source.id) ? 0.3 : 0.1}
        linkWidth={link => (hoverNode == link.target.id || hoverNode == link.source.id) ? 1 : 0.1}
        linkColor={link => (hoverNode == link.target.id || hoverNode == link.source.id) ? "#5454ff" : "black"} 
      /> }
    </div>
  );
}

export default App;
