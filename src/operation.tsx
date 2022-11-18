import { styled } from '@mui/material/styles';
import { Grid, TextField, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { useBalance, ETDtoMMD, MMDtoCMMD } from './tokenvalue';
import './component.css';

const TextFieldFormatted = styled(TextField)({
    '& label':{color:'#999999'},'&:hover label':{color:'#CCCCCC'},'& label.Mui-focused':{color:'#CCCCCC'},
    '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#999999'},'&:hover fieldset': {borderColor: '#CCCCCC'},'&.Mui-focused fieldset': {borderColor: '#CCCCCC'}}, 
    input: {textAlign:'right', color:'#999999'}}
);

export function TopUpMMD (): JSX.Element {
    const [InputValue, setInputValue] = useState<number>(0);
    const [Message, setMessage] = useState<string>('');
    const ETD = Number(useBalance().balance.ETD);

    useEffect(() => {
        if (InputValue === NaN || InputValue === 0) {
            setMessage('');
        } else if (InputValue / ETDtoMMD <= ETD) {
            setMessage('Needs ' + InputValue / ETDtoMMD + ' ETD');
        } else {
            setMessage('Needs ' + InputValue / ETDtoMMD + ' ETD. Not enough ETD.');
        }
    }, [InputValue]);

    return (
        <Grid container>
            <Grid item xs={12} sm={2} className='OperationName'>
                Top Up MMD
            </Grid>
            <Grid item xs={12} sm={8} className='Note'>
                {Message}
            </Grid>
            <Grid item xs={6} sm={1}>
                <TextFieldFormatted size='small' label='MMD'
                    type="tex" inputProps={{pattern: '^(\d*\.)?\d+$' }} 
                    value={InputValue}
                    onChange={event => setInputValue(+event.target.value)} />
            </Grid>
            <Grid item xs={6} sm={1} sx={{ paddingLeft:'1rem'}}>
                <Button onClick={() => TopUpMMDOperator(InputValue)}
                    sx={{width:'100%',
                        borderRadius:'2rem', border:'1px solid #999999',backgroundColor:'#1C1B1F',color:'#999999',
                        '&:hover':{backgroundColor:'#2B2C2F'}}}>
                    Top Up
                </Button>
            </Grid>
        </Grid>
    );
}

function TopUpMMDOperator (input: number): void {

}