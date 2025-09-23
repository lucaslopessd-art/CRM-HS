// _calc.mjs — regras de comissão
export function commissionRateByAmount(amount, cfg){
  const a = Number(amount||0);
  if (a >= 500000) return cfg.rate3 ?? 4.0;
  if (a >= 300000) return cfg.rate2 ?? 3.75;
  return cfg.rate1 ?? 3.5;
}

/**
 * Calcula parcelas
 * @param {{parcelType:'COMMISSION'|'BASE', parcelPercents:number[], chargeback:number}} cfg 
 * @param {number} amount valor base da venda
 */
export function buildInstallments(cfg, amount){
  const rate = commissionRateByAmount(amount, cfg);
  const base = Number(amount||0);
  const type = cfg.parcelType || 'COMMISSION';
  const perc = (cfg.parcelPercents && cfg.parcelPercents.length? cfg.parcelPercents : [20,20,20,20,20]);
  let parcels = [];
  if (type === 'BASE'){
    // cada número é % do valor base
    parcels = perc.map(p => round2(base * (p/100)));
  } else {
    // cada número é % da comissão total
    const totalCommission = base * (rate/100);
    parcels = perc.map(p => round2(totalCommission * (p/100)));
  }
  return {rate, parcels, totalCommission: round2(base * (rate/100))};
}

export function round2(x){ return Math.round(Number(x||0)*100)/100; }
