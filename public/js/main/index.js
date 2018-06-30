import IndexController from './IndexController';
//const COUNTRIESURL = '/countries.json';
const CURRENCIESURL = '/currencies.json';
const mmap = {'to_currency_select_id':'currency_input_1', 
              'from_currency_select_id':'currency_input_2'}; 
const dmap = {'to_currency_select_id':'currency_input_2', 
              'from_currency_select_id':'currency_input_1'};

let mcompute;


export class Compute {
    constructor(){
        //this._countries = this.lfetch(COUNTRIESURL)['results'];
        this._currencies = this.lfetch(CURRENCIESURL)['results'];
        this._setting = {};
        this._cuList = [];
        this._indexController = new IndexController();
        
    }
    
    async lfetch(url){
        let rst = await fetch(url);
        let mm = await rst.json();
        //console.log(mm.results);
        return mm.results;
    }
    async setup(){
        let currencies = [];
        let val;
        //console.log(this._currencies);
        let bb = await this.lfetch(CURRENCIESURL);
        for(const ky of Object.keys(bb)) {
            val = bb[ky];
            let tmpl = `<option value="${val['id']}">${val['currencyName']}</option>`;
            currencies.push(tmpl);     
        }
        let rst = currencies.join('');
        return rst;
              
    }
    async loadAfterHTML(){
        let options = await this.setup();

        let right = document.getElementById('right');
        let left = document.getElementById('left');
        right.innerHTML = selectHMTL(options,'to_currency_select_id' );
        left.innerHTML = selectHMTL(options,'from_currency_select_id' );

    }
    
   checkAndCompute(event, from, to) {
       if(!this._setting[event.target.id]) { 
           if (from.value < 0 ){
               from.value = 0;
               return;
           }
           to.value = from.value; return;}
       if(from.value < 0) {
           from.value = 0;
           return;
       }
       const vl = from.value * this._setting[event.target.id][1];   
       to.value = Math.round(vl * 100) / 100; 
   }


    _setSetting1(id1, idp1,id2, idp2){
       let [from, to] = gtSelectObjs();
       this._cuList[0] = from.value;
       this._cuList[1] = to.value;
       this._setting[id1] = [idp1];
       this._setting[id2] = [idp2];
    }      
 
    _setSetting2(id1, idp1,id2, idp2) {
       let [to, from] = gtSelectObjs();
       this._cuList[0] = from.value;
       this._cuList[1] = to.value;
       this._setting[id1] = [idp1];
       this._setting[id2] = [idp2];
    } 
    
    _addToSetting(val0, val1){
        this._setting['currency_input_2'].push(Number(val0));
        this._setting['currency_input_1'].push(Number(val1));
    }
    
    async _fetchUrl(url){
        let rst = await fetch(url);
        let rsj = await rst.json();
        return rsj;
    }

    async processInput(event){
           
    let from , to, total;
   if(event.target.id == 'from_currency_select_id'){
       this._setSetting1('currency_input_1', 'from', 'currency_input_2', 'to');
   }
  if(event.target.id == 'to_currency_select_id'){
      this._setSetting2('currency_input_2', 'from', 'currency_input_1', 'to');
   }

    let vl, url,
        rst = this._cuList.join('-'),
        storeVal = await this._indexController.getDB(rst);
    if (!storeVal){
        try {
            url = `/currencies/${rst}`;
            vl = await this._fetchUrl(url);
            if (!vl) {
                throw new Error();
            }
            console.log(vl);
            this._indexController.setDB(rst, vl);
            resetToMsgInnerHtml();
        } catch(e){
            setErrorMsg('tomsg');
            return;
        }       
    } else {      
        vl = storeVal;
        resetToMsgInnerHtml();
    } 
    //console.log(vl);
    let kys = Object.keys(vl);
    //console.log(kys);
    if (kys[0].startsWith(this._cuList[0])){
         total = calConvert(dmap[event.target.id] ,vl[kys[0]]);
         setVal(mmap[event.target.id], total);
        if(this._setting['currency_input_2'][0] == 'from'){
            this._addToSetting(vl[kys[0]],vl[kys[1]]);
        } else{
            this._addToSetting(vl[kys[1]], vl[kys[0]]);
        }
 
    } else if (kys[1].startsWith(this._cuList[0])) {
        total = calConvert(dmap[event.target.id], vl[kys[1]]);
        setVal(mmap[event.target.id], total);
         if(this._setting['currency_input_2'][0] == 'from'){
            this._addToSetting(vl[kys[1]], vl[kys[0]]);     
        } else{
            this._addToSetting(vl[kys[0]],vl[kys[1]]);
        }
    }

    }    
}


const gtCurrencyObjs = ()=>{
    return [document.getElementById('currency_input_1'),
           document.getElementById('currency_input_2')]
}

const gtSelectObjs = ()=>{
    return [document.getElementById('from_currency_select_id'),
        document.getElementById('to_currency_select_id')]
}

const resetToMsgInnerHtml = () => {
    if(document.getElementById('tomsg').innerHTML){
        document.getElementById('tomsg').innerHTML = '';
    }
} 

const setErrorMsg = (id) => {
    document.getElementById(id).innerHTML = `<h3 class="net-warning" >Network is down and you have not converted before with these currencies</h3>`;
}
  
const setVal = (id, val) => document.getElementById(id).value = val;
 
const calConvert = (id, val) => {
    let total = Number(val )*document.getElementById(id).value;
    return Math.round(total * 100) / 100;
}

const selectHMTL = (opts, id) => {
    return `<select id=${id} class="cu_kv Nlt" oninput="Mpick(event)" aria-label="Currency Type">${opts}</select>`;
}

window.MUpdat = function(event){
   let from ,to;
   if (event.target.id == 'currency_input_1'){
       [from, to] = gtCurrencyObjs();
   } 
    else if (event.target.id == 'currency_input_2'){
       [to, from] = gtCurrencyObjs();
    } 
   //trigger computation with all
   mcompute.checkAndCompute(event, from, to);

}

window.Mpick = (event) => mcompute.processInput(event);

window.onload = async function () {
    mcompute = new Compute();
    mcompute.loadAfterHTML();
}


