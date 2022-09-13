import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { db } from '../../../database'
import { User } from '../../../model'
import { jwt } from '../../../utils';
import { RestartAlt } from '@mui/icons-material';

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
    case 'GET':
      return checkJWT(req, res)

    default:
      res.status(400).json({
        message: 'Bad request'
      })
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = '' } = req.cookies;
  await db.connect();

  let userId = ''

  try {
    userId = await jwt.isValidToken(token);
  } catch (error) {
    return res.status(401).json({
      message: 'Token no es valido'
    })
  }

  await db.connect();
  const user = await User.findById(userId).lean();
  await db.disconnect();

  if(!user) {
    return res.status(401).json({
      message: 'Usuario no existe'
    })
  }

  const { _id, email, role, name } = user;

  res.status(200).json({
    token: jwt.signToken(_id, email),
    user: {
      email,
      role,
      name
    }
  })

}
