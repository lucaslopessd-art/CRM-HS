import { getClient } from './_supabase.mjs';
import { buildInstallments } from './_calc.mjs';

const DEFAULTS = { parcelType:'COMMISSION', parcelPercents:[20,20,20,20,20], chargeback:1.5, rate1:3.5, rate2:3.75, rate3:4.0 };

export default async (req,res)=>{
  const sb = getClient();
  const { id } = req.body?.payload||{};
  if (!sb) return res.json({ok:true, storage:'none'});
  // carrega venda e config
  const { data:deal, error:e1 } = await sb.from('deals').select('*').eq('id',id).single();
  if (e1 || !deal) return res.status(404).json({ok:false,error:'deal not found'});
  const { data:cfgRow } = await sb.from('company_settings').select('*').eq('id',1).single();
  const cfg = { ...DEFAULTS, ...(cfgRow?.config||{}) };
  const calc = buildInstallments(cfg, deal.value);
  // gera parcelas (5 por padrão)
  const rows = (calc.parcels || calc.parcels === undefined) ? calc.parcels : calc.parcels; // safeguard
  const parcels = calc.parcels || calc.parcels === undefined ? calc.parcels : calc.parcels;
  const arr = (calc.parcels || cfg.parcelPercents).map((v,idx)=> ({
    deal_id: id,
    parcel_no: idx+1,
    amount: (calc.parcels ? calc.parcels[idx] : 0),
    base_amount: deal.value,
    commission_rate: calc.rate,
    status: 'FUTURE'
  }));
  const { error:e2 } = await sb.from('commissions').insert(arr);
  if (e2) return res.status(500).json({ok:false,error:e2.message});
  await sb.from('deals').update({stage:'WIN'}).eq('id',id);
  return res.json({ok:true, calc});
}
