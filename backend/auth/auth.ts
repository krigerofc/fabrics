import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export class AuthServer {
    private constructor() {}

    static async getSession() {
        const session = await getServerSession(authOptions);
        return session;
    }

    static async Get_UserId() {
        const session = await this.getSession();
        if (!session || !session.user || !session.user.id) return null;
        return session.user.id;
    }

    static async Get_UserName() {
        const session = await this.getSession();
        if (!session || !session.user || !session.user.name) return null;
        return session.user.name;
    }

    static async Get_UserEmail() {
        const session = await this.getSession();
        if (!session || !session.user || !session.user.email) return null;
        return session.user.email;
    }
}