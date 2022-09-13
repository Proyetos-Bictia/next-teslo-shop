import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import { GetServerSideProps } from 'next'
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import { AuthLayout } from '../../comoponents/layouts';
import { valdiations } from '../../utils';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  // const { loginUser } = useContext(AuthContext);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then((prov) => {
      console.log(prov);
      setProviders(prov)
    })
  }, [])
  

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);
    await signIn('credentials', { email, password, redirect: false } );
    // const isValidLogin = await loginUser(email, password);

    // if (!isValidLogin) {
    //   setShowError(true)
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    //   console.log('error en las credenciales');
    //   return;
    // }

    const destination = router.query.p?.toString() || '/';
    console.log(destination);
    
    router.replace(destination);
  }

  return (
    <AuthLayout title='Ingresar'>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
              <Chip
                label="No se reonocoe ese usuario"
                color='error'
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type='email'
                label='Correo'
                variant='filled'
                fullWidth
                {
                ...register('email', {
                  required: 'Este campo es requerido',
                  validate: valdiations.isEmail
                })
                }
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Contraseña'
                type='password'
                variant='filled'
                fullWidth
                {
                ...register('password', {
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'minimo 6 caracteres' }
                })
                }
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button color='secondary' className='circular-btn' size='large' fullWidth type='submit'>
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={`/auth/register${router.query.p && `?p=${router.query.p}`}`} passHref>
                <Link underline='always'>
                  ¿No tienes cuenta?
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={12} display='flex' flexDirection={'column'} justifyContent='end'>
              <Divider sx={{ width: '100%', mb: 2 }} />

              {
                Object.values(providers).map((provider: any) => {

                  if(provider.id === 'credentials') return (<div key='credentials' ></div>)

                  return (
                    <Button
                      key={provider.id}
                      variant='outlined'
                      fullWidth
                      color='primary'
                      sx={{mb: 1}}
                      onClick={() => signIn(provider.id)}
                    >
                      {provider.name}
                    </Button>
                  )
                })
              }
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req }) // your fetch function here 
  const { p = '/' } = query

  if(session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export default LoginPage