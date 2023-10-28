import { Database } from '@db/database.types';
import { cartItemSchema } from '@lib/validations/cart';
import z from 'zod';

export type Profiles = Database['public']['Tables']['profiles'];

export type Stores = Database['public']['Tables']['stores'];

export type Products = Database['public']['Tables']['products'];

export type Cart = Omit<Database['public']['Tables']['carts']['Row'], 'items'> & { items: CartItem[] };

export type CartItem = z.infer<typeof cartItemSchema>;
