import { Venda } from './venda';
import { Produto } from './produto';

export class ItemVenda {	
    constructor(public venda: Venda , public item: number, public produto: Produto ,public quantidade: number) {}       
}