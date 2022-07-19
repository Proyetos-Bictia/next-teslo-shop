import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../../comoponents/layouts';
import { FullScreenLoading } from '../../comoponents/ui';

import { ProductList } from '../../comoponents/products';
import { usePorducts } from '../../hooks';



const WomenPage: NextPage = () => {

  const { products, isloading } = usePorducts('/products?gender=women');

  return (
    <ShopLayout
      title='Teslo-Shop - Kids'
      pageDescription={'Encuentra los mejores productos de Teslo para niños'}
    >
      <>
        <Typography variant='h1' component={'h1'}>Niños</Typography>
        <Typography variant='h2' sx={{ mb: 1 }} >Productos para niños</Typography>
        {
          isloading
            ? <FullScreenLoading />
            : <ProductList products={products} />
        }
      </>
    </ShopLayout>
  )
}

export default WomenPage
