import { Loja } from './loja';
import { ItemVenda } from './itemVenda';
import { Produto } from './produto';

export class Venda {    

    constructor(public loja :Loja, public DataHora :Date, public ccf :String, public coo :String) {}
	public itens:Array<ItemVenda>= new Array<ItemVenda>()

    public dadosVenda(): string {
        this.validarCamposObrigatorios()

        var aux = this.DataHora
		var _date = Venda.intFormat(aux.getDate(),2)
		var _month = Venda.intFormat(aux.getMonth(),2)
		var _year = Venda.intFormat(aux.getFullYear(),2)
		var _hours = Venda.intFormat(aux.getHours(),2)
		var _minutes = Venda.intFormat(aux.getMinutes(),2)
		var _seconds = Venda.intFormat(aux.getSeconds(),2)

		var _datatime = `${_date}/${_month}/${_year} ${_hours}:${_minutes}:${_seconds}`		

        var dados = `${_datatime}V CCF:${this.ccf} COO:${this.coo}`;       
        return dados;
    }

	private static intFormat(num:number, tam:number): string {
		var _num = num.toString()
		while(_num.length<tam){
			_num = "0" + _num
		}
		return _num		
	}
    
    private validarCamposObrigatorios():void {		
        if (!this.ccf){
            throw new Error("O campo ccf da venda não é valido")
        }
        if (!this.coo){
            throw new Error("O campo coo da venda não é valido")
        }        
    }

	public adicionar_item(item:number, produto:Produto ,quantidade:number): void{
		this.validar_item(produto, quantidade);		
		let item_venda:ItemVenda = new ItemVenda(this, item, produto, quantidade);
        this.itens.push(item_venda);
    }

	private validar_item(produto:Produto , quantidade:number):void{
		//Venda com dois itens diferentes apontando para o mesmo produto		
		for (let count:number=0;count<this.itens.length;count++){
			if (produto == this.itens[count].produto){
                throw new Error("A venda ja possui um item com o produto");
            }
        }
		//Item de Venda com quantidade zero ou negativa - não pode ser adicionado na venda
		if (quantidade <= 0){
            throw new Error("Itens com quantidade invalida (0 ou negativa)");
        }
		//Produto com valor unitário zero ou negativo - item não pode ser adicionado na venda com produto nesse estado
		if (produto.valor_unitario <= 0){
            throw new Error("Produto com valor invalido (0 ou negativo)");
        }
    }
            
    public dados_itens(): string {
        if (this.itens.length == 0){
            throw new Error("Não há itens na venda para que possa ser impressa");
        }              
        let dados:Array<string> = new Array<string>();
        dados.push("ITEM CODIGO DESCRICAO QTD UN VL UNIT(R$) ST VL ITEM(R$)");
		
        for (let count:number=0;count<this.itens.length;count++){
			var item_linha: ItemVenda = this.itens[count]
            let valor_item:number = item_linha.quantidade * item_linha.produto.valor_unitario;
            let p: Produto = item_linha.produto;
            let linha:string = `${item_linha.item} ${p.codigo} ${p.descricao} ${item_linha.quantidade} ${p.unidade} ${p.valor_unitario.toFixed(2)} ${p.substituicao_tributaria} ${valor_item.toFixed(2)}`
            dados.push(linha);
        }
        return dados.join(`
`);
    }

    public calcular_total(): number{
        let totais:number = 0.0;		
        for (let count:number=0;count<this.itens.length;count++){
			let item_linha: ItemVenda = this.itens[count]
            totais += (item_linha.quantidade * item_linha.produto.valor_unitario)
        }
        return totais;
    }

    public imprimir_cupom(): string{	
        let BREAK: string = `
`;
        let cupom: Array<string> = new Array<string>()	
        cupom.push(this.loja.dados_loja());
        cupom.push("------------------------------"+ BREAK);
        cupom.push(this.dadosVenda()+ BREAK);
        cupom.push("   CUPOM FISCAL"+ BREAK);
        cupom.push(this.dados_itens()+ BREAK);
        cupom.push("------------------------------"+ BREAK);
        cupom.push("TOTAL R$ "+ this.calcular_total().toFixed(2));
        return cupom.join("");
    }
}