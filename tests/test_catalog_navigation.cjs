const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const api = require(path.resolve(__dirname,'../docs/javascripts/sj-catalog.js'));
const records = [
  {id:'rf01102',name:'Logar usuário',inMvp:true},
  {id:'rf03503',name:'Excluir vídeo enviado',inMvp:false},
  {id:'rf03501',name:'Enviar vídeo de execução',inMvp:true}
];
test('o retorno contextual aceita somente consultas internas do catálogo',()=>{
  assert.equal(typeof api.referenceHref,'function');
  assert.equal(api.referenceHref('../regras_negocio/#rn01','rf01102'),'../regras_negocio/?origem=rf01102#rn01');
  assert.equal(api.referenceHref('../criterios_aceitacao/#ca-us02','rf01102'),'../criterios_aceitacao/?origem=rf01102#ca-us02');
  assert.equal(api.referenceHref('https://example.com/#rn01','rf01102'),'https://example.com/#rn01');
  assert.equal(api.referenceHref('../regras_negocio/#rn01','../../outra-pagina'),'../regras_negocio/#rn01');
});
test('o índice do MVP consulta as fichas marcadas sem manter outra seleção',()=>{
  assert.equal(typeof api.mvpLinks,'function','Índice por hiperlinks ainda ausente');
  assert.deepEqual(api.mvpLinks(records),[
    {href:'#rf01102',label:'RF01102 · Logar usuário'},
    {href:'#rf03501',label:'RF03501 · Enviar vídeo de execução'}
  ]);
  assert.deepEqual(api.mvpLinks([]),[]);
});
test('uma alteração na ficha aparece no índice na próxima geração',()=>{
  assert.equal(typeof api.mvpLinks,'function');
  assert.deepEqual(api.mvpLinks([{id:'rf02301',name:'Planejar <treino> & revisar',inMvp:true}]),[
    {href:'#rf02301',label:'RF02301 · Planejar <treino> & revisar'}
  ]);
});
test('endereços diretos aceitam IDs codificados e não falham em fragmento inválido',()=>{
  assert.equal(typeof api.targetId,'function');
  assert.equal(api.targetId('#us01a'),'us01a');
  assert.equal(api.targetId('#rf03501'),'rf03501');
  assert.equal(api.targetId('#t%C3%ADtulo'),'título');
  assert.equal(api.targetId('#%'),null);
  assert.equal(api.targetId(''),null);
});
