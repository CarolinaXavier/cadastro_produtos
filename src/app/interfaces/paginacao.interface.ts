export interface IPaginacao {
    documentos: any[];
    paginaAtual: number;
    limite: number,
    hasPaginaAnterior: boolean;
    hasProximaPagina: boolean;
    totalDocumentos: number;
    totalPaginas: number;
}