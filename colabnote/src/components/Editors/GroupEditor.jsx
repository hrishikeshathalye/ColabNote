import React from "react";
import Editor from "./Editor";
const GroupEditor = (props)=>{
    const id = props.match.params.id;
    return(
        <Editor groupId={id}/>
    )
}
export default GroupEditor;