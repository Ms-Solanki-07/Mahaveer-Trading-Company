import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/User.model";
import ShopModel from "@/models/Shop.model";
import OrderModel from "@/models/Order.model";
import OrderItemModel from "@/models/OrderItem.model";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF"; 
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, orderItems, totalAmount } = await req.json(); 

    if (!userId) {
      return Response.json({
        success: false,
        message: "userId is required"
      }, { status: 400 })
    }

    if (!orderItems || orderItems.length === 0) {
      return Response.json({
        success: false,
        message: "No items in the order"
      }, { status: 400 })
    }

    const user = await UserModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } }, 
      {
        $project: { 
          _id: 0,
          fullname: 1,
          email: 1,
          phone: 1,
          role: 1,
          isVerified: 1,  
          shopId: 1,
        }
      }
    ]);

    if (user.length === 0) {
      return Response.json({
        success: false,
        message: "User not found"
      }, { status: 404 })
    }

    const shop = await ShopModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(user[0].shopId) } },
      {
        $project: {
          _id: 0,
          shopName: 1,
          GSTIN: 1,
          address: 1,
          city: 1,
          state: 1,
          pinCode: 1,
        }
      }
    ]);

    if (shop.length === 0) {
      return Response.json({
        success: false,
        message: "Shop details not found for the user"
      }, { status: 404 })
    }

    // Create order
    const order = await OrderModel.create({
      userId,
      totalAmount,
      orderDate: new Date(),
    });

    if(!order) {
      return Response.json({
        success: false,
        message: "Failed to create order"
      }, { status: 500 })
    }

    const orderDetails = {
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
    } 

    // Create all order items
    const orderItemsData = orderItems.map((item: any) => ({
      orderId: order._id,
      productId: item.id,
      quantity: item.quantity,
      price: item.discountPrice ?? item.MRP,
    }));

    await OrderItemModel.insertMany(orderItemsData);

    const items = await OrderItemModel.aggregate([
      { $match: { orderId: order._id } },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          quantity: 1,
          price: 1,
          product: {
            name: 1,
            MRP: 1,
            discount: 1,
            unit: 1,
          }
        }
      }
    ]);

    console.log("User Details:", user);
    console.log("Shop Details:", shop); 
    console.log("Order Items:", items); 


    const invoicePath = await generateInvoicePDF({
      user: user[0],
      shop: shop[0],
      items,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      orderId: order._id as string,
    });

    return Response.json({
      success: true,
      message: "Order placed successfully", 
      invoicePath: invoicePath,
    });

  } catch (err: any) {
    console.error("Order Error:", err);
    return Response.json({
      success: false,
      message: err.message || "Internal Server Error"
    }, { status: 500 })
  }
}
