import React, { useState } from 'react';
export default function Toggle(props) {

    const colorStyle = {
        color: "white",
        margin: "5px"
    };

    const handleHiddenTags = () => {
        props.setValue(!props.value)
    }

    return (
        <p style={colorStyle}>{props.text}
            <input
                type="checkbox"
                checked={props.value}
                class="slider round"
                onChange={() => { handleHiddenTags() }}
            />
        </p>
    );
}