import React, { useState } from 'react';
export default function SliderInput(props) {
    return (
        <div>
            <input 
                type="range" 
                min={props.min || 1}
                max={props.max || 100}
                value={props.value}
                class="slider"
                onChange={(newValue) => props.setValue(newValue.target.value)}
            />
        </div>
    );
  }