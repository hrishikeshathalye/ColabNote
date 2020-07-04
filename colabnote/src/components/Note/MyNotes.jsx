//This component displays the users notes as a clickable list routing to the route specified by the document id
import React, {useEffect, useState} from "react"
import {Grid} from '@material-ui/core';
import NoteCard from './NoteCardOwner';
import AddNote from './AddNote';
function MyNotes(props){
    let [notes, setNotes] = useState([]);
    useEffect(() => {
        let tmp = '';
        const {token} = JSON.parse(localStorage.getItem('ColabNote'));
        const userId = token[1];
        fetch('/api/note/getnotesbyowner',
        { method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                owner : userId,
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
                <AddNote/>
            </Grid>
        </div>
    );
}
export default MyNotes;