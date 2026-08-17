import fs from 'fs';
import path from 'path';

const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

async function main() {
  console.log('🔍 Connexion à l\'API Supabase Management avec le jeton personnel...');

  const headers = {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  try {
    // 1. Lister les projets Supabase de l'utilisateur
    const projectsRes = await fetch('https://api.supabase.com/v1/projects', { headers });
    if (!projectsRes.ok) {
      const err = await projectsRes.text();
      console.error(`❌ Erreur récupération projets (${projectsRes.status}):`, err);
      return;
    }

    const projects = await projectsRes.json();
    console.log(`✅ ${projects.length} projet(s) Supabase trouvé(s):`);
    projects.forEach((p, idx) => {
      console.log(`  [${idx + 1}] ID: ${p.id} | Nom: ${p.name} | Région: ${p.region} | Statut: ${p.status}`);
    });

    if (projects.length === 0) {
      console.log('⚠️ Aucun projet trouvé dans le compte Supabase.');
      return;
    }

    // Prendre le projet actif ou le premier
    const activeProject = projects.find(p => p.status === 'ACTIVE_HEALTHY') || projects[0];
    const projectRef = activeProject.id;
    console.log(`\n👉 Utilisation du projet: ${activeProject.name} (${projectRef})`);

    // 2. Récupérer les clés API du projet
    const apiKeysRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/api-keys`, { headers });
    let anonKey = '';
    let serviceKey = '';

    if (apiKeysRes.ok) {
      const keys = await apiKeysRes.json();
      console.log(`✅ ${keys.length} clés API récupérées:`);
      keys.forEach(k => {
        console.log(`  - ${k.name} : ${k.api_key.slice(0, 15)}...`);
        if (k.name === 'anon') anonKey = k.api_key;
        if (k.name === 'service_role') serviceKey = k.api_key;
      });
    } else {
      console.warn('⚠️ Impossible de récupérer les clés via api-keys endpoint, statut:', apiKeysRes.status);
    }

    const supabaseUrl = `https://${projectRef}.supabase.co`;

    // 3. Mettre à jour .env.local
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = `# ==============================================================================
# FacturaPro - Variables d'Environnement Supabase
# ==============================================================================

# Jeton d'accès Supabase (Personal Access Token)
SUPABASE_ACCESS_TOKEN=${ACCESS_TOKEN}

# URL de votre projet Supabase
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}

# Clé API Anonyme publique Supabase (Anon Key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}

# Clé Secrète de Service Supabase
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}
`;

    fs.writeFileSync(envPath, envContent, 'utf-8');
    console.log(`\n💾 Fichier .env.local mis à jour avec:`);
    console.log(`  - URL: ${supabaseUrl}`);
    console.log(`  - Anon Key: ${anonKey ? anonKey.slice(0, 20) + '...' : '(vide)'}`);

    // 4. Exécuter le schéma SQL (001_initial_schema.sql) sur la base de données
    const schemaPath = path.resolve(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('\n🚀 Application de la migration 001_initial_schema.sql sur Supabase...');
      const sqlQuery = fs.readFileSync(schemaPath, 'utf-8');

      const queryRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: sqlQuery }),
      });

      if (queryRes.ok) {
        console.log('✅ Schéma SQL exécuté avec succès sur Supabase PostgreSQL !');
        console.log('   Toutes les tables, clés étrangères, RLS et triggers ont été créés.');
      } else {
        const queryErr = await queryRes.text();
        console.warn(`⚠️ Exécution SQL via API (${queryRes.status}):`, queryErr);
      }
    }

    console.log('\n🎉 Configuration Supabase terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:', error);
  }
}

main();
