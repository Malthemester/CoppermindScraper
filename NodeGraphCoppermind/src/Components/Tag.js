import React, { useState } from 'react';
export default function Tag(props) {

    const [tags, setTags] = React.useState(props.tags);

    const needChecked = (hiddenTags) => {
        return !tags.every(tag => hiddenTags.includes(tag))
    }

    const style = {
        color: "white",
        position: "absolute",
        zIndex: "10",
        top: `${props.offset}px`
    };

    const colorStyle = {
        color: "white",
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

    return (
        <div>
            <p style={colorStyle}>{props.text}
                <input
                    type="checkbox"
                    checked={needChecked(props.value)}
                    class="slider round"
                    onChange={(change) => { handleHiddenTags(change.target.checked) }}
                />
            </p>
        </div>
    );
}