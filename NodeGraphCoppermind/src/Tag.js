import React, { useState } from 'react';
export default function Tag(props) {

    const needChecked = (hiddenTags) => {
        return !tags.every(tag => hiddenTags.includes(tag))
    }

    const [tags, setTags] = React.useState(props.tags);
    const [check, setCheck] = React.useState(needChecked(props.value));

    const style = {
        color: "white",
        position: "absolute",
        zIndex: "10",
        top: `${props.offset}px`
    };

    const colorStyle = {
        color: "white",
    };

    const handleHiddenTags = () => {
        if (!check) {
            props.setTags(props.value.filter(tag => !tags.includes(tag)))
        }
        else {
            var newHiddenTags = props.value
            tags.forEach(tag => {
                if (!newHiddenTags.includes(tag)) {
                    newHiddenTags.push(tag)
                }
            })
            console.log(newHiddenTags)
            props.setTags([...newHiddenTags])
        }
        setCheck(!check)
    }

    return (
        <div style={style}>
            <p style={colorStyle}>{props.text}
                <input
                    type="checkbox"
                    checked={check}
                    class="slider round"
                    onChange={(change) => { handleHiddenTags(change) }}
                />
            </p>
        </div>
    );
}