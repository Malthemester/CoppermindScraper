import React, { useState } from 'react';
export default function Toggle(props) {

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
        props.setValue(!props.value)
    }

    return (
        <div style={style}>
            <p style={colorStyle}>{props.text}
                <input
                    type="checkbox"
                    checked={props.value}
                    class="slider round"
                    onChange={() => { handleHiddenTags() }}
                />
            </p>
        </div>
    );
}