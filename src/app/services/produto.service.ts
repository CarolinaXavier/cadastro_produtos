import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProduto } from '../modules/produtos/interface/produto.interface';

@Injectable({
    providedIn: 'root',
})
export class ProdutoService {
    private produtosKey = 'produtos';
    constructor() { }

    // Retorna todos os produtos como um Observable
    getProdutos(): Observable<any[]> {
        const produtos = localStorage.getItem(this.produtosKey);
        return of(produtos ? JSON.parse(produtos) : []);
    }

    // Retorna um produto pelo seu ID como um Observable
    getProdutoById(id: string): Observable<any> {
        const produtos = JSON.parse(localStorage.getItem(this.produtosKey) || '[]');
        const produto = produtos.find((p: any) => p._id === id);
        return of(produto);
    }

    // Adiciona um novo produto
    adicionarProduto(produto: any): Observable<any> {
        return new Observable((obs) => {
            try {
                let produtos = JSON.parse(localStorage.getItem(this.produtosKey) || '[]');
                produtos.push(produto);
                localStorage.setItem(this.produtosKey, JSON.stringify(produtos));
                obs.next({
                    message: 'Salvo com sucesso!',
                    data: produto,
                });
            } catch {
                obs.error({
                    message: 'Erro em salvar!',
                    error: { data: produto },
                });
            }
        });
    }

    // Atualiza um produto existente
    atualizarProduto(produto: any): Observable<any> {
        return new Observable((obs) => {
            try {
                let produtos = JSON.parse(localStorage.getItem(this.produtosKey) || '[]');
                const index = produtos.findIndex((p: any) => p._id === produto._id);
                if (index !== -1) {
                    produtos[index] = produto;
                    localStorage.setItem(this.produtosKey, JSON.stringify(produtos));
                }
                obs.next({
                    message: 'Sucesso em editar!',
                    data: produto,
                });
            } catch {
                obs.error({
                    message: 'Erro em editar!',
                    error: { data: produto },
                });
            }
        });
    }

    // Deleta um produto pelo seu ID
    deletarProduto(_id: string): Observable<any> {
        return new Observable((obs) => {
            const data = this.getProdutoById(_id);
            try {
                let produtos = JSON.parse(localStorage.getItem(this.produtosKey) || '[]');
                produtos = produtos.filter((p: any) => p._id !== _id);
                localStorage.setItem(this.produtosKey, JSON.stringify(produtos));
                obs.next({
                    message: 'Removido com sucesso!',
                    data: data
                });
            } catch {
                obs.error({
                    message: 'Erro em remover!',
                    error: { data: data },
                });
            }
        });

    }


    private getProductsFromStorage(): IProduto[] {
        const products = localStorage.getItem(this.produtosKey);
        return products ? JSON.parse(products) : [];
    }

    hasProductsInCategory(categoryId: string): Observable<boolean> {
        const products = this.getProductsFromStorage();
        const hasProducts = products.some(product => product.categoria_id === categoryId);
        return of(hasProducts);
    }
}
