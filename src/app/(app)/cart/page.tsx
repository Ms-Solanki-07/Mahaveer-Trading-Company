'use client'
 
import { removeFromCart, updateQuantity, clearCart } from "@/lib/store/features/cartSlice";
import { Button } from "@/components/ui/button";

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'; 

export default function CartPage() { 

  const cartItems = useAppSelector(state => state.cart.cart.items);
  const dispatch = useAppDispatch();

  console.log(cartItems);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  ); 

  const handleCheckout = async () => {
    // const res = await fetch("/api/orders", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     userId: "USER_ID_HERE",
    //     items: cartItems.map(({ id, quantity, discountPrice }) => ({
    //       id,
    //       quantity,
    //       discountPrice,
    //     })),
    //   }),
    // });

    // const data = await res.json();
    // if (data.success) {
    //   dispatch(clearCart());
    //   alert("Order placed successfully!");
    // }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1> 

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <h3>{item.name}</h3>
                <p>₹{item.discountPrice}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        productId: item.productId,
                        quantity: Number(e.target.value),
                      })
                    )
                  }
                  min={1}
                  className="w-16 text-center bg-slate-800 text-white"
                />
                <Button
                  variant="destructive"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <div className="text-right mt-4 font-semibold">
            Total: ₹{totalAmount}
          </div>

          <Button className="w-full mt-4" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </>
      )}
    </div>
  );
};
