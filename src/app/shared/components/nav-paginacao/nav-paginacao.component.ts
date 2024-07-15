import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPaginacao } from 'src/app/interfaces/paginacao.interface';

@Component({
  selector: 'app-nav-paginacao',
  templateUrl: './nav-paginacao.component.html',
  styleUrls: ['./nav-paginacao.component.scss'],
})
export class NavPaginacaoComponent {
  @Input({ required: true }) paginacao!: IPaginacao;
  @Output() navigate = new EventEmitter<number>();

  get totalPaginas(): number {
    return this.paginacao.totalPaginas;
  }

  get prevPage(): boolean {
    return this.paginacao.paginaAtual <= 1;
  }

  get nextPage(): boolean {
    return this.paginacao.paginaAtual >= this.totalPaginas;
  }

  get carousel(): number[] {
    if (this.totalPaginas >= this.paginacao.paginaAtual) {
      let carousel = [
        this.paginacao.paginaAtual - 1,
        this.paginacao.paginaAtual,
      ];

      if (this.paginacao.paginaAtual < this.paginacao.totalPaginas - 1) {
        carousel = [...carousel, this.paginacao.paginaAtual + 1];
      }
      if (this.paginacao.paginaAtual < this.paginacao.totalPaginas - 2) {
        carousel = [...carousel, this.paginacao.paginaAtual + 2];
      }

      return carousel
        .filter((el) => el > 0)
        .slice(0, this.totalPaginas >= 5 ? 5 : this.totalPaginas);
    }
    return [];
  }

  navegarParaPagina(pagina: number) {
    if (
      pagina !== this.paginacao.paginaAtual &&
      pagina > 0 &&
      pagina <= this.totalPaginas
    )
      this.navigate.emit(pagina);
  }
}
