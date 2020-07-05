//This component renders the notes shared with a user 
//This component displays the users notes as a clickable list routing to the route specified by the document id
import React from "react"
import {Grid, Button} from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles({
    root: {
      minWidth: '17rem',
      minHeight: '8rem',
      marginTop:12,
    },
    title: {
      fontSize: 14,
    },
  });
export default function AddNote(p) {
    const classes = useStyles();
    function handleClick(){
        // let tmp = '';
        const {token} = JSON.parse(localStorage.getItem('ColabNote'));
        const userId = token[1];
        fetch('/api/note/create',
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
            // tmp = json.id;
        })
    };
  return (
    <Grid item m={1}>
        <Button className={classes.root} onClick={handleClick} color="primary" variant="contained"><AddBoxIcon/></Button>
    </Grid>
  );
};
