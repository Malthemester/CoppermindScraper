import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import { forceCollide, forceCenter } from "d3-force";
import SliderInput from './Components/Slider'
import TagsManager from './Components/TagsManager'
import SearchBar from './Components/SearchBar'

import './App.css';

function App() {
  const graphRef = useRef();
  const [hiddenTags, setHiddenTags] = useState([]);
  const [highlightNodes, setHighlightNodes] = useState(new Set())
  const [hoverNode, sethoverNode] = useState(null)
  const [toggelHighlight, setToggelHighlight] = useState(false)

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

    graphRef.current.zoom(0.2)

  }, [linkDistance]);

  const nodesData = require('./nodesData.json');
  const linksData = require('./linksData.json');

  const nodeColor = useMemo(() => {
    nodesData.forEach(node => {
      switch (node.tags.mainTag) {
        case "mistborn":
          if (node.tags.bookTags.includes("mistborn era 1") && !node.tags.bookTags.includes("mistborn era 2")) {
            node.color = "#c93814"
          } else if (!node.tags.bookTags.includes("mistborn era 1") && node.tags.bookTags.includes("mistborn era 2")) {
            node.color = "#ff6c36"
          } else {
            node.color = "#D26407"
          }
          break;
        case "stormlight archive":
          node.color = "#004cff"
          break;
        case "white sand":
          node.color = "#f2ff9c"
          break;
        case "elantris":
          node.color = "#c4b20a"
          break;
        case "emperor's soul":
          node.color = "#b01048"
          break;
        case "reckoners":
          node.color = "#9cfff0"
          break;
        case "first of the sun":
          node.color = "#04c75c"
          break;
        case "threnody":
          node.color = "#195a80"
          break;
        case "legion (series)":
          node.color = "#b80b5e"
          break;
        case "skyward":
          node.color = "#010a38"
          break;
        case "rithmatist":
          node.color = "#c400b4"
          break;
        case "warbreaker":
          node.color = "#808080"
          break;
        case "cosmere":
          node.color = "#1d052e"
          break;
        case "brandon sanderson":
          node.color = "#8f5acc"
          break;
        case "dark one":
          node.color = "black"
          break;
        case "alcatraz":
          node.color = "#80576f"
          break;
        default:
          node.color = "white"
      }
    })
  }, [])

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
    console.log(hiddenTags)

    // var filterdNodes = nodesData.filter((node) => (hiddenTags.includes(node.tags.mainTag) || node.tags.mainTag == "") || node.val < minLink)
    var filterdNodes = nodesData.filter((node) => (hiddenTags.includes(node.tags.mainTag) || node.val < minLink) || node.tags.mainTag == "")
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

  const NODE_R = 2;

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
        hiddenTags={hiddenTags} 
        setHiddenTags={setHiddenTags}
        setToggelLinks={setToggelLinks}
        toggelLinks={toggelLinks}
      ></TagsManager>


      <ForceGraph2D
        ref={graphRef}
        nodeRelSize={NODE_R}
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
    </div>
  );
}

export default App;
