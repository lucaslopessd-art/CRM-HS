export default async (req,res)=>{
  return res.json({
    ok:true,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || ''
  });
}
