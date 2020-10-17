import { Venda } from './venda';
import { Loja } from './loja';
import { Endereco } from './endereco';
import { ItemVenda } from './itemVenda';
import { Produto } from './produto';


function rodarTestarRetorno(expected: String, venda: Venda): void  {

	// action
	let retorno = venda.dadosVenda()

	// assertion		
	expect(expected).toBe(retorno)
}

function verificarCampoObrigatorio(mensagemEsperada: String, venda: Venda):void{
	try {
		venda.dadosVenda()
	} catch (e) {
		expect(e.message).toBe(mensagemEsperada)
	}
}
let NOME_LOJA: string = "Loja 1"
let LOGRADOURO: string = "Log 1"
let NUMERO:number = 10
let COMPLEMENTO: string = "C1"
let BAIRRO: string = "Bai 1"
let MUNICIPIO: string = "Mun 1"
let ESTADO: string = "E1"
let CEP: string = "11111-111"
let TELEFONE: string = "(11) 1111-1111"
let OBSERVACAO: string = "Obs 1"
let CNPJ: string = "11.111.111/1111-11"
let INSCRICAO_ESTADUAL: string = "123456789"

let LOJA_COMPLETA:Loja = new Loja(NOME_LOJA,
			new Endereco(LOGRADOURO, NUMERO, COMPLEMENTO, BAIRRO, MUNICIPIO, ESTADO, CEP), TELEFONE, OBSERVACAO,
			CNPJ, INSCRICAO_ESTADUAL)

//testes venda

let datahora:Date = new Date(2015,10,29,11,9,47)
let ccf: string = "021784"
let coo: string = "035804"	

//venda
let TEXTO_ESPERADO_VENDA = "29/10/2015 11:09:47V CCF:021784 COO:035804"
test('venda', () => {
	rodarTestarRetorno(TEXTO_ESPERADO_VENDA,LOJA_COMPLETA.vender(datahora,ccf,coo))		
})

//venda sem ccf

test('venda_valida_ccf', () => {
	let VENDA_CCF_VAZIO: Venda  = LOJA_COMPLETA.vender(datahora,"",coo)
	verificarCampoObrigatorio("O campo ccf da venda não é valido", VENDA_CCF_VAZIO)	
});
//venda sem coo

test('venda_valida_coo', () => {
	let VENDA_COO_VAZIO: Venda  = LOJA_COMPLETA.vender(datahora,ccf,"")
	verificarCampoObrigatorio("O campo coo da venda não é valido", VENDA_COO_VAZIO)	
});

//tests dados itens
function verifica_campo_obrigatorio_itens_venda(mensagemEsperada: string, venda: Venda){
	try {
		venda.dados_itens()
	} catch (e) {
		expect(e.message).toBe(mensagemEsperada)
	}        
};

let produto1: Produto = new Produto(123456, "Produto1", "kg", 4.35, "")
let produto2:Produto  = new Produto(234567, "Produto2", "m", 1.01, "")

let TEXTO_ESPERADO_DADOS_ITEM_fUNCIONAL: string = `ITEM CODIGO DESCRICAO QTD UN VL UNIT(R$) ST VL ITEM(R$)
1 123456 Produto1 2 kg 4.35  8.70
2 234567 Produto2 4 m 1.01  4.04`    

//dados_itens

test('test_itens_venda', () => {
	let venda:Venda = LOJA_COMPLETA.vender(datahora,ccf,coo)
	venda.adicionar_item(1,produto1,2)
	venda.adicionar_item(2,produto2,4)
	expect(TEXTO_ESPERADO_DADOS_ITEM_fUNCIONAL).toBe(venda.dados_itens())
});

//Venda sem itens - o cupom fiscal não pode ser impresso

test('test_venda_sem_itens', () => {
	let VENDA_SEM_ITENS: Venda = LOJA_COMPLETA.vender(datahora,ccf,coo)
	verifica_campo_obrigatorio_itens_venda("Não há itens na venda para que possa ser impressa", VENDA_SEM_ITENS)
});

//Venda com dois itens diferentes apontando para o mesmo produto - lança erro ao adicionar o item com produto repetido

test('test_venda_2_itens_mesmo_produto', () => {
	let VENDA_2_ITENS_MESMO_PRODUTO:Venda = LOJA_COMPLETA.vender(datahora,ccf,coo)
	VENDA_2_ITENS_MESMO_PRODUTO.adicionar_item(1,produto1,2)
	try{
		VENDA_2_ITENS_MESMO_PRODUTO.adicionar_item(2,produto1,3)
	}catch (e) {
		expect("A venda ja possui um item com o produto").toBe(e.message)
	}
});

//Item de Venda com quantidade zero ou negativa - não pode ser adicionado na venda

test('test_venda_itens_quant_0', () => {
	let VendaItemQuant0: Venda  = LOJA_COMPLETA.vender(datahora,ccf,coo)
	try{
		VendaItemQuant0.adicionar_item(1,produto1,0)
	}catch (e) {
		expect( "Itens com quantidade invalida (0 ou negativa)").toBe(e.message)
	}
});

//Produto com valor unitário zero ou negativo - item não pode ser adicionado na venda com produto nesse estado

test('test_venda_iten_produto_sem_valor', () => {
	let VENDA_ITEM_PRODUTO_SEM_VALOR: Venda  = LOJA_COMPLETA.vender(datahora,ccf,coo)
	let PRODUTO_SEM_VALOR: Produto  = new Produto(0, "Produto0", "nenhum", 0.0, "")
	try{
		VENDA_ITEM_PRODUTO_SEM_VALOR.adicionar_item(1,PRODUTO_SEM_VALOR,1)
	}catch (e) {
		expect("Produto com valor invalido (0 ou negativo)").toBe(e.message)
	}
});

//cupom complemento
let TEXTO_ESPERADO_CUPOM_FISCAL_UM_ITEM = `Loja 1
Log 1, 10 C1
Bai 1 - Mun 1 - E1
CEP:11111-111 Tel (11) 1111-1111
Obs 1
CNPJ: 11.111.111/1111-11
IE: 123456789
------------------------------
29/10/2015 11:09:47V CCF:021784 COO:035804
   CUPOM FISCAL
ITEM CODIGO DESCRICAO QTD UN VL UNIT(R$) ST VL ITEM(R$)
1 123456 Produto1 2 kg 4.35  8.70
2 234567 Produto2 4 m 1.01  4.04
------------------------------
TOTAL R$ 12.74`

test('test_venda_imprimir_cupom', () => {
	let venda: Venda  = LOJA_COMPLETA.vender(datahora,ccf,coo)
	venda.adicionar_item(1,produto1,2)
	venda.adicionar_item(2,produto2,4)
	expect(TEXTO_ESPERADO_CUPOM_FISCAL_UM_ITEM).toBe(venda.imprimir_cupom())
});
