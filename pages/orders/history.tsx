import { useEffect, useState } from 'react';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react';
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from 'next/link'

import { ShopLayout } from '../../comoponents/layouts';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muesta información si está pagada la orden o no',
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return (
        params.row.paid
          ? <Chip color='success' label='Pagada' variant='outlined' />
          : <Chip color='error' label='No pagada' variant='outlined' />
      )
    }
  },
  {
    field: 'orden',
    headerName: 'Ver Orden',
    description: 'Muesta información general de la orden',
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
          <Link underline='always'>
            <Typography>Ver orden</Typography>
          </Link>
        </NextLink>
      )
    }
  }
];

// const rows = [
//   { id: 1, paid: true, fullname: 'Camilo Davila', orden: true },
//   { id: 2, paid: false, fullname: 'Fernando Herrera', orden: true },
//   { id: 3, paid: true, fullname: 'Moni Paraa', orden: true },
//   { id: 4, paid: false, fullname: 'Maira Alejandra', orden: true },
//   { id: 5, paid: false, fullname: 'Isabel Bonilla', orden: true },
//   { id: 6, paid: true, fullname: 'Hernando Davila', orden: true },
// ]

interface Props {
  orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

  const [rows, setRows] = useState<any>([]);

  useEffect(() => {
    setRows(
      orders.map(({ _id, shippingAddress, isPaid }, index) => ({ id: index + 1, paid: isPaid, fullname: `${shippingAddress.firstName} ${shippingAddress.lastName}`, orderId: _id }))
    )
  }, [orders])
  

  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordones del cliente'>
      <>
        <Typography variant='h1' component='h1'>Historia de ordenes</Typography>

        <Grid container className='fadeIn'>
          <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </Grid>
        </Grid>
      </>
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req })

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/history`,
        permanent: false
      }
    }
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage