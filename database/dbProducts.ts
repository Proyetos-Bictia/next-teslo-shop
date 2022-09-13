import { db } from "."
import { IProduct } from "../interfaces";
import { Product } from "../model";

export const getProductsBySlug = async (slug: string): Promise<IProduct | null> => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  if (!product) {
    return null;
  }

  //TODO
  //Procesamiento cuando se suba al server;
  product.images = product.images.map(image => {
    return image.includes('http') ? image : `${process.env.HOSTNAME}products/${image}`
  })

  return JSON.parse(JSON.stringify(product));
}

interface ProductSlug {
  slug: string
}
export const getAllProductSlug = async (): Promise<ProductSlug[]> => {
  await db.connect();
  const slugs = await Product.find().select('slug -_id').lean();
  await db.disconnect();

  return slugs
}

export const getProductsByTerm = async (term: string): Promise<IProduct[] | null> => {
  term = term.toString().toLowerCase();
  await db.connect();
  const products = await Product.find({
    $text: { $search: term }
  })
    .select('title images price inStock slug -_id')
    .lean();
  await db.disconnect();
  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('http') ? image : `${process.env.HOSTNAME}products/${image}`
    });
    return product;
  });

  return JSON.parse(JSON.stringify(updatedProducts));
}

export const getAllProducts = async(): Promise<IProduct[]> => {
  await db.connect();
  const products = await Product.find()
    .select('title images price inStock slug -_id')
    .lean();
  await db.disconnect();

  const updatedProducts = products.map(product => {
    product.images = product.images.map(image => {
      return image.includes('http') ? image : `${process.env.HOSTNAME}products/${image}`
    });
    return product;
  });

  return JSON.parse(JSON.stringify(updatedProducts));
}