'use client'

import { removeFromCart, updateQuantity, CartItem } from "@/lib/store/features/cartSlice";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { Card } from "@/components/ui/card";
import { Loader2, Minus, Plus } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useState } from "react";

export default function CartPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartItems = useAppSelector(state => state.cart.cart.items);
  const dispatch = useAppDispatch();
  const { data: session } = useSession()
  const user: User = session?.user as User

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );

  const handleCheckout = async (userId: string, cartItems: CartItem[], totalAmount: number) => {
    try {
      setIsSubmitting(true);
      const payload = {
        userId,
        orderItems: cartItems,
        totalAmount,
      };

      const res = await axios.post("/api/create-order", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Order placed successfully"); 

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      toast.error(errorMessage ? errorMessage : 'Server Error: Something went wrong while placing the order.')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (

              <Card className="h-44 p-2">
                <div className="flex gap-4">
                  <div className="w-38 h-38 overflow-hidden rounded-md">
                    <img src={item.image} alt="Product Image" />
                  </div>

                  <div className="w-[60%]">
                    <h3 className="font-bold lg:text-xl">{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="flex flex-col gap-3  w-[25%]">
                    <div className="flex flex-col">
                      <div>MRP:
                        <span className=" text-muted-foreground">
                          {` ${item.MRP} /-`}
                        </span>
                      </div>
                      <div>Discount:
                        <span className="text-muted-foreground">
                          {` ${item.discount} %`}
                        </span>
                      </div>
                      <div className="flex items-baseline space-x-1.5"> Price:
                        <span className="text-sm md:text-lg font-semibold">
                          {`${item.discountPrice}`}
                        </span>
                        <span className="text-md md:text-xs text-muted-foreground mr-2">
                          /- Per {item.unit}
                        </span>
                      </div>
                      <div>Amount:
                        <span className="text-muted-foreground">
                          {` ${item.discountPrice * item.quantity} /-`}
                        </span>
                      </div>
                    </div>
                    <div className="space-x-3 flex items-center">
                      <Button
                        variant="destructive"
                        onClick={() => dispatch(removeFromCart(item.id))}
                      >
                        Remove
                      </Button>
                      <div className="flex flex-col gap-4">
                        <ButtonGroup>
                          <Button
                            onClick={() => dispatch(updateQuantity({ productId: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                            variant="outline"
                          >
                            <Minus />
                          </Button>
                          <Input
                            type="text"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d{0,6}$/.test(value)) {
                                dispatch(updateQuantity({ productId: item.id, quantity: value === "" ? 0 : Number(value) }));
                              }
                            }}
                            className="w-20 bg-background text-center"
                          />
                          <Button onClick={() => dispatch(updateQuantity({ productId: item.id, quantity: item.quantity + 1 }))} variant="outline">
                            <Plus />
                          </Button>
                        </ButtonGroup>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-right mt-4 font-semibold">
            Total Amount: {totalAmount} /-
          </div>

          <Button className="w-full mt-4" onClick={() => handleCheckout(user._id, cartItems, totalAmount)}>
            {
              isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : ('Proceed to Checkout')
            }
          </Button>
        </>
      )}
    </div>
  );
};

