
import NextLink from 'next/link';
import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Link, Typography } from "@mui/material";
import { ShopLayout } from "../../comoponents/layouts";

const EmptyPage = () => {
  return (
    <ShopLayout title='Carrito vacio' pageDescription='No hay atículos en el carrito de compras'>
      <Box
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='calc(100vh - 200px)'
      >
        <RemoveShoppingCartOutlined sx={{fontSize: 100}} />
        <Box display='felx' flexDirection='column' alignItems='center'>
          <Typography>Su carrito esta vació</Typography>
          <NextLink href='/' passHref>
            <Link typography='h4' color='secondary'>
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  )
}

export default EmptyPage