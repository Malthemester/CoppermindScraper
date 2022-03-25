import { vectorAdd, vectorDirection, vectorScale } from './vectorHelper'

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
ctx.globalAlpha = 1;

console.log(ctx)

canvas.width = window.innerWidth
canvas.height = window.innerHeight

centerPoint = [canvas.width / 2, canvas.height / 2]

forceRepel = 5
forceConnection = 5
forceCenter = 5

maxDistance = 100


class connectionNode {

    connectionTo = []
    connectionFrom = 0

    constructor(_title, x, y, _size, _color, connect) {
        this.title = _title
        this.pos = [x, y]
        this.size = _size
        this.color = _color
        this.connectionFrom = connect
    }

    drawLines() {

        this.connectionTo.forEach(connect => {
            ctx.beginPath()
            ctx.moveTo(this.pos[0], this.pos[1]);
            ctx.lineTo(connect.pos[0], connect.pos[1]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke();
        })
    }

    drawNode() {
        ctx.fillStyle = this.color

        ctx.beginPath()
        ctx.arc(this.pos[0], this.pos[1], this.size, 0, Math.PI * 2)
        ctx.fill()
    }

    move() {
        forceToMove = [0, 0]

        centerForce = vectorScale(vectorDirection(this.pos, centerPoint), forceCenter)

        forceToMove = vectorAdd(forceToMove, centerForce)

        console.log(forceToMove)

    }
}



const nodeArray = []

ctx.fillRect(0, 0, canvas.width, canvas.height)

nodeArray.push(new connectionNode("Malthe", 100, 100, 10, "green"))
nodeArray.push(new connectionNode("Thomas", 150, 110, 10, "green"))
nodeArray.push(new connectionNode("Thor", 170, 150, 10, "green"))
nodeArray.push(new connectionNode("Johan", 70, 130, 10, "green"))

console.log(nodeArray)

nodeArray[0].connectionTo.push(nodeArray[1])
nodeArray[0].connectionTo.push(nodeArray[2])
nodeArray[0].connectionTo.push(nodeArray[2])

// nodeArray[1].connectionTo.push(nodeArray[0])
nodeArray[3].connectionTo.push(nodeArray[0])

nodeArray.forEach(node => {
    node.drawLines()
})


nodeArray.forEach(node => {
    node.drawNode()
    // node.move()
})