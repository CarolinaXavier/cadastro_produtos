import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbModalOptions, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, switchMap, merge, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomValidators } from 'src/app/index/validators/form-validators/custom.validator';
import { IInputsNotificacao } from 'src/app/interfaces/inputs-notificacao.interface';
import { IPaginacaoConfig } from 'src/app/interfaces/paginacao-config.interface';
import { IPaginacao } from 'src/app/interfaces/paginacao.interface';
import { NotificacaoModel } from 'src/app/index/models/notificacao.model';
import { AlertaComponent } from 'src/app/shared/components/notificacao/alerta/alerta.component';
import { Utils } from 'src/app/utils/utils';
import { NotificacaoService } from 'src/app/index/services/notificacao/notificacao.service';
import { PaginacaoConfigService } from 'src/app/services/paginacao-config.service';
import { ICategoria } from './interface/ categoria.interface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { FormCategoriaComponent } from './components/form-categoria/form-categoria.component';
import { ProdutoService } from 'src/app/services/produto.service';
import { IProduto } from '../produtos/interface/produto.interface';
import { ConfirmaAcaoComponent } from 'src/app/shared/components/confirma-acao/confirma-acao.component';

@Component({
    selector: 'app-categorias',
    templateUrl: './categorias.component.html',
    styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {
    data$!: Observable<IProduto[]>;
    dataInit$!: Observable<IProduto[]>;
    dataUpdate$!: Observable<IProduto[]>;
    subjectUpdate: Subject<any> = new Subject<any>();

    form!: FormGroup;
    controleSortData: FormControl = new FormControl(true);
    controleLimite: FormControl = new FormControl(
        this.paginacaoConfigService.getConfig().limite
    );

    paginacao!: IPaginacao;
    paginacaoConfig: IPaginacaoConfig = this.paginacaoConfigService.getConfig();
    private data!: any;

    modalOptions: NgbModalOptions = {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        centered: true,
        backdrop: 'static',
    };

    existeStatusTodos: boolean = true;

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private categoriaService: CategoriaService,
        private paginacaoConfigService: PaginacaoConfigService,
        private notificacaoService: NotificacaoService,
        private produtoService: ProdutoService,
    ) {
        this.dataInit$ = this.categoriaService.getCategorias().pipe();
        this.dataUpdate$ = this.subjectUpdate.asObservable().pipe(
            switchMap(() => {
                return this.categoriaService.getCategorias().pipe();
            })
        );

        this.data$ = merge(this.dataInit$, this.dataUpdate$).pipe(
            tap((data) => {
                this.data = data;
                this.carregarPaginacao(this.paginacaoConfig);
                console.log(this.data);
            })
        );

        this.form = this.fb.group({
            nome: ['', [Validators.required, CustomValidators.notEmpty]],
        });

        this.paginacaoConfigService.configChanges().subscribe((config) => {
            this.paginacaoConfig = config;
            if (this.data) {
                this.carregarPaginacao(this.paginacaoConfig);
            }
        });

        this.controleLimite.valueChanges.subscribe((value) => {
            this.paginacaoConfigService.setConfig({ pagina: 1, limite: Number(value) });
        });
    }

    carregarPaginacao(paginacaoConfig: IPaginacaoConfig): void {
        this.paginacao = Utils.obterPaginado(
            this.filtrarArray(this.extraiFiltros(), this.data),
            paginacaoConfig.pagina,
            paginacaoConfig.limite
        );
    }

    sortDocumentos(event: any, key: keyof ICategoria) {
        if (event) {
            if (event.target.checked) {
                this.paginacao.documentos.sort((a: ICategoria, b: ICategoria) => {
                    if (a[key] < b[key]) return 1;
                    if (a[key] > b[key]) return -1;
                    return 0;
                });
            } else {
                this.paginacao.documentos.sort((a: ICategoria, b: ICategoria) => {
                    if (a[key] > b[key]) return 1;
                    if (a[key] < b[key]) return -1;
                    return 0;
                });
            }
        }
    }

    filtrarArray(objetivo: any, arrayDeObjetos: any[]): any[] {
        const { nome } = objetivo;
        return arrayDeObjetos.filter((objeto) => {
            return (
                Utils.removeAcentuacao(objeto.nome)
                    .toUpperCase()
                    .includes(Utils.removeAcentuacao(nome).toUpperCase()))
        });
    }

    private extraiFiltros(): object {
        return {
            nome: this.form.value.nome,
        };
    }

    navegarParaPagina(event: any) {
        this.paginacaoConfigService.setConfig({ pagina: event });
    }

    onAdd() {
        const modalRef: NgbModalRef = this.modalService.open(
            FormCategoriaComponent,
            this.modalOptions
        );
        modalRef.result.then(
            (result: any) => {
                if (result) {
                    this.subjectUpdate.next({});
                }
            },
            (reason) => { }
        );
    }

    onEditar(produto: ICategoria) {
        const modalRef: NgbModalRef = this.modalService.open(
            FormCategoriaComponent,
            this.modalOptions
        );
        modalRef.componentInstance.data = produto;
        modalRef.result.then(
            (result) => {
                if (result) {
                    this.subjectUpdate.next({});
                }
            },
            (reason) => { }
        );
    }

    onExcluir(categoria: ICategoria) {
        const modalRef: NgbModalRef = this.modalService.open(
            ConfirmaAcaoComponent,
            {
                ...this.modalOptions,
                size: 'md',
            }
        );
        modalRef.componentInstance.data = categoria;
        modalRef.componentInstance.acao = 'delete';
        modalRef.result.then(
            (result) => {
                if (result) {
                    this.categoriaService.deletarCategoria(categoria._id).subscribe({
                        next: (response: any) => {
                            this.gerarNotificacao(response.message, response.data);
                            this.subjectUpdate.next({});
                        },
                        error: (erro: HttpErrorResponse) => {
                            this.gerarNotificacao(erro.message, erro.error.data, false);
                            console.log(erro);
                        },
                        complete: () => { },
                    });
                }
            },
            (reason) => { }
        );
    }

    gerarNotificacao(message: string, data: ICategoria, sucesso: boolean = true) {
        this.notificacaoService.add(
            new NotificacaoModel({
                component: AlertaComponent,
                inputs: {
                    data: {
                        tipo: sucesso ? 'sucesso' : 'fracasso',
                        titulo: sucesso ? 'Sucesso!' : 'Fracasso!',
                        message: message,
                        data: data
                    } as IInputsNotificacao,
                },
            })
        );
    }

    onCheckProdutoInCategoria(categoria: ICategoria) {
        this.produtoService.hasProductsInCategory(categoria._id).subscribe(hasProducts => {
          if (hasProducts) {
            this.gerarNotificacao('Não é possível excluir categoria, já está vinculada a produtos',categoria,false);
          } else {
            this.onExcluir(categoria);
          }
        });
      }
}