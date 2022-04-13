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

    const colorbackground = {
        backgroundColor: props.colorPicker(props.tags[0])
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