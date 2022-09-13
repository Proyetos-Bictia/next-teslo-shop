import { useContext, useState } from "react";
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";

import { CartContext } from "../../context";
import { ShopLayout } from "../../comoponents/layouts";
import { ProductSlideshow, SizeSelector } from "../../comoponents/products";
import { ItemCounter } from "../../comoponents/ui";

import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { dbProducts } from "../../database";

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {
  // const { query } = useRouter();

  // const {products: product, isloading} = usePorducts(`/products/${query.slug}`);

  // if (isloading) {
  //   return <h1>Cargando...</h1>
  // }

  // if  (!product) {
  //   return <h1>No esta cargado</h1>
  // }

  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id, 
    images: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 2,
  });

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      size
    }))
  }

  const updateQuantity = (quantity: number) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      quantity
    }))
  }

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;
    addProductToCart(tempCartProduct);
    router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>

            {/* Titulos */}
            <Typography variant="h1" component='h1'>{product.title}</Typography>
            <Typography variant="subtitle1" component='h2'>${product.price}</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter 
                curretValue={tempCartProduct.quantity}
                updateQuantity={updateQuantity}
                maxValue={product.inStock > 5 ? 5 : product.inStock}
              />
              <SizeSelector 
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                onSelectedSize={onSelectedSize}
              />
            </Box>

            {/* Agregar al carrito */}
            {
              product.inStock > 0
                ? (
                  <Button 
                    color='secondary'
                    className='circular-btn'
                    onClick={onAddProduct}
                  >
                    {
                      tempCartProduct.size  
                        ? 'Agregar al carrito'
                        : 'Selecciona una talla'
                    }
                  </Button>
                ) : (
                  <Chip label='No hay disponibles' color='error' variant='outlined' />
                )
            }

            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{product.description}</Typography>

            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// getServerSideProps
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const { slug = '' } = params as { slug: string };
//   const product = await dbProducts.getProductsBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productSlugs = await dbProducts.getAllProductSlug();


  return {
    paths: productSlugs.map(({ slug }) => ({
      params: {
        slug
      }
    })),
    // [  NECESITAMOS DEVOLVER MISMO PARAMS
    //   {
    //     params: {

    //     }
    //   }
    // ],
    fallback: "blocking"
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = '' } = params as { slug: string }
  const product = await dbProducts.getProductsBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  }
}

export default ProductPage;