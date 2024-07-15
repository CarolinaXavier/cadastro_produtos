import { ICategoria } from "../../categorias/interface/ categoria.interface";

export interface IProduto {
    _id: string;
    nome: string;
    categoria_id: string;
    categoria:ICategoria;
    preco:number;
    status: 'ativo' | 'pendente' | 'bloqueado';
}
