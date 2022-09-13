import { FC, useEffect, useReducer } from "react";
import Cookie from 'js-cookie'
import axios from "axios";

import { ICartProduct, IOrder, ShippingAddress } from "../../interfaces";
import { CartContext, cartReducer } from "./";
import { tesloApi } from "../../api";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined
}

interface Props {
  children: JSX.Element;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
      dispatch({ type: '[CART] - loadcart from cookies | storage', payload: cookieProducts })
    } catch (error) {
      dispatch({ type: '[CART] - loadcart from cookies | storage', payload: [] })
    }
  }, [])

  useEffect(() => {
    if (Cookie.get('firstName')) return;
    try {
      const firstName = Cookie.get('firstName') || ''
      const lastName = Cookie.get('lastName') || ''
      const address = Cookie.get('address') || ''
      const address2 = Cookie.get('address2') || ''
      const zip = Cookie.get('zip') || ''
      const city = Cookie.get('city') || ''
      const country = Cookie.get('country') || ''
      const phone = Cookie.get('phone') || ''

      dispatch({
        type: '[CART] - Load Address from Cookies', payload: {
          firstName,
          lastName,
          address,
          address2,
          zip,
          city,
          country,
          phone
        }
      })
    } catch (error) {
      dispatch({
        type: '[CART] - Load Address from Cookies', payload: {
          firstName: '',
          lastName: '',
          address: '',
          address2: '',
          zip: '',
          city: '',
          country: '',
          phone: ''
        }
      })
    }
  }, [])


  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart))
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
    const subTotal = state.cart.reduce((prev, current) => (current.quantity * current.price) + prev, 0);
    const taxtRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxtRate,
      total: subTotal * (taxtRate + 1)
    }
    dispatch({ type: '[CART] - Update order summary', payload: orderSummary })
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some(p => p._id === product._id);
    if (!productInCart) return dispatch({ type: '[CART] - Update products in cart', payload: [...state.cart, product] });

    const productInCartButDifferentSize = state.cart.some(p => p._id === product._id && p.size === product.size);
    if (!productInCartButDifferentSize) return dispatch({ type: '[CART] - Update products in cart', payload: [...state.cart, product] });

    const updatedProducts = state.cart.map(p => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      //Actualizar la cantidad
      p.quantity += product.quantity
      return p
    });
    dispatch({ type: '[CART] - Update products in cart', payload: updatedProducts })
  }

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: '[CART] - Change cart quantity', payload: product })
  }

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: '[CART] - Remove roduct in cart', payload: product })
  }

  const updateAddress = (address: ShippingAddress) => {
    Cookie.set('firstName', address.firstName)
    Cookie.set('lastName', address.lastName)
    Cookie.set('address', address.address)
    Cookie.set('address2', address.address2 || '')
    Cookie.set('zip', address.zip)
    Cookie.set('city', address.city)
    Cookie.set('country', address.country)
    Cookie.set('phone', address.phone)
    dispatch({ type: '[CART] - Update Address from Cookies', payload: address })
  }

  const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {
    if (!state.shippingAddress) {
      throw new Error("No hay dirección de entrega");
    }

    const body: IOrder = {
      orderItems: state.cart.map(p => ({
        ...p,
        size: p.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false
    }

    try {
      const { data } = await tesloApi.post('/orders', body);
      // TODO: dispatch de limpiar state
      dispatch({type: '[CART] - Order complete'});
      return {
        hasError: false,
        message: data._id
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response?.data as { message: string }
        return {
          hasError: true,
          message
        }
      }
      return {
        hasError: true,
        message: 'Error no controlado hable con el admin'
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,

        //Methos
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        createOrder
      }}
    >
      {children}
    </CartContext.Provider>
  )
}