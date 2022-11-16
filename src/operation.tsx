import { Grid, TextField } from '@mui/material';
import './component.css';

interface Props {
    Name: string
    Note: (input: number) => string;
    InputLabel: string;
    OperationLabel: string;
    Operator: (operator: string) => void;
  }

function operation (props: Props): JSX.Element {
    return (
        <div />
    );
}