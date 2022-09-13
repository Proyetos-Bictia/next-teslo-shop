import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';

import { IOrder, IProduct } from '../../../interfaces';
import { Order, Product } from '../../../model';

type Data =
  | { message: string }
  | IOrder

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

  switch (req.method) {
    case 'POST':
      return createOrder(req, res);

    default:
      return res.status(400).json({
        message: 'Bad request'
      })
  }
}
const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  //Verificar que se tenga un usuario
  const session: any = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' })
  }

  // Crear un arreglo con los podructos que la pesona quiere;

  const productsIds = orderItems.map(product => product._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price;
      if (!currentPrice) {
        throw new Error('Verifique el carrito de nuevo, producto no existe')
      }

      return (current.quantity * currentPrice) + prev
    }, 0);

    const taxtRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backenTotal = subTotal * (taxtRate + 1);

    if (total !== backenTotal) {
      throw new Error("El total no cuadra con el monto");
    }

    //SI todo esta bien
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, user: userId, isPaid: false });
    newOrder.total = Math.round(newOrder.total * 100) / 100;
    await newOrder.save();


    await db.disconnect();
    return res.status(201).json(newOrder)

  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
      message: error.message || 'Revise logs del servidor'
    })
  }
}

