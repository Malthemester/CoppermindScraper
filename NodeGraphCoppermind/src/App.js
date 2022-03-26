import React, { useEffect, useRef, useState } from "react";

import './App.css';

function App() {

  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const [zoom, setZoom] = useState(1);


  useEffect (() => {
    const canvas = canvasRef.current
    canvas.width = window.innerWidth * 2
    canvas.height = window.innerHeight * 2
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`

    const ctx = canvas.getContext("2d")
    ctx.scale(zoom,zoom)
    contextRef.current = ctx
    draw()
  }, [])


  useEffect (() => {
    contextRef.current.scale(zoom,zoom)
    draw()
  }, [zoom])


  const draw = () => {
    console.log(canvasRef.current)
    // contextRef.current.fillStyle = "black"
    
    // contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    
    contextRef.current.beginPath()
    contextRef.current.fillStyle = "green"
    contextRef.current.arc(500, 500, 10, 0, Math.PI * 2)
    contextRef.current.fill()

  }

  return (
    <canvas
      ref={canvasRef}
      onWheel ={(e) => {
        console.log(e.deltaY > 0)
        setZoom(e.deltaY > 0 ? 1.1 : .9)
        console.log(zoom)
      
      }}
    />
  );
}

export default App;
