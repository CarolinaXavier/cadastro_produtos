import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nada-por-aqui',
  templateUrl: './nada-por-aqui.component.html',
  styleUrls: ['./nada-por-aqui.component.scss']
})
export class NadaPorAquiComponent {
  @Input({ required: false }) message!: string;
}
