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
}