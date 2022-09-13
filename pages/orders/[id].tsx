import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link'
import { getSession } from 'next-auth/react';
import { Box, Card, CardContent, Divider, Grid, Typography, Link, Chip, CircularProgress } from "@mui/material";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';


import { CartList, OrdenSummary } from '../../comoponents/cart';
import { ShopLayout } from '../../comoponents/layouts';
import { IOrder } from '../../interfaces';
import { dbOrders } from '../../database';
import { tesloApi } from '../../api';
import { useState } from 'react';

export type OrderResponseBody = {
  id: string;
  status:
  | 'COMPLETED'
  | 'SAVED'
  | 'APPROVED'
  | 'VOIDED'
  | 'PAYER_ACTION_REQUIRED'
}
interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter()
  const [isPaying, setIsPaying] = useState(false);
  const { shippingAddress } = order;

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('No hay pago en PayPal')
    }
    setIsPaying(true);
    try {
      const { data } = await tesloApi.post('/orders/pay', {
        transactionId: details.id,
        orderId: order._id
      });
      router.reload();
    } catch (error) {
      console.log(error);
      setIsPaying(false);
      alert('Error')
    }
  }

  return (
    <ShopLayout title='Resumen de la orden 12334' pageDescription="Resumen de la orden">
      <>
        <Typography variant='h1' component='h1'>Orden: {order._id}</Typography>

        {
          order.isPaid ? (
            <Chip
              sx={{ my: 2 }}
              label='Orden ya fue pagada'
              variant='outlined'
              color='success'
              icon={<CreditScoreOutlined />}
            />
          ) : (
            <Chip
              sx={{ my: 2 }}
              label='Pendiente de pago'
              variant='outlined'
              color='error'
              icon={<CreditCardOffOutlined />}
            />
          )
        }


        <Grid container>
          <Grid item xs={12} sm={7}>
            <CartList
              editable={false}
              products={order.orderItems}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant='h2'>Resumen ({order.numberOfItems} productos)</Typography>

                <Divider sx={{ my: 1 }} />

                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='subtitle1'>Dirección de entrega</Typography>
                  <NextLink href='/checkout/address' passHref>
                    <Link underline='always'>
                      Editar
                    </Link>
                  </NextLink>
                </Box>

                <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                <Typography>{shippingAddress.address} {shippingAddress.address2 && `, ${shippingAddress.address2}`}</Typography>
                <Typography>{shippingAddress.city}</Typography>
                <Typography>{shippingAddress.country}</Typography>
                <Typography>+57 {shippingAddress.phone}</Typography>

                <Divider sx={{ my: 1 }} />

                <Box display='flex' justifyContent='end'>
                  <NextLink href='/cart' passHref>
                    <Link underline='always'>
                      Editar
                    </Link>
                  </NextLink>
                </Box>

                <OrdenSummary
                  orderValues={{
                    numberOfItems: order.numberOfItems,
                    subTotal: order.subTotal,
                    total: order.total,
                    tax: order.tax,
                  }

                  }
                />

                <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                  {
                    <Box
                      display='flex'
                      justifyContent='center'
                      sx={{ display: isPaying ? 'flex' : 'none' }}
                    >
                      <CircularProgress />
                    </Box>
                  }

                  <Box
                    flexDirection='column'
                    sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }}
                  >
                    {
                      order.isPaid
                        ? (
                          <Chip
                            sx={{ my: 2 }}
                            label='Orden ya fue pagada'
                            variant='outlined'
                            color='success'
                            icon={<CreditScoreOutlined />}
                          />
                        ) : (
                          <PayPalButtons
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {

                                    amount: {
                                      value: `${order.total}`,
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={(data, actions) => {
                              return actions.order!.capture().then((details) => {
                                onOrderCompleted(details)
                                // console.log({ details });

                                // const name = details.payer.name!.given_name;
                              });
                            }}
                          />
                        )
                    }
                  </Box>


                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false
      }
    }
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/order/history`,
        permanent: false
      }
    }
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/order/history`,
        permanent: false
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage;