import NextLink from 'next/link'
import { Box, Button, Card, CardContent, Divider, Grid, Typography, Link } from "@mui/material";

import { CartList, OrdenSummary } from "../../comoponents/cart";
import { ShopLayout } from "../../comoponents/layouts";

const SummaryPage = () => {
  return (
    <ShopLayout title='Resumen de orden' pageDescription="Resumen de la orden">
      <>
        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

        <Grid container>
          <Grid item xs={12} sm={7}>
            <CartList />
          </Grid>

          <Grid item xs={12} sm={5}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant='h2'>Resumen (3 productos)</Typography>

                <Divider sx={{ my: 1 }} />

                <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                  <NextLink href='/checkout/address' passHref>
                    <Link underline='always'>
                      Editar
                    </Link>
                  </NextLink>
                </Box>

                <Typography>Camilo Davila</Typography>
                <Typography>323 Algun lugar</Typography>
                <Typography>CAlle 45a, Tunja</Typography>
                <Typography>Colombia</Typography>
                <Typography>+57 3214314628</Typography>

                <Divider sx={{ my: 1 }} />

                <Box display='flex' justifyContent='end'>
                  <NextLink href='/cart' passHref>
                    <Link underline='always'>
                      Editar
                    </Link>
                  </NextLink>
                </Box>

                <OrdenSummary />


                <Box sx={{ mt: 3 }}>
                  <Button color='secondary' className="circular-btn" fullWidth>
                    Confirmar Orden
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    </ShopLayout>
  )
}

export default SummaryPage;