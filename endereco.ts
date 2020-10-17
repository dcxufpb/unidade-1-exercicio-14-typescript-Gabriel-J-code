export class Endereco {

    constructor(public logradouro: string, public numero: number, public complemento: string,
        public bairro: string, public municipio: string, public estado: string, public cep: string) { }
	
	public dados_endereco(): String{

		this.validar_campos_obrigatorios();

		var _numero = (!this.numero)? "s/n" : String(this.numero)
		
		var _complemento = (this.complemento)? " " + this.complemento : ""	

		var _bairro = (this.bairro)? this.bairro + " - " : ""

		var _cep = (this.cep)? "CEP:" + this.cep : ""

		let dados = `${this.logradouro}, ${_numero}${_complemento}\n`
		dados += `${_bairro}${this.municipio} - ${this.estado}\n`
		dados += `${_cep}`

		return dados;
	}

	public validar_campos_obrigatorios(): void {
		if (!this.logradouro){
			throw new Error(`O campo logradouro do endereço é obrigatório`)
		}		
		if (!this.municipio){
			throw new Error(`O campo município do endereço é obrigatório`)
		}
		if (!this.estado){
			throw new Error(`O campo estado do endereço é obrigatório`)
		} 		
	}

	public possui_cep():boolean{
		
		return (this.cep)? true : false;
	}

}