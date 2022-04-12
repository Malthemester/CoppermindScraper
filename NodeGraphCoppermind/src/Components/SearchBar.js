import React, { useState, useMemo } from 'react';
export default function SearchBar(props) {
    
    const [nodeIDs, setNodeIDs] = useState();
    const [Match, setMatch] = useState();
    const [text, setText] = useState("");
    
    const getNodeID = useMemo(() => {
        const iDs = props.data.nodes.map(node => node.id)
        setNodeIDs(iDs)
    }, [props.data])

    const style = {
        position: "absolute",
        zIndex: "10",
        top: `10px`,
        left: "50%"
    };

    const colorStyle = {
        color: "white",
        textAlign: "center"
    };
    
    const ShowMatch =() => {
        if(text == "")
            return <></>

        var idMatch = nodeIDs.filter(id => id.toLowerCase().startsWith(text.toLowerCase()))
        idMatch.length = 5

        var showMatch = []

        idMatch.forEach(iMatch => { 
            showMatch.push(
                <p 
                    style={colorStyle}
                    onClick={() => {
                        props.handleClick(iMatch)
                        setText("")
                    }}>
                    {iMatch}
                </p>
            )
        })
        return showMatch
    }

    return (
        <div style={style}>
            <input 
                style={{textAlign: "center"}}
                type="text"
                value={text}
                onChange={(change) => setText(change.target.value)}
            />
            <ShowMatch></ShowMatch>
        </div>
    );
  }