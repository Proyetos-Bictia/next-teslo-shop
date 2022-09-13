import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../comoponents/layouts';
import { FullScreenLoading } from '../comoponents/ui';

import { ProductList } from '../comoponents/products';
import { usePorducts } from '../hooks';


const HomePage: NextPage = () => {

  const { products, isloading } = usePorducts('/products')

  return (
    <ShopLayout
      title='Teslo-Shop - Home'
      pageDescription={'Encuentra los mejores productos de Teslo aquí'}
    >
      <>
        <Typography variant='h1' component={'h1'}>Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }} >Todos los productos</Typography>
        {
          isloading
            ? <FullScreenLoading />
            : <ProductList products={products} />
        }
      </>
    </ShopLayout>
  )
}

export default HomePage
