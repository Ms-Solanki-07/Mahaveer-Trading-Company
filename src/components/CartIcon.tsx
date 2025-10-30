'use client';
import { useAppSelector } from '@/lib/store/hooks';
import { ShoppingBasket, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const CartIcon = () => {
    const items = useAppSelector((state) => state.cart.cart.items);

    return (
        <div className="relative m-auto">
            <Link href="/cart">
                <ShoppingCart className="hover:text-primary" />
            </Link>
            {items.length > 0 &&
                (<span className="absolute -top-2 lg:-top-3 lg:-right-3 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 font-bold text-white text-sm">
                    {items.length}
                </span>)
            }
        </div>
    );
};

export default CartIcon;