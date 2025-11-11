import { AuthServer } from "@/backend/auth/auth";
import { Category } from "@/backend/models/Category";
import { Product } from "@/backend/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
   try{
        const body = await req.json();

        const user_Id = await AuthServer.Get_UserId();
        if(!user_Id) return NextResponse.json({ message:"Faça login para continuar!", success:false });

        if (!body.name || !body.categoryId || typeof body.totalQuantity === 'undefined' || typeof body.availableQuantity === 'undefined' || typeof body.pricePerUnit === 'undefined'){
            return NextResponse.json({ message: "Nome, Categoria, Quantidades e Preço são obrigatórios!", success: false });
        }

        if (typeof body.isUnitBased !== 'boolean' || typeof body.isMetre !== 'boolean' ) {
            return NextResponse.json({ message: "Os tipos de medida (Unidade/Metro) são obrigatórios!", success: false });
        }

        if (body.isUnitBased && body.isMetre) {
            return NextResponse.json({  message: "O produto deve ser baseado APENAS em Unidade ou APENAS em Metros.",  success: false });
}
        if (!body.isUnitBased && !body.isMetre) {
            return NextResponse.json({   message: "O tipo de medida (Unidade ou Metro) deve ser selecionado.", success: false });
        }

        const { name, categoryId, description, isUnitBased, isMetre,
                totalQuantity, availableQuantity, pricePerUnit } = body;

        const parsedTotalQuantity = Number(totalQuantity);
        const parsedAvailableQuantity = Number(availableQuantity);
        const parsedPricePerUnit = Number(pricePerUnit);

        if (isNaN(parsedTotalQuantity) || isNaN(parsedAvailableQuantity) || isNaN(parsedPricePerUnit)) {
            return NextResponse.json({ message: "Quantidades e preço devem ser números válidos.", success: false }); }
        if (parsedTotalQuantity < 0 || parsedAvailableQuantity < 0 || parsedPricePerUnit <= 0) {
            return NextResponse.json({ message: "Quantidades devem ser não-negativas e o preço deve ser positivo.", success: false }); }

        if (parsedAvailableQuantity > parsedTotalQuantity) {
            return NextResponse.json({ message: "A quantidade disponível não pode ser maior que a quantidade total.", success: false });  }

        const trimmedName = name.trim(); 
        if (trimmedName.length < 3) {
            return NextResponse.json({ message: "O nome do produto deve ter no mínimo 3 caracteres.", success: false }); }

        const existing_product = await Product.getByName(body.name, user_Id);
        if(existing_product) return NextResponse.json({message:"Este produto já existe!", success:false});

        const existing_category = await Category.getById(body.categoryId, user_Id);
        if(!existing_category) return NextResponse.json({message:"A categoria selecionada não existe!", success:false});

        const finalDescription = description ? description.trim() : null;

        const new_product = await Product.create(user_Id, name, categoryId, parsedTotalQuantity, parsedAvailableQuantity, parsedPricePerUnit, isUnitBased, isMetre, finalDescription);
        if(!new_product) return NextResponse.json({ message:"Falha ao criar produto!", success:false })

        console.log(new_product);
        return NextResponse.json({ message:'Produto criado com sucesso!', success:true })
   }catch(error){
    return NextResponse.json({ message:"Erro ao tentar criar produto!", error:error, success:false})
   } 
}