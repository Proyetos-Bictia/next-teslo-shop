import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link'
import { Box, Button, Card, CardContent, Divider, Grid, Typography, Link, Chip } from "@mui/material";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { CartList, OrdenSummary } from "../../comoponents/cart";
import { ShopLayout } from "../../comoponents/layouts";
import { CartContext } from '../../context';
import { countries } from '../../utils/countries';

const SummaryPage = () => {
  const { shippingAddress, cart, createOrder } = useContext(CartContext);
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!Cookies.get('firstName')) {
      router.replace('/checkout/address')
    }
  }, [router])

  const onCreateOrder = async () => {
    setIsPosting(true);

    const { hasError, message } = await createOrder();
    console.log({hasError,  message});

    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }
    router.replace(`/orders/${message}`);
  }

  return (
    <ShopLayout title='Resumen de orden' pageDescription="Resumen de la orden">
      <>
        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

        <Grid container>
          <Grid item xs={12} sm={7}>
            <CartList
              editable={false}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant='h2'>Resumen ({cart.length} productos)</Typography>

                <Divider sx={{ my: 1 }} />

                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='subtitle1'>Dirección de entrega</Typography>
                  <NextLink href='/checkout/address' passHref>
                    <Link underline='always'>
                      Editar
                    </Link>
                  </NextLink>
                </Box>

                <Typography>{shippingAddress?.firstName} {shippingAddress?.lastName}</Typography>
                <Typography>{shippingAddress?.address}</Typography>
                <Typography>{shippingAddress?.city}, {shippingAddress?.zip}</Typography>
                <Typography>{countries.find((country) => country.code === shippingAddress?.country)?.name}</Typography>
                <Typography>+57 {shippingAddress?.phone}</Typography>

                <Divider sx={{ my: 1 }} />

                <Box display='flex' justifyContent='end'>
                  <NextLink href='/cart' passHref>
                    <Link underline='always'>
                      Editar
                    </Link>
                  </NextLink>
                </Box>

                <OrdenSummary />

                <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                  <Button
                    color='secondary'
                    className="circular-btn"
                    fullWidth
                    onClick={onCreateOrder}
                    disabled={isPosting}
                  >
                    Confirmar Orden
                  </Button>

                  <Chip
                    color='error'
                    label={errorMessage}
                    sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
                  />
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