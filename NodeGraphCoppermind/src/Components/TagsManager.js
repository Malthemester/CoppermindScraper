import React, { useState } from 'react';
import Tag from './Tag'
import TagGroup from './TagGroup'
import Toggle from './Toggle'
export default function TagsManager(props) {

    const tagOffset = 30

    const style = {
        color: "white",
        position: "absolute",
        zIndex: "10",
        top: `${props.offset}px`,
        left: "1px"
    };

    return (
        <div style={style}>
            <Toggle value={props.toggelLinks} setValue={props.setToggelLinks} text={"Link Visibility"}></Toggle>
            <Toggle value={props.threeD} setValue={props.setThreeD} text={"3D (Little buggy)"}></Toggle>

            <TagGroup 
            colorPicker={props.colorPicker}
            text={"Group: Cosmere"}
            hiddenTags={props.hiddenTags} 
            setHiddenTags={props.setHiddenTags}
            tags={
                [
                    "stormlight archive",
                    "mistborn", "mistborn era 1", "mistborn era 2",
                    "elantris",
                    "emperor's soul",
                    "warbreaker",
                    "white sand",
                    "first of the sun",
                    "threnody",
                    "brandon sanderson",
                    "cosmere"
                ]}

            tagsContext={
                [
                    [["cosmere"], "Cosmere"],
                    [["stormlight archive"],"The Stormlight Archive"],
                    [["mistborn", "mistborn era 1", "mistborn era 2"], "Mistborn"],
                    [["mistborn era 1"], "Mistborn era 1"],
                    [["mistborn era 2"], "Mistborn era 2"],
                    [["elantris"], "Elantris"],
                    [["emperor's soul"], "The Emperor's soul"],
                    [["warbreaker"], "Warbreaker"],
                    [["white sand"], "White sand"],
                    [["first of the sun"], "Sixth of the Dusk"],
                    [["threnody"], "Threnody"],
                    [["brandon sanderson"], "Brandon Sanderson"]
                ]}
            
            ></TagGroup>

            <TagGroup 
            colorPicker={props.colorPicker}
            text={"Group: Non-Cosmere"}
            hiddenTags={props.hiddenTags} 
            setHiddenTags={props.setHiddenTags}
            tags={["alcatraz", "rithmatist", "reckoners", "legion", "skyward","dark one", ""]}

            tagsContext={
                [
                    [["alcatraz"], "Alcatraz"],
                    [["rithmatist"],"The Rithmatist"],
                    [["reckoners"],  "The Reckoners"],
                    [["legion"], "Legion"],
                    [["skyward"], "Skyward"],
                    [["dark one"], "Dark One"],
                    [[""], "No tag"]
                ]}
            ></TagGroup>
        </div>
    );
}