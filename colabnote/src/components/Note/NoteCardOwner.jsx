import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
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

export default function NoteCardOwner(p) {
  const classes = useStyles();
  const [data, setData] = useState('');
  const [docId, setId] = useState('');
  useEffect(()=>{
    const {props} = p;
    let {_id, data} = props;
    setId(_id);
    data = data.substring(0, 20);
    data += '...';
    setData(data);
  }, [p]);
  function onDelete(){
    fetch('/api/note/delete',
        { method: 'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                id : docId,
            })
        })
  };
  return (
    <Grid item m={1}>
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {data}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" color="primary"><a style={{textDecoration:'none', color:'inherit'}} href={`/group/${docId}`}>Open</a></Button>
          <Button size="small" variant="contained" color="secondary" onClick={onDelete}>Delete</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
