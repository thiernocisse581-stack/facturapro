import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

console.log('====================================================');
console.log(' FacturaPro - Diagnostic Supabase');
console.log('====================================================');
console.log(`Access Token : ${SUPABASE_ACCESS_TOKEN ? SUPABASE_ACCESS_TOKEN.substring(0, 8) + '...' : 'Non défini'}`);
console.log(`Project URL  : ${SUPABASE_URL || '(Non défini dans .env.local)'}`);
console.log(`Anon Key     : ${SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.substring(0, 15) + '...' : '(Non défini)'}`);
console.log('====================================================\n');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('ℹ️  Supabase URL ou Anon Key non configuré.');
  console.log('   Renseignez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   dans .env.local ou directement dans la page Passerelles & Intégrations (/integrations).\n');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  try {
    console.log('Test de connexion à la table organizations...');
    const { data, error } = await supabase.from('organizations').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('❌ Erreur Supabase:', error.message);
      process.exit(1);
    }
    console.log('✅ Connexion Supabase réussie et tables détectées !');
  } catch (e) {
    console.error('❌ Échec:', e.message);
  }
}

check();
