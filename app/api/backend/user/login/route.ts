import { User } from "@/backend/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const validationSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }),
  password: z.string().trim().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = validationSchema.parse(body);

    const user = await User.getByEmail(data.email);
    if (!user || typeof user.password !== "string") {
      return NextResponse.json( { success: false, error: "Credenciais inválidas" },{ status: 401 } );
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(  { success: false, error: "Credenciais inválidas" }, { status: 401 });
    }

    const { password, ...userSafeData } = user;

    return NextResponse.json({ success: true, user: userSafeData,
    });

    } catch (error) {
      return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
