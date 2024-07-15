import { Component, Input } from '@angular/core';
import { Notificacao } from '../notificacao.component';
import { IInputsNotificacao } from 'src/app/interfaces/inputs-notificacao.interface';

@Component({
    selector: 'app-alerta',
    templateUrl: './alerta.component.html',
    styleUrls: ['./alerta.component.scss']
})
export class AlertaComponent extends Notificacao {
    @Input() data!: IInputsNotificacao;
}
