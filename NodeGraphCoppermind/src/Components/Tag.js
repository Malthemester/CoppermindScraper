import React, { useState } from 'react';
export default function Tag(props) {

    const [tags, setTags] = React.useState(props.tags);

    const needChecked = (hiddenTags) => {
        return !tags.every(tag => hiddenTags.includes(tag))
    }

    const colorStyle = {
        color: "white",
        margin: "5px"
    };

    const handleHiddenTags = (checked) => {
        if (checked) {
            props.setTags(props.value.filter(tag => !tags.includes(tag)))
        }
        else {
            var newHiddenTags = props.value
            tags.forEach(tag => {
                if (!newHiddenTags.includes(tag)) {
                    newHiddenTags.push(tag)
                }
            })
            props.setTags([...newHiddenTags])
        }
    }

    const colorPicker = (tag) => {

        switch (tag) {
            case "mistborn":
                return "#d26407"
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
            case "legion (series)":
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

    const colorbackground = {
        backgroundColor: colorPicker(props.tags[0])
    }

    const Checkbox = () =>{
        return(
            <p style={colorStyle}>
                {props.group? <></> : <span class="dot" style={colorbackground}></span>}
                {" "+props.text}
                <input
                    type="checkbox"
                    checked={needChecked(props.value)}
                    class="slider round"
                    onChange={(change) => { handleHiddenTags(change.target.checked) }}
                />
                {props.group? <input
                    type="checkbox"
                    checked={props.expand}
                    class="slider round"
                    onChange={() => props.setExpand(!props.expand)}
                />: <></>}

            </p>
        )
    }

    return (
        <>
            {props.group? 
                <> 
                    <Checkbox></Checkbox>
                </> : 
                <p style={colorStyle}>
                    <Checkbox></Checkbox>
                </p>
            }
        </>
        
    );
}