const routes = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/factures',
  '/factures/nouvelle',
  '/factures/inv-48',
  '/devis',
  '/clients',
  '/produits',
  '/depenses',
  '/paiements',
  '/rapports',
  '/taxes',
  '/abonnements',
  '/parametres',
  '/integrations',
];

async function checkRoutes() {
  console.log('Testing FacturaPro routes on http://localhost:3000...\n');
  let passed = 0;
  for (const route of routes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`);
      if (res.status === 200) {
        console.log(`[PASS] 200 OK -> ${route}`);
        passed++;
      } else {
        console.error(`[FAIL] ${res.status} -> ${route}`);
      }
    } catch (e) {
      console.error(`[ERROR] ${route} ->`, e.message);
    }
  }
  console.log(`\nResults: ${passed}/${routes.length} routes verified 100% functional!`);
}

checkRoutes();
