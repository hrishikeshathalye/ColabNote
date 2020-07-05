import React,{useEffect, useState} from "react";
import Editor from "./Editor";
import AuthUsers from '../User/AuthUsers';
import AllUsers from '../User/AllUsers';
import {
    getFromStorage,
} from '../../utils/storage'
export default function GroupEditor(props){
        let [data, setData] = useState([]);
        useEffect(()=>{
            const id = props.match.params.id;
            if(id === 'try'){
                setData([<Editor groupId={id}/>])
            }
            else{
                const obj = getFromStorage('ColabNote');
                if(obj && obj.token){
                    const {token} = obj;
                    const userid = token[1];
                    // const tokenid = token[0];
                fetch('/api/note/isowner',
                    { method: 'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        'noteId' : id,
                        'userId' : userid
                    })
                })
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                    if(json.success){
                        setData([
                            <div>
                                <Editor pos="owner" groupId={id}/>
                                <AllUsers groupId={id}/>
                                <AuthUsers groupId={id}/>
                            </div>
                        ])
                    }
                    else{
                        fetch('/api/note/isauth',
                            { method: 'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            body:JSON.stringify({
                                'noteId' : id,
                                'userId' : userid
                            })
                        })
                        .then(res => res.json())
                        .then(json => {
                            if(json.success){
                                setData([
                                    <div>
                                        <Editor groupId={id}/>
                                    </div>
                                ])
                            }
                            else{
                                setData([
                                    <div style={{position:'absolute', left:'20%', top:'50%'}}>
                                        <h1>You are not authorised to view this note.</h1>
                                    </div>
                                ])
                            }       
                        })
                    }
                })
            }
            
       }
    }, [props.match.params.id]);
    return(data);
}