import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';
import { forceCollide } from "d3-force";

function CollisionDetectionFG () {
  const fgRef = useRef();

  const [graphData, setGraphData] = useState(
    { 
        nodes: 
            [
                {
                    "id": "Dragonsteel",
                    "name": "Dragonsteel"
                },
                {
                    "id": "The Stormlight Archive",
                    "name": "The Stormlight Archive",
                },
                {
                    "id": "Mistborn (series)",
                    "name": "Mistborn (series)"
                },
                {
                    "id": "Nightblood (book)",
                    "name": "Nightblood (book)"
                },
                {
                    "id": "Earth",
                    "name": "Earth"
                },
                {
                    "id": "Nightblood",
                    "name": "Nightblood"
                },
                {
                    "id": "Warbreaker",
                    "name": "Warbreaker"
                },
                {
                    "id": "Shattering",
                    "name": "Shattering"
                },
                {
                    "id": "Axon",
                    "name": "Axon"
                },
                {
                    "id": "Gaotona",
                    "name": "Gaotona"
                },
                {
                    "id": "Physical Realm",
                    "name": "Physical Realm"
                }      
            ], 
        links: 
            [
                {
                    "source": "Gaotona",
                    "target": "Axon"
                },
                {
                    "source": "Shattering",
                    "target": "Warbreaker"
                },
                {
                    "source": "Nightblood",
                    "target": "Shattering"
                },
            ] 
    });

  useEffect(() => {
    const fg = fgRef.current;

    // Deactivate existing forces
    fg.d3Force('center', null);
    fg.d3Force('charge', null);

    // Add collision and bounding box forces
    fg.d3Force('collide', forceCollide((node) => {
        console.log(node)
        return node.val
    }));
    fg.d3Force('box', () => {
      const SQUARE_HALF_SIDE = N * 8;

      nodes.forEach(node => {
        const x = node.x || 0, y = node.y || 0;

        // bounce on box walls
        if (Math.abs(x) > SQUARE_HALF_SIDE) { node.vx *= -1; }
        if (Math.abs(y) > SQUARE_HALF_SIDE) { node.vy *= -1; }
      });
    });

    // Generate nodes
    const N = 80;
    const nodes = [...Array(N).keys()].map(() => ({
      // Initial velocity in random direction
    //   vx: (Math.random() * 2) - 1,
    //   vy: (Math.random() * 2) - 1,
      val: Math.round(Math.random() * 2 + 1)
    }));

    setGraphData({ nodes, links: [] });
  }, []);

  const handleRightClick = (node) => {
    console.log(node)
  }

  return <ForceGraph2D
    ref={fgRef}
    graphData={graphData}
    cooldownTime={Infinity}
    nodeRelSize={2}
    d3AlphaDecay={0}
    d3VelocityDecay={0}
    onNodeRightClick={handleRightClick}
    />;
};

export default CollisionDetectionFG;
