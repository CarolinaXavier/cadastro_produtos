import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-mini',
  templateUrl: './card-mini.component.html',
  styleUrl: './card-mini.component.scss'
})
export class CardMiniComponent {
  @Input({ required: true }) data:any;
}
