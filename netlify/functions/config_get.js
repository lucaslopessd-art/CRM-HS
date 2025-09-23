import { getClient } from './_supabase.mjs';

const DEFAULTS = {
  parcelType: 'COMMISSION',
  parcelPercents: [20,20,20,20,20],
  chargeback: 1.5, // % sobre base até 8ª
  rate1: 3.5,
  rate2: 3.75,
  rate3: 4.0
};

export default async (req, res) => {
  const sb = getClient();
  if (!sb) return res.json(DEFAULTS);
  const { data, error } = await sb.from('company_settings').select('*').eq('id', 1).single();
  if (error || !data) return res.json(DEFAULTS);
  const cfg = { ...DEFAULTS, ...(data.config||{}) };
  return res.json(cfg);
}
