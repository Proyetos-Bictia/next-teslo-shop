import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link'
import { Box, Card, CardContent, Divider, Grid, Typography, Link, Chip, CircularProgress } from "@mui/material";
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';


import { CartList, OrdenSummary } from '../../../comoponents/cart';
import { AdminLayout } from '../../../comoponents/layouts';
import { IOrder } from '../../../interfaces';
import { dbOrders } from '../../../database';
import { tesloApi } from '../../../api';

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
  const { shippingAddress } = order;

  return (
    <AdminLayout 
      title={`Resumen de la orden ${order._id}`} 
      subtitle="Resumen de la orden"
      icon={<AirplaneTicketOutlined />}
    >
      <>

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

                  <Box
                    flexDirection='column'
                    sx={{ display: 'flex', flex: 1 }}
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
                          <Chip
                            sx={{ my: 2 }}
                            label='Pendiente de pago'
                            variant='outlined'
                            color='error'
                            icon={<CreditScoreOutlined />}
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
    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
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