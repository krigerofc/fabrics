
import { User } from "@/backend/models/user";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { email, z } from "zod";

const registerSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }),
  name: z.string().trim()
    .min(3, { message: "Nome deve ter pelo menos 2 letras" })
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, { message: "Nome só pode conter letras e espaços" }),
  password: z.string().trim()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
    .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
    .regex(/\d/, { message: "Senha deve conter pelo menos um número" })
    .regex(/[\W_]/, { message: "Senha deve conter pelo menos um caractere especial" }),
  confirm_password: z.string().trim()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
    .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
    .regex(/\d/, { message: "Senha deve conter pelo menos um número" })
    .regex(/[\W_]/, { message: "Senha deve conter pelo menos um caractere especial" })
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    if(!data.password || !data.confirm_password || !data.name || !data.email) return NextResponse.json({ message: 'Preencha todos os campos!', success: false });
    if(data.password != data.confirm_password) return NextResponse.json({ message: 'Verifique se as senhas coincidem!', success: false });

    const Hashed_password = await bcrypt.hash(data.password, 10);
    if(!Hashed_password) return NextResponse.json({ message: 'Erro interno ao criar senha.', success: false });

    const search_user = await User.getByEmail(data.email);
    if(search_user) return NextResponse.json({ message: 'Já existe uma conta criada com este email.', success: false });

    const New_User = await User.create(data.email, data.name, Hashed_password);
    if(!New_User) return NextResponse.json({ message: 'Erro interno ao criar conta.', success: false });

    return NextResponse.json({ message: 'Conta criada com sucesso!', received: New_User, success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({
        message: 'Erro de validação',
        errors: err.cause,
        success: false
      }, { status: 400 });
    }
    return NextResponse.json({ message: 'Erro interno', success: false }, { status: 500 });
  }
}
