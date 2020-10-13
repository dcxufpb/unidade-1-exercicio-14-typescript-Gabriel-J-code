import { Endereco } from "./endereco";

export class Loja {

    constructor(public nome_loja: string, public endereco: Endereco,
        public telefone: string, public observacao: string, public cnpj: string, public inscricao_estadual: string) { }

    public dados_loja(): string {
        // Implemente aqui
        return "";
    }
}