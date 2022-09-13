import { FC, useContext } from 'react';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"
import NextLink from 'next/link'

import { CartContext } from '../../context';
import { ItemCounter } from '../ui'
import { ICartProduct, IOrderItem } from '../../interfaces';

interface Props {
  editable?: boolean;
  products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { updateCartQuantity, removeCartProduct, cart } = useContext(CartContext);

  const updateQuantity = (product: ICartProduct, newQuantity: number) => {
    product.quantity = newQuantity;
    updateCartQuantity(product);
  }

  const deleteItem = (product: ICartProduct) => {
    removeCartProduct(product)
  }

  const productsToShow = products ? products : cart

  return (
    <>
      {
        productsToShow.map(product => (
          <Grid container spacing={2} sx={{ mb: 1 }} key={product.slug + product.size}>
            <Grid item xs={3}>
              {/* Llevar a la pagina del producto */}
              <NextLink href={`/product/${product.slug}`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={product.images}
                      component='img'
                      sx={{ borderRadius: '5px' }}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={7}>
              <Box display='flex' flexDirection='column'>
                <Typography variant='body1'>{product.title}</Typography>
                <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                {
                  editable
                    ? <ItemCounter
                      curretValue={product.quantity}
                      updateQuantity={(e) => updateQuantity(product as ICartProduct, e)}
                      maxValue={5}
                    />
                    : (
                      <Typography variant='h5'>{product.quantity} producto{product.quantity > 1 && 's'}</Typography>
                    )
                }
              </Box>
            </Grid>

            <Grid
              item
              xs={2}
              display='flex'
              alignItems='center'
              flexDirection='column'
            >
              <Typography variant='subtitle1'>{`$${product.price}`}</Typography>
              {
                editable && (
                  <Button variant='text' color='secondary' onClick={() => deleteItem(product as ICartProduct)}>
                    Remover
                  </Button>
                )
              }
            </Grid>
          </Grid>
        ))
      }
    </>
  )
}
