import { AuthServer } from "@/backend/auth/auth";
import { Category } from "@/backend/models/Category";
import { Product } from "@/backend/models/product";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req:NextRequest){
   try{
        const body = await req.json();

        const user_Id = await AuthServer.Get_UserId();
        if(!user_Id) return NextResponse.json({ message:"Faça login para continuar!", success:false });

        const { id, name, categoryId, description, isUnitBased, isMetre,
                totalQuantity, availableQuantity, pricePerUnit, price, batchId } = body;

        if (!id) {
            return NextResponse.json({ message: "ID do produto é obrigatório!", success: false });
        }

        const existing_product = await Product.getById(id, user_Id);
        if(!existing_product) return NextResponse.json({message:"Produto não encontrado!", success:false});

        if (name) {
            const trimmedName = name.trim(); 
            if (trimmedName.length < 3) {
                return NextResponse.json({ message: "O nome do produto deve ter no mínimo 3 caracteres.", success: false }); 
            }
            const product_with_same_name = await Product.getByName(trimmedName, user_Id);
            if(product_with_same_name && product_with_same_name.id !== id) {
                return NextResponse.json({message:"Este nome de produto já está em uso!", success:false});
            }
        }

        if (categoryId) {
            const existing_category = await Category.getById(categoryId, user_Id);
            if(!existing_category) return NextResponse.json({message:"A categoria selecionada não existe!", success:false});
        }

        if (typeof isUnitBased === 'boolean' && typeof isMetre === 'boolean') {
            if (isUnitBased && isMetre) {
                return NextResponse.json({  message: "O produto deve ser baseado APENAS em Unidade ou APENAS em Metros.",  success: false });
            }
            if (!isUnitBased && !isMetre) {
                return NextResponse.json({   message: "O tipo de medida (Unidade ou Metro) deve ser selecionado.", success: false });
            }
        }

        const parsedTotalQuantity = totalQuantity !== undefined ? Number(totalQuantity) : undefined;
        const parsedAvailableQuantity = availableQuantity !== undefined ? Number(availableQuantity) : undefined;
        const parsedPricePerUnit = pricePerUnit !== undefined ? Number(pricePerUnit) : undefined;
        const parsedPrice = price !== undefined ? Number(price) : undefined;

        if ( (parsedTotalQuantity !== undefined && isNaN(parsedTotalQuantity)) || 
             (parsedAvailableQuantity !== undefined && isNaN(parsedAvailableQuantity)) || 
             (parsedPricePerUnit !== undefined && isNaN(parsedPricePerUnit)) ||
             (parsedPrice !== undefined && isNaN(parsedPrice)) ) {
            return NextResponse.json({ message: "Quantidades e preço devem ser números válidos.", success: false }); 
        }

        if ( (parsedTotalQuantity !== undefined && parsedTotalQuantity < 0) || 
             (parsedAvailableQuantity !== undefined && parsedAvailableQuantity < 0) || 
             (parsedPricePerUnit !== undefined && parsedPricePerUnit <= 0) ||
             (parsedPrice !== undefined && parsedPrice <= 0) ) {
            return NextResponse.json({ message: "Quantidades devem ser não-negativas e o preço deve ser positivo.", success: false }); 
        }

        const finalTotalQuantity = parsedTotalQuantity ?? existing_product.totalQuantity;
        const finalAvailableQuantity = parsedAvailableQuantity ?? existing_product.availableQuantity;

        if (finalAvailableQuantity > finalTotalQuantity) {
            return NextResponse.json({ message: "A quantidade disponível não pode ser maior que a quantidade total.", success: false });  
        }

        const finalDescription = description ? description.trim() : existing_product.description;

        const updated_product = await Product.update(id, user_Id, name, categoryId, parsedTotalQuantity, parsedAvailableQuantity, parsedPricePerUnit, parsedPrice, batchId, isUnitBased, isMetre, finalDescription);
        if(!updated_product) return NextResponse.json({ message:"Falha ao atualizar produto!", success:false })
        return NextResponse.json({ message:'Produto atualizado com sucesso!', success:true })
   }catch(error){
    return NextResponse.json({ message:"Erro ao tentar atualizar produto!", error:error, success:false})
   } 
}
