//This component renders the notes shared with a user 
import React, {useEffect, useState} from "react"
import {Grid} from '@material-ui/core';
import NoteCard from './NoteCardAuthUser';
function SharedNotes(props){
    let [notes, setNotes] = useState([]);
    useEffect(() => {
        let tmp = '';
        const {token} = JSON.parse(localStorage.getItem('ColabNote'));
        const userId = token[1];
        fetch('/api/note/getnotesbyauthuser',
        { method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                auth_user : userId,
            })
        })
        .then(res => res.json())
        .then(json => {
            tmp = json.docs;
        }).then(()=>{
            const noteList = tmp.map((n) => {
                return (<NoteCard props={n}></NoteCard>)
            });
            setNotes(noteList);
        });
    });
    return(
        <div class="container">
            <Grid container spacing={10} alignItems="center">
                {notes}
            </Grid>
        </div>
    );
}
export default SharedNotes;