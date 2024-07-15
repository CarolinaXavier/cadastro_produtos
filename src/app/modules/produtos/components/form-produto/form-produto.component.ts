import { Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { CustomValidators } from 'src/app/index/validators/form-validators/custom.validator';
import { FormService } from 'src/app/index/services/forms/form.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
    NgbActiveModal,
    NgbModal,
    NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { NotificacaoModel } from 'src/app/index/models/notificacao.model';
import { IInputsNotificacao } from 'src/app/interfaces/inputs-notificacao.interface';
import { AlertaComponent } from '../../../../shared/components/notificacao/alerta/alerta.component';
import { CategoriaService } from 'src/app/services/categoria.service';
import { NotificacaoService } from 'src/app/index/services/notificacao/notificacao.service';
import { IProduto } from '../../interface/produto.interface';
import { ConfirmaAcaoComponent } from 'src/app/shared/components/confirma-acao/confirma-acao.component';

@Component({
    selector: 'app-form-produto',
    templateUrl: './form-produto.component.html',
    styleUrls: ['./form-produto.component.scss'],
})
export class FormProdutoComponent implements OnInit {
    @Input({ required: true }) data!: IProduto;

    form!: FormGroup;
    categorias: any[] = [];
    constructor(
        private fb: FormBuilder,
        protected formService: FormService,
        private categoriaService: CategoriaService,
        private produtoService: ProdutoService,
        private modalService: NgbModal,
        private ngbActiveModal: NgbActiveModal,
        private notificacaoService: NotificacaoService,
        
    ) {
        this.form = this.fb.group({
            nome: new FormControl(null, [
                Validators.required,
                CustomValidators.notEmpty,
            ]),
            preco: new FormControl(null, [
                Validators.required,
            ]),
            categoria_id: new FormControl(null, [Validators.required]),
        });
        this.getCategorias();
    }

    ngOnInit(): void {
        if (this.data) {
            this.form.patchValue(this.data, { emitEvent: false, onlySelf: true });
        }
    }

    onSubmit() {
        if (this.formService.valid(this.form)) {
            const now = new Date();
            console.log(this.categoriaService.getCategoriaById(this.form.get('categoria_id')?.value))
            if (!this.data) {
                const produto: IProduto = Object.assign(
                    {
                        _id: now.toISOString(),
                        status: 'ativo',
                        categoria:this.categoriaService.getCategoriaById(this.form.value.categoria_id)
                    } as IProduto,
                    this.form.value
                );
                this.produtoService.adicionarProduto(produto).subscribe({
                    next: (response: any) => {
                        this.gerarNotificacao(response.message, response.data);
                        this.ngbActiveModal.close(response);
                    },
                    error: (erro: HttpErrorResponse) => {
                        this.gerarNotificacao(erro.message, erro.error.data, false);
                        this.ngbActiveModal.close();
                        console.log(erro);
                    },
                    complete: () => { },
                });
            } else {
                const modalRef: NgbModalRef = this.modalService.open(
                    ConfirmaAcaoComponent,
                    {
                        ariaLabelledBy: 'modal-basic-title',
                        size: 'md',
                        centered: true,
                        backdrop: 'static',
                    }
                );
                modalRef.componentInstance.data = this.data;
                modalRef.result.then(
                    (result) => {
                        if (result) {
                            const produto: IProduto = Object.assign(
                                this.data,
                                this.form.value
                            );
                            this.produtoService.atualizarProduto(produto).subscribe({
                                next: (response: any) => {
                                    this.gerarNotificacao(response.message, response.data);
                                    this.ngbActiveModal.close(response);
                                },
                                error: (erro: HttpErrorResponse) => {
                                    this.gerarNotificacao(erro.message, erro.error.data, false);
                                    this.ngbActiveModal.close();
                                    console.log(erro);
                                },
                                complete: () => { },
                            });
                        }
                    },
                    (reason) => { }
                );
            }
        } else {
            console.error(`from: ${this.form.status}`);
        }
    }

    dismiss() {
        this.ngbActiveModal.dismiss();
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

    getCategorias(): void {
        this.categoriaService.getCategorias().subscribe(
          categorias => {
            this.categorias = categorias;
          },
          error => {
            console.error('Erro ao obter categorias:', error);
          }
        );
      }
}
