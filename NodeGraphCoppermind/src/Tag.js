import React, { useState } from 'react';
export default function Tag(props) {
    
    const [tags, setTags] = React.useState(props.tags);

    const style = {
        color: "white",
        position: "absolute",
        zIndex : "10",
        top: `${props.offset}px`
    };


    const colorStyle = {
        color: "white",
    };
    
    const handleHiddenTags = (change) => {
        if (change) {
            props.setTags(props.value.filter(tag => !tags.includes(tag)))
        }
        else{
            var newHiddenTags = props.value
            tags.forEach(tag => {
                if(!newHiddenTags.includes(tag)){
                    newHiddenTags.push(tag)
                }
            })
            console.log(newHiddenTags)
            props.setTags(newHiddenTags)
        }
    }

    return (
        <div style={style}>
            <p style={colorStyle}>{props.text}
                <input 
                    type="checkbox" 
                    checked={true}
                    class="slider round"
                    onChange={(change) => {handleHiddenTags(change)}}
                />
            </p>
        </div>
    );
  }