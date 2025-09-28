import { connectDB } from "@/lib/connectDB";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; 

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await connectDB()

                try {
                    const user = await UserModel.findOne({ email: credentials.email })

                    if (!user) {
                        throw new Error("No user found with this email")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPasswordCorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect Password")
                    }
                } catch (error: any) {
                    console.error('NextAuth authorize error: ', error);
                    throw new Error(error.message)
                }
            }
        })
    ],
    callbacks: { 
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString(),
                token.email = user.email,
                token.isVerified = user.isVerified
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id as string
                session.user.email = token.email
                session.user.isVerified = token.isVerified
            }
            return session
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/sign-in"
    }
}