import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection:ConnectionObject = {}

export async function connectDB():Promise<void> {
    if (connection.isConnected) {
        console.log("Already Connected to DataBase")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')

        connection.isConnected = db.connections[0].readyState

        console.log("DataBase Connect Successfully")

    } catch (error) {
        console.log("Database Connection Failed ", error)
        process.exit(1)
    }
}