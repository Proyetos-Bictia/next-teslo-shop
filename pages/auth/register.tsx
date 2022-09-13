import { useContext, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { getSession, signIn } from 'next-auth/react';

import { AuthContext } from '../../context';
import { tesloApi } from '../../api';

import { AuthLayout } from '../../comoponents/layouts';
import { valdiations } from '../../utils';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const { registerUser } = useContext(AuthContext);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onRegisterUser = async ({ email, password, name }: FormData) => {
    setShowError(false);
    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(message!)
      setTimeout(() => {
        setShowError(false)
      }, 3000);
      return;
    }

    await signIn('credentials', { email, password, redirect: false } );
    // TODO Navegar a la pantalla en la que el usuario estaba
    const destination = router.query.p?.toString() || '/'
    router.replace(destination);
  }

  return (
    <AuthLayout title='Crear cuenta'>
      <Box sx={{ width: 350, padding: '10px 20px' }}>
        <form onSubmit={handleSubmit(onRegisterUser)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
              <Chip
                label={errorMessage || ''}
                color='error'
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Nombre'
                variant='filled'
                fullWidth
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: { value: 4, message: 'Minimo de 4 caracteres' },
                  maxLength: { value: 12, message: 'Maximo de 12 caracteres' }
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label='Correo'
                variant='filled'
                fullWidth
                type='email'
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
              <Button
                color='secondary'
                className='circular-btn'
                size='large'
                fullWidth
                type='submit'
              >
                Crear
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href='/auth/login' passHref>
                <Link underline='always'>
                  ¿Ya tienes cuenta?
                </Link>
              </NextLink>
            </Grid>

          </Grid>
        </form>
      </Box>
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

export default RegisterPage