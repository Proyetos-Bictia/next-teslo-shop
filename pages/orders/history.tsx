import { Chip, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link'
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { ShopLayout } from '../../comoponents/layouts';


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
          ? <Chip color='success' label='Pagada' variant='outlined'  />
          : <Chip color='error' label='No pagada' variant='outlined'  />
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
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline='always'>
            <Typography>Ver orden</Typography>
          </Link>
        </NextLink>
      )
    }
  }
];

const rows = [
  { id: 1, paid: true ,fullname: 'Camilo Davila', orden: true },
  { id: 2, paid: false ,fullname: 'Fernando Herrera', orden: true },
  { id: 3, paid: true ,fullname: 'Moni Paraa', orden: true },
  { id: 4, paid: false ,fullname: 'Maira Alejandra', orden: true },
  { id: 5, paid: false ,fullname: 'Isabel Bonilla', orden: true },
  { id: 6, paid: true ,fullname: 'Hernando Davila', orden: true },
]

const HistoryPage = () => {
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordones del cliente'>
      <>
        <Typography variant='h1' component='h1'>Historia de ordenes</Typography>

        <Grid container>
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

export default HistoryPage