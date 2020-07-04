import React from "react";
import Editor from "./Editor";
import AuthUsers from '../User/AuthUsers';
import AllUsers from '../User/AllUsers';
const GroupEditor = (props)=>{
    const id = props.match.params.id;
    if(id === 'try'){
        return(
            <Editor groupId={id}/>
        )
    }
    else{
        return(
            <div>
                <Editor groupId={id}/>
                <AllUsers groupId={id}/>
                <AuthUsers groupId={id}/>
            </div>
        )
    }
}
export default GroupEditor;