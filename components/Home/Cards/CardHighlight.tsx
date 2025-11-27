import { type ElementType } from "react";

interface CardProps {
    Icon: ElementType;
    Title: string;
    Text: string;
    classNameIcon?: string;
}

export default function CardHighlight({ Icon, Title, Text, classNameIcon }: CardProps) {
    return (
        <div className="w-full md:w-96 bg-gray-100 shadow-2xl rounded-lg overflow-hidden flex flex-col group hover:shadow-2xl transition-shadow duration-300 m-4">
            <div className="flex items-center justify-center mt-6 p-2">
                <Icon className={`${classNameIcon}`} size={80} />
            </div>
            
            <div className="bg-gray-100 p-6 text-center">
                <h1 className="font-bold tracking-wide uppercase text-gray-800 text-xl md:text-2xl mb-4">{Title}</h1>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{Text}</p>
            </div>
        </div>
    );
}