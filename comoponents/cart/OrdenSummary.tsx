import { useContext } from "react";
import { NextPage } from "next";
import { Grid, Typography } from "@mui/material";

import { CartContext } from "../../context";
import { currency } from "../../utils";

interface Props {
  orderValues?: {
    numberOfItems: number; 
    subTotal: number;
    total: number;
    tax: number;
  }
}

export const OrdenSummary: NextPage<Props> = ({ orderValues }) => {
  const { numberOfItems, subTotal, total, tax } = useContext(CartContext);

  const summaryValues = orderValues ? orderValues : { numberOfItems, subTotal, total, tax };


  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{summaryValues.numberOfItems} producto{summaryValues.numberOfItems > 0 && 's'}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{currency.format(summaryValues.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{currency.format(summaryValues.tax)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{mt:2}}>
        <Typography variant="subtitle1">Total</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography variant="subtitle1">{currency.format(summaryValues.total)}</Typography>
      </Grid>
    </Grid>
  )
}
