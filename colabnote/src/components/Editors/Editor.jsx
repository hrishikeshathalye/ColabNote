// Import React dependencies.
import React, { useEffect, useMemo, useState, useRef } from "react";
// Import the Slate editor factory.
import { createEditor } from 'slate';
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react';
import initialValues from "../../initialValues";
import io from 'socket.io-client';

const socket = io("localhost:5000");  //instance of socketio client

const Editor = (p) => {
    const groupIdDest = p.groupId;
    const editor = useMemo(() => withReact(createEditor()), []);
    const remote = useRef(false);
    const [value, setValue] = useState([
      initialValues
    ]);
    const id = useRef(`${Date.now()}`);
    //useEffect hook for listening to socket events after render is complete
    useEffect(()=>{
      //get request to fetch initial values
      fetch(`http://localhost:5000/groups/${groupIdDest}`).then(x=>{
        x.json().then(data=>{
          setValue([data]);
        })
      });
      socket.on(`new-remote-operations-${groupIdDest}`, ({editorId, ops})=>{
          if(id.current !== editorId){
            remote.current = true;  
            ops.forEach(op => {editor.apply(op)});
            remote.current = false;
          }
      });
      return ()=>{
        socket.off(`new-remote-operations-${groupIdDest}`);
      }
    }, [editor, remote, groupIdDest]);

    return (
      // Add the editable component inside the context.
      <Slate editor={editor} 
        value={value} 
        style={{display:'inline'}}
        onChange=
        { opts => {
          setValue(opts);
          //console.log(editor.operations);
          const ops = editor.operations.filter((o)=>{
            if(o){
              return(
                o.type!== "set_selection" &&
                o.type!== "set_value" &&
                (!o.data)
              );
            }
            return false;
          })
          .map((o) => ({...o, data:{source:"one"}}));
          if(ops.length && !remote.current){
            const value = (opts[0]);
            socket.emit('new-operations',{editorId:id.current, groupIdDest, ops, value:value});
          }
        }} 
        >
        <Editable style={(p.pos)?
        {backgroundColor:'#e1ffc2',maxWidth:1050,minHeight:440,borderRadius:'0.5rem',border:'3px solid black',padding:'1rem',color:'black',margin:'auto',marginLeft:'1rem'}
        :{backgroundColor:'#e1ffc2',maxWidth:1050,minHeight:440,borderRadius:'0.5rem',border:'3px solid black',padding:'1rem',color:'black',margin:'auto',marginLeft:'auto'}}/>
      </Slate>
    )
}

export default Editor;