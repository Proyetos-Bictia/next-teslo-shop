import { Box, Button } from "@mui/material";
import { FC } from "react";
import { ISize } from "../../interfaces";

interface Props {
  selectedSize: ISize;
  sizes: ISize[];
}

export const SizeSelector: FC<Props> = ({ sizes, selectedSize }) => {
  return (
    <Box>
      {
        sizes.map(size => (
          <Button
            key={size}
            size='small'
            color={selectedSize === size ? 'primary' : 'info'}
          >
            {size}
          </Button>
        ))
      }
    </Box>
  )
}
