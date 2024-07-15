import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
} from '@angular/core';
import { UtilPaisCodeTelefone } from 'src/app/sources/pais-code-telefone';

@Directive({
    selector: '[appDinamicaImgBackground]',
})
export class DinamicaImgBackgroundDirective implements OnChanges {
    @Input() codigoDoPais!: string;
    @Input() fallbackImageUrl!: string;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnChanges(changes: SimpleChanges): void {
        const pais = UtilPaisCodeTelefone.find((pais) => pais.ddi == this.codigoDoPais);
        if (pais) {
            this.setBgImage(pais.img);
        }
    }

    setBgImage(url: string) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            this.renderer.setStyle(this.el.nativeElement, 'background-image', `url(${url})`);
            this.renderer.setStyle(this.el.nativeElement, 'background-size', 'cover');
            this.renderer.setStyle(this.el.nativeElement, 'background-position', 'center');
        };
        img.onerror = () => {
            if (this.fallbackImageUrl) {
                this.setBgImage(this.fallbackImageUrl);
            }
        };
    }
}
