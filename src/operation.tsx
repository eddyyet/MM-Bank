import { Grid, TextField, Button } from '@mui/material';
import { useState } from 'react';
import './component.css';

interface Props {
    OperationName: string;
    Note: (input: number) => string;
    InputLabel: string;
    Action: string;
    Operator: (input: number) => void;
  }

function operation (props: Props): JSX.Element {
    const [InputValue, setInputValue] = useState<number>(0);

    return (
        <Grid container>
            <Grid item xs={12} sm={2} className='OperationName'>
                {props.OperationName}
            </Grid>
            <Grid item xs={12} sm={8} className='Note'>
                {InputValue ? props.Note(InputValue) : ''}
            </Grid>
            <Grid item xs={6} sm={1}>
                <TextField label={props.InputLabel}
                    type="text" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
                    value={InputValue}
                    onChange={event => setInputValue(+event.target.value)} />
            </Grid>
            <Grid item xs={6} sm={1}>
                <Button onClick={() => props.Operator(InputValue)}
                    sx= {{borderRadius:'2rem', border:'1px solid #DDDDDD',
                        backgroundColor:'#DDDDDD',color:'#1C1B1F',
                        '&:hover':{backgroundColor:'#2C2B2F',color:'#FFFFFF'}}}>
                    {props.Action}
                </Button>
                </Grid>
        </Grid>
    );
}