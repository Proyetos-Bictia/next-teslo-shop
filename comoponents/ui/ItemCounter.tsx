import { FC } from 'react';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

interface Props {
  curretValue: number;
  updateQuantity: (value: number) => void;
  maxValue?: number;
}

export const ItemCounter: FC<Props> = ({ curretValue, maxValue = 5, updateQuantity }) => {
  const handleValue = (operation: 'plus' | 'remove') => {
    if (operation === 'plus') {
      let value = curretValue + 1;
      updateQuantity(value)
    } else {
      let value = curretValue - 1;
      updateQuantity(value)
    }
  }

  return (
    <Box display='flex' alignItems='center'>
      <IconButton
        onClick={() => handleValue('remove')}
        disabled={1 === curretValue}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{width: 40, textAlign: 'center'}}> { curretValue } </Typography>
      <IconButton
        onClick={() => handleValue('plus')}
        disabled={maxValue === curretValue}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
