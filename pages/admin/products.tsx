import { Box, Button, CardMedia, Chip, Grid, Link } from '@mui/material'
import { AddOutlined, CategoryOutlined, ConfirmationNumberOutlined } from '@mui/icons-material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import useSWR from 'swr'
import NextLink from 'next/link'

import { IProduct } from '../../interfaces'
import { AdminLayout } from '../../comoponents/layouts'

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Foto',
    renderCell: (({ row }: GridValueGetterParams) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
          <CardMedia
            component='img'
            className='fadeIn'
            image={row.img}
          />
        </a>
      )
    })
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 250,
    renderCell: (({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`}>
          <Link underline='always'>
            {row.title}
          </Link>
        </NextLink>
      )
    })
  },
  { field: 'gender', headerName: 'Genero' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'GenerInventario' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas', width: 250 },

  // { field: 'createdAt', headerName: 'Creada en:', align: 'center', width: 300 }
]

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) return (<></>);
  if (error) return (<>Error mirar consola</>);

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
    slug: product.slug
  }))

  return (
    <AdminLayout
      title='Productos'
      subtitle='Mantenimiento de productos'
      icon={<CategoryOutlined />}
    >
      <>
        <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
          <Button
            startIcon={<AddOutlined />}
            color="secondary"
            href='/admin/products/new'
          >
            Crear producto
          </Button>
        </Box>
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
    </AdminLayout>
  )
}

export default ProductsPage