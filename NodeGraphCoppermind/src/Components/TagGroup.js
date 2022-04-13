import React, { useState } from 'react';
import Tag from './Tag'
export default function TagGroup(props) {

    const [expand , setExpand] = React.useState(true);
    const style = {
        margin: "10px"
    };

    const ReturnTags = () =>{
        var toggelTags = []

        props.tagsContext.forEach(context => { 
            toggelTags.push(
                <Tag 
                    colorPicker={props.colorPicker}
                    value={props.hiddenTags} 
                    setTags={props.setHiddenTags} 
                    tags={context[0]}
                    text={context[1]}>
                </Tag>
            )
        })
        return toggelTags
    }

    return (
        <div >
            <Tag 
                colorPicker={props.colorPicker}
                value={props.hiddenTags} 
                setTags={props.setHiddenTags} 
                tags={props.tags}
                text={props.text}
                group={true}
                expand={expand}
                setExpand={setExpand}>
            </Tag>

            {expand ? 
            <div style={style}>
                <ReturnTags></ReturnTags>
            </div>: <></>}
        </div>
    );
}