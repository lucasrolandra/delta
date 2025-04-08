let taxasConfig;

fetch('taxas.json')
  .then(response => response.json())
  .then(data => taxasConfig = data)
  .catch(error => console.error('Erro ao carregar taxas:', error));

function calcularValorFinal() {
  var valorBase = parseFloat(document.getElementById('valorBase').value);
  var parcelas = parseInt(document.getElementById('parcelas').value);
  var bandeira = document.getElementById('bandeira').value;
  var taxaTransacao = 0;
  var taxaParcelamento = 0;

  if (isNaN(valorBase) || valorBase <= 0 || isNaN(parcelas) || parcelas <= 0) {
    alert('Por favor, insira valores válidos.');
    return;
  }

  const config = taxasConfig[bandeira] || taxasConfig["default"];
  taxaParcelamento = config.taxaParcelamento || 0;

  if (config.taxas) {
    if (parcelas === 1) {
      taxaTransacao = config.taxas["1"];
    } else if (parcelas >= 2 && parcelas <= 6) {
      taxaTransacao = config.taxas["2-6"];
    } else if (parcelas >= 7 && parcelas <= 12) {
      taxaTransacao = config.taxas["7-12"];
    }
  } else {
    taxaTransacao = config.taxaTransacao;
  }

  var valorMenosTaxaTransacao = valorBase - (valorBase * taxaTransacao);
  var valorParcelaSemAntecipacao = valorMenosTaxaTransacao / parcelas;

  var valorTotalAntecipado = 0;
  for (var i = 1; i <= parcelas; i++) {
    var valorParcelaAntecipada = valorParcelaSemAntecipacao - (valorParcelaSemAntecipacao * (taxaParcelamento * i));
    valorTotalAntecipado += valorParcelaAntecipada;
  }

  var valorCobradoCliente = valorBase / (valorTotalAntecipado / valorBase);
  var valorParcelaComTaxas = valorCobradoCliente / parcelas;
  let jurosadicionados = (valorCobradoCliente / valorBase) - 1;

  document.getElementById('resultado').innerHTML = 'Valor final: R$ ' + valorCobradoCliente.toFixed(2) + '<br>' +
    'Valor de cada parcela: R$ ' + valorParcelaComTaxas.toFixed(2) + '<br>' +
    'Juros adicionados: ' + (jurosadicionados * 100).toFixed(2) + '%<br>' +
    'Valor antecipado sem repasse: R$ ' + valorTotalAntecipado.toFixed(2);
}
