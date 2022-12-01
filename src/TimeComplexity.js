import React from 'react';
import { TextField, Button, Grid, ButtonGroup } from '@mui/material';


// by Madeline and Cameron
export default function (props) {
    return <> 
       <TextField
        multiline
        style={{ fontFamily: 'Monospace', backgroundColor: 'white', opacity: '50%' }}

        rows={11}
        value={props.complexityText}
        placeholder="Time Complexity"
        variant="filled"
        fullWidth
        readOnly
       />
    </>
}

