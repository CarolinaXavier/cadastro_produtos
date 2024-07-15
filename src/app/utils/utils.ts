import { IPaginacao } from "../interfaces/paginacao.interface";

export class Utils {
    static roundColor() {
        const letras = "0123456789ABCDEF";
        let cor = "#";
        let luminosidade;

        do {
            cor = "#";
            for (let i = 0; i < 6; i++) {
                cor += letras[Math.floor(Math.random() * 16)];
            }

            luminosidade = (
                0.299 * parseInt(cor.substring(1, 3), 16) +
                0.587 * parseInt(cor.substring(3, 5), 16) +
                0.114 * parseInt(cor.substring(5, 7), 16)
            ) / 255;

        } while (luminosidade < 0.5);

        return cor;
    }

    static obterPaginado(items: any[], pagina: number, limite: number, fields: string[] | null = null, keyword: string | null = null): IPaginacao {

        if (keyword && fields) {
            items = items.filter(element =>
                Object.keys(element).some((key) =>
                    fields.includes(key)
                        ? element[key].toLowerCase().includes(keyword.toLowerCase())
                        : null
                )
            );
        }

        items.map((element, index) => {
            element.index = index + 1;
        })

        let documentos: any[] = [];
        let totalPaginas = Math.ceil(items.length / limite);
        let count = pagina * limite - limite;
        let delimiter = count + limite;
        if (pagina <= totalPaginas) {
            items.slice(count, delimiter).forEach((element) => {
                documentos.push(element);
            });
        }
        return {
            documentos: documentos,
            paginaAtual: pagina,
            limite: limite,
            hasPaginaAnterior: pagina > 1 ? true : false,
            hasProximaPagina: pagina < totalPaginas ? true : false,
            totalDocumentos: items.length,
            totalPaginas: totalPaginas,
        };
    }

    static removeAcentuacao(texto: string) {
        if (!texto) { return '' }
        texto = texto.replace(/[ÀÁÂÃÄÅ]/, "A");
        texto = texto.replace(/[àáâãäå]/, "a");
        texto = texto.replace(/[ÈÉÊË]/, "E");
        texto = texto.replace(/[Ç]/, "C");
        texto = texto.replace(/[ç]/, "c");
        return texto.replace(/[^a-z0-9]/gi, '');
    }
}