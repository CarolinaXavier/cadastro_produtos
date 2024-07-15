import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificacaoModel } from 'src/app/index/models/notificacao.model';
import { FormService } from 'src/app/index/services/forms/form.service';
import { NotificacaoService } from 'src/app/index/services/notificacao/notificacao.service';
import { CustomValidators } from 'src/app/index/validators/form-validators/custom.validator';
import { IInputsNotificacao } from 'src/app/interfaces/inputs-notificacao.interface';
import { CategoriaService } from 'src/app/services/categoria.service';
import { AlertaComponent } from 'src/app/shared/components/notificacao/alerta/alerta.component';
import { ICategoria } from '../../interface/ categoria.interface';
import { ConfirmaAcaoComponent } from 'src/app/shared/components/confirma-acao/confirma-acao.component';

@Component({
  selector: 'app-form-categoria',
  templateUrl: './form-categoria.component.html',
  styleUrl: './form-categoria.component.scss'
})
export class FormCategoriaComponent {
  @Input({ required: true }) data!: ICategoria;

  form!: FormGroup;

  constructor(
      private fb: FormBuilder,
      protected formService: FormService,
      private categoriaService: CategoriaService,
      private modalService: NgbModal,
      private ngbActiveModal: NgbActiveModal,
      private notificacaoService: NotificacaoService
  ) {
      this.form = this.fb.group({
          nome: new FormControl(null, [
              Validators.required,
              CustomValidators.notEmpty,
          ])
      });
  }

  ngOnInit(): void {
      if (this.data) {
          this.form.patchValue(this.data, { emitEvent: false, onlySelf: true });
      }
  }

  onSubmit() {
      if (this.formService.valid(this.form)) {
          const now = new Date();
          if (!this.data) {
              const categoria: ICategoria = Object.assign(
                  {
                      _id: now.toISOString(),
                  } as ICategoria,
                  this.form.value
              );
              this.categoriaService.adicionarCategoria(categoria).subscribe({
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
                          const categoria: ICategoria = Object.assign(
                              this.data,
                              this.form.value
                          );
                          this.categoriaService.atualizarCategoria(categoria).subscribe({
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
}
