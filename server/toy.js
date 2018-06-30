var countries = require('./countries.json');
var currencies = require('./currencies.json');


function inside(){
    var res = countries['results'];
    var keys = Object.keys(res);
    //console.log(countries);
    //console.log(currencies);
    //console.log("Bad");
    let i = 0;
    let val; 
    let currencyList = [];
    for(const k of Object.keys(currencies['results'])) {
    val = currencies['results'][k];
    let tmpl = `<option value="${val['id']}">${val['currencyName']}</option>`;
    currencyList.push(tmpl);
    
    if (i > 5) break;
    i++;
    }
    let rst = currencyList.join('');
    console.log(rst);
}

//inside();
