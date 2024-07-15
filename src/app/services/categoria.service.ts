import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CategoriaService {
    private categoriasKey = 'categorias';

    constructor() { }
    
    getCategorias(): Observable<any[]> {
        const produtos = localStorage.getItem(this.categoriasKey);
        return of(produtos ? JSON.parse(produtos) : []);
    }

    // Retorna uma categoria pelo seu ID
    getCategoriaById(id: string) {
        const categorias = JSON.parse(localStorage.getItem(this.categoriasKey) || '[]');
        const categoria = categorias.find((c: any) => c._id === id);
        return categoria;
    }

    // Adiciona uma nova categoria
    adicionarCategoria(categoria: any): Observable<any> {
        return new Observable((obs) => {
            try {
                let categorias = JSON.parse(localStorage.getItem(this.categoriasKey) || '[]');
                categorias.push(categoria);
                localStorage.setItem(this.categoriasKey, JSON.stringify(categorias));
                obs.next({
                    message: 'Salvo com sucesso!',
                    data: categoria,
                });
            } catch {
                obs.error({
                    message: 'Erro em salvar!',
                    error: { data: categoria },
                });
            }
        });
    }

    // Atualiza uma categoria existente
    atualizarCategoria(categoria: any): Observable<any> {
        return new Observable((obs) => {
            try {
                let categorias = JSON.parse(localStorage.getItem(this.categoriasKey) || '[]');
                const index = categorias.findIndex((c:any) => c._id === categoria._id);
                if (index !== -1) {
                    categorias[index] = categoria;
                    localStorage.setItem(this.categoriasKey, JSON.stringify(categorias));
                }
                obs.next({
                    message: 'Sucesso em editar!',
                    data: categoria,
                });
            } catch {
                obs.error({
                    message: 'Erro em editar!',
                    error: { data: categoria },
                });
            }
        });
    }
    // Deleta uma categoria pelo seu ID
    deletarCategoria(_id: string): Observable<any> {
        return new Observable((obs) => {
            const data = this.getCategoriaById(_id);
            try {
                let categorias = JSON.parse(localStorage.getItem(this.categoriasKey) || '[]');
                categorias = categorias.filter((c: any) => c._id !== _id);
                localStorage.setItem(this.categoriasKey, JSON.stringify(categorias));
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
}
