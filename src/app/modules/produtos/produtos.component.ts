import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import {
    NgbModal,
    NgbModalOptions,
    NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
    Observable,
    Subject,
    debounceTime,
    distinctUntilChanged,
    merge,
    switchMap,
    tap,
} from 'rxjs';
import { CustomValidators } from 'src/app/index/validators/form-validators/custom.validator';
import { IInputsNotificacao } from 'src/app/interfaces/inputs-notificacao.interface';
import { IPaginacaoConfig } from 'src/app/interfaces/paginacao-config.interface';
import { IPaginacao } from 'src/app/interfaces/paginacao.interface';
import { NotificacaoModel } from 'src/app/index/models/notificacao.model';
import { ProdutoService } from 'src/app/services/produto.service';
import { FormProdutoComponent } from 'src/app/modules/produtos/components/form-produto/form-produto.component';
import { AlertaComponent } from 'src/app/shared/components/notificacao/alerta/alerta.component';
import { Utils } from 'src/app/utils/utils';
import { NotificacaoService } from 'src/app/index/services/notificacao/notificacao.service';
import { PaginacaoConfigService } from 'src/app/services/paginacao-config.service';
import { IProduto } from './interface/produto.interface';
import { ConfirmaAcaoComponent } from 'src/app/shared/components/confirma-acao/confirma-acao.component';

@Component({
    selector: 'app-produtos',
    templateUrl: './produtos.component.html',
    styleUrls: ['./produtos.component.scss'],
})
export class ProdutosComponent {
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

    statusList = [
        { value: 'todos' },
        { value: 'ativo' },
        { value: 'pendente' },
        { value: 'bloqueado' },
    ];

    existeStatusTodos: boolean = true;

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private produtoService: ProdutoService,
        private paginacaoConfigService: PaginacaoConfigService,
        private notificacaoService: NotificacaoService
    ) {
        this.dataInit$ = this.produtoService.getProdutos().pipe();
        this.dataUpdate$ = this.subjectUpdate.asObservable().pipe(
            switchMap(() => {
                return this.produtoService.getProdutos().pipe();
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
            status: [['todos'], [Validators.required]],
        });

        this.form.valueChanges
            .pipe(debounceTime(500), distinctUntilChanged())
            .subscribe((value: any) => {
                const statusControl = this.form.controls['status'];
                if(!statusControl.value.length){
                    this.existeStatusTodos = false;
                }
                if (value.status.includes('todos') && !this.existeStatusTodos) {
                    this.existeStatusTodos = true;
                    statusControl.patchValue(['todos']);
                } else if (value.status.length > 1 && value.status.includes('todos') && this.existeStatusTodos) {
                    this.existeStatusTodos = false;
                    const newValue = value.status.filter((status: string) => status !== 'todos');
                    statusControl.patchValue(newValue);
                }
                this.carregarPaginacao(this.paginacaoConfig);
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

    sortDocumentos(event: any, key: keyof IProduto) {
        if (event) {
            if (event.target.checked) {
                this.paginacao.documentos.sort((a: IProduto, b: IProduto) => {
                    if (a[key] < b[key]) return 1;
                    if (a[key] > b[key]) return -1;
                    return 0;
                });
            } else {
                this.paginacao.documentos.sort((a: IProduto, b: IProduto) => {
                    if (a[key] > b[key]) return 1;
                    if (a[key] < b[key]) return -1;
                    return 0;
                });
            }
        }
    }

    filtrarArray(objetivo: any, arrayDeObjetos: any[]): any[] {
        const { nome, sobreNome, email, status } = objetivo;
        return arrayDeObjetos.filter((objeto) => {
            if (status.includes('todos') || !status.length) {
                return (
                    Utils.removeAcentuacao(objeto.nome)
                        .toUpperCase()
                        .includes(Utils.removeAcentuacao(nome).toUpperCase()) ||
                    Utils.removeAcentuacao(objeto.sobreNome)
                        .toUpperCase()
                        .includes(Utils.removeAcentuacao(sobreNome).toUpperCase()) ||
                    Utils.removeAcentuacao(objeto.email)
                        .toUpperCase()
                        .includes(Utils.removeAcentuacao(email).toUpperCase())
                );
            } else {
                return (
                    (Utils.removeAcentuacao(objeto.nome)
                        .toUpperCase()
                        .includes(Utils.removeAcentuacao(nome).toUpperCase()) ||
                        Utils.removeAcentuacao(objeto.sobreNome)
                            .toUpperCase()
                            .includes(Utils.removeAcentuacao(sobreNome).toUpperCase()) ||
                        Utils.removeAcentuacao(objeto.email)
                            .toUpperCase()
                            .includes(Utils.removeAcentuacao(email).toUpperCase())) &&
                    status
                        ?.map((status: string) => status.toUpperCase())
                        .includes(objeto.status.toUpperCase())
                );
            }
        });
    }

    private extraiFiltros(): object {
        return {
            nome: this.form.value.nome,
            sobreNome: this.form.value.nome,
            email: this.form.value.nome,
            status: this.form.value.status,
        };
    }

    navegarParaPagina(event: any) {
        this.paginacaoConfigService.setConfig({ pagina: event });
    }

    onAdd() {
        const modalRef: NgbModalRef = this.modalService.open(
            FormProdutoComponent,
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

    onEditar(produto: IProduto) {
        const modalRef: NgbModalRef = this.modalService.open(
            FormProdutoComponent,
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

    onExcluir(produto: IProduto) {
        const modalRef: NgbModalRef = this.modalService.open(
            ConfirmaAcaoComponent,
            {
                ...this.modalOptions,
                size: 'md',
            }
        );
        modalRef.componentInstance.data = produto;
        modalRef.componentInstance.acao = 'delete';
        modalRef.result.then(
            (result) => {
                if (result) {
                    this.produtoService.deletarProduto(produto._id).subscribe({
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

    gerarNotificacao(message: string, data: IProduto, sucesso: boolean = true) {
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
}
