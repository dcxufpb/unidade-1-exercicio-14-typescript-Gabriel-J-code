import { Endereco } from "./endereco";
import { Venda } from './venda';


export class Loja {

	
    constructor(public nome_loja: string, public endereco: Endereco, public telefone: string, public observacao: string, public cnpj: string, public inscricao_estadual: string) {}
	
	public vendas: Array<Venda> = new Array<Venda>()

    public dados_loja(): string {
        this.validar_campos_obrigatorios();        
		
		
		var _telefone = (this.telefone)? "Tel " + this.telefone : ""
		
		_telefone = ( this.endereco.possui_cep() && this.telefone)? " " + _telefone : _telefone

		var _observacao = (this.observacao)? this.observacao : ""

		var nota = `${this.nome_loja}\n`		
		nota += `${this.endereco.dados_endereco()}${_telefone}\n`
		nota += `${_observacao}\n`
		nota += `CNPJ: ${this.cnpj}\n`
		nota += `IE: ${this.inscricao_estadual}\n`

		return nota;
    }

	public validar_campos_obrigatorios(): void {
		if (!this.nome_loja) {
		throw new Error(`O campo nome da loja é obrigatório`);
		}
		
		if (!this.cnpj){
			throw new Error(`O campo CNPJ da loja é obrigatório`)
		} 
		if (!this.inscricao_estadual){
			throw new Error(`O campo inscrição estadual da loja é obrigatório`)
		}
	}

	public vender(datahora: Date, ccf: string, coo:string) :Venda{
        let nova_venda :Venda = new Venda(this, datahora, ccf, coo);
        this.vendas.push(nova_venda);
        return nova_venda;
    }
}