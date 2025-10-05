import { connectDB } from "@/lib/connectDB";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function POST(request:Request, { params }: { params: {productId: string}}) {
    await connectDB()

    const messageId = await params.productId 
    try {
       const session = await getServerSession(authOptions)
        const user: User | undefined = session?.user as User | undefined

        if (!user || user.role !== 'admin') {
            return Response.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 401 })
        }

        
    } catch (error) {
        
    }
}