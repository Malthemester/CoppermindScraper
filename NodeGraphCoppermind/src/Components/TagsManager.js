import React, { useState } from 'react';
import Tag from './Tag'
export default function TagsManager(props) {

    const tagOffset = 30

    const style = {
        color: "white",
        position: "absolute",
        zIndex: "10",
        top: `${props.offset}px`
    };

    return (
        <div style={style}>

            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Tag-Group Corsmere"} offset={tagOffset * 0}
            tags={
            [
                "stormlight archive",
                "mistborn", "mistborn era 1", "mistborn era 2",
                "elantris",
                "rithmatist",
                "emperor's soul",
                "warbreaker",
                "white sand",
                "first of the sun",
                "threnody",
                "cosmere"
            ]}></Tag>

            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Stormlight Archive"} offset={tagOffset * 1} tags={["stormlight archive"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Cosmere"} offset={tagOffset * 2} tags={["cosmere"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Mistborn"} offset={tagOffset * 3} tags={["mistborn"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Elantris"} offset={tagOffset * 6} tags={["elantris"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Warbreaker"} offset={tagOffset * 7} tags={["warbreaker"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"First of the sun"} offset={tagOffset * 8} tags={["first of the sun"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Threnody"} offset={tagOffset * 9} tags={["threnody"]}></Tag>

            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Tag-Group Non-Corsmere"} offset={tagOffset * 10}
                tags={["alcatraz", "rithmatist", "reckoners", "legion (series)", "cytoverse", ""]}></Tag>

            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Alcatraz"} offset={tagOffset * 11} tags={["alcatraz"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Rithmatist"} offset={tagOffset * 12} tags={["rithmatist"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Reckoners"} offset={tagOffset * 13} tags={["reckoners"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Legion"} offset={tagOffset * 14} tags={["legion (series)"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Skyward"} offset={tagOffset * 15} tags={["cytoverse"]}></Tag>
            <Tag value={props.hiddenTags} setTags={props.setHiddenTags} text={"Brandon Sanderson"} offset={tagOffset * 15} tags={["brandon sanderson"]}></Tag>

        </div>
    );
}