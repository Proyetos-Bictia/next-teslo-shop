import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { db } from '../../../database'
import { User } from '../../../model'
import { jwt, valdiations } from '../../../utils';

type Data =
  | { message: string; }
  | {
    token: string;
    user: {
      email: string;
      role: string;
      name: string;
    }
  }
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'POST':
      return registerUser(req, res)

    default:
      res.status(400).json({
        message: 'Bad request'
      })
  }
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = '', password = '', name = '' } = req.body as { email: string; password: string; name: string };
  
  if (password.length < 6) {
    return res.status(400).json({
      message: 'La contraseña debe ser de 6 caracteres'
    })
  }
  
  if (password.length < 2) {
    return res.status(400).json({
      message: 'El nombre debe tener 2 caracteres'
    })
  }

  await db.connect();
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: 'No puede usar ese correo'
    })
  }

  if(!valdiations.isValidEmail(email)) {
    return res.status(400).json({
      message: 'El correo no tiene formato valido'
    })
  }

  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
    name
  });

  try {
    await newUser.save({validateBeforeSave: true})
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Revisar logs del servidor'
    })
  }


  const { _id } = newUser;

  const token = jwt.signToken(_id, email);

  res.status(200).json({
    token,
    user: {
      email,
      role: 'client',
      name
    }
  })
}
