import { Component, Input } from '@angular/core';
import { ICategoria } from '../../../modules/categorias/interface/ categoria.interface';
import { IProduto } from 'src/app/modules/produtos/interface/produto.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
    selector: 'app-confirma-acao',
    templateUrl: './confirma-acao.component.html',
    styleUrls: ['./confirma-acao.component.scss'],
})
export class ConfirmaAcaoComponent {
    @Input({ required: true }) data!: ICategoria | IProduto;
    @Input({ required: true }) acao: 'update' | 'delete' = 'update';
    constructor(private ngbActiveModal: NgbActiveModal) { }

    confirmar(usuario: ICategoria) {
        this.ngbActiveModal.close(usuario);
    }

    dismiss() {
        this.ngbActiveModal.dismiss();
    }
}
