import React, { useState } from 'react';
export default function Tag(props) {
    return (
        <div>
            <p>{props.tag}</p>
            <input 
                type="checkbox" 
                checked={props.value.includes(props.tag)}
                class="slider round"
                onChange={(newValue) => {
                    console.log(newValue)
                    console.log(props.value)
                    console.log(props.setValue)
                    // console.log(props.value.indexOf(props.tag))
                    const inFilter = props.value.includes(props.tag)
                    if (newValue.target.checked){
                        if (!inFilter){
                            props.setValue(props.value.push(props.tag))
                        }
                    } 
                    else
                        if (inFilter){
                            // props.setValue(props.value.splice(props.value.findIndex(props.tag), 1))
                        }

                }}
            />
        </div>
    );
  }