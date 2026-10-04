// Validate shape without printing credentials. This does not prove project ownership.
const isHttps = value => { try { const u = new URL(value); return u.protocol === 'https:' && !!u.hostname && !u.username && !u.password && !u.search && !u.hash; } catch { return false; } };
function validateReleaseConfig(env, projectId) {
  const errors = [];
  if (!isHttps(env.EXPO_PUBLIC_SUPABASE_URL)) errors.push('EXPO_PUBLIC_SUPABASE_URL must be a production HTTPS URL.');
  const key = env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
  let mobileSafe = /^sb_publishable_[A-Za-z0-9_-]+$/.test(key) && !/replace|placeholder|your_/i.test(key);
  if (!mobileSafe && key.split('.').length === 3) {
    try { mobileSafe = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role === 'anon'; } catch { /* not a legacy anon key */ }
  }
  if (!mobileSafe) errors.push('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be a publishable or legacy anon key. Secret/service-role keys are forbidden.');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId || '')) errors.push('Link the WORKIT EAS project ID before creating a production build.');
  if (env.EXPO_PUBLIC_API_URL && !isHttps(env.EXPO_PUBLIC_API_URL)) errors.push('EXPO_PUBLIC_API_URL must use HTTPS when overridden.');
  if (errors.length) throw new Error('WORKIT production configuration is incomplete:\n' + errors.join('\n'));
}
module.exports = { validateReleaseConfig };
if (require.main === module) {
  const config = require('../app.json').expo;
  validateReleaseConfig(process.env, process.env.EXPO_PUBLIC_EAS_PROJECT_ID || config.extra?.eas?.projectId);
  console.log('Production configuration shape passed. Verify project ownership, credentials and device QA separately.');
}
