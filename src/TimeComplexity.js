import React from 'react';
import { TextField, Button, Grid, ButtonGroup } from '@mui/material';



export default function (props) {
    return <> 
       <TextField
        multiline
        rows={11}
        placeholder="Time Complexity"
        variant="filled"
        // fullWidth
        readOnly
        // value={} EDIT THIS 
       />
    </>
}

