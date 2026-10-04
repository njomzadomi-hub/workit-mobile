const assert = require('node:assert/strict');
const { validateReleaseConfig } = require('./release-config.cjs');
const id = '11111111-2222-4333-8444-555555555555'; // Test fixture only.
const valid = { EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_synthetic_fixture' };
assert.doesNotThrow(() => validateReleaseConfig(valid, id));
assert.throws(() => validateReleaseConfig({}, undefined));
for (const key of ['sb_secret_synthetic_fixture','sb_publishable_REPLACE_ME','', 'bad.key']) assert.throws(() => validateReleaseConfig({...valid, EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:key},id));
const legacy = role => `synthetic.${Buffer.from(JSON.stringify({role})).toString('base64url')}.synthetic`;
assert.throws(() => validateReleaseConfig({...valid,EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:legacy('service_role')},id));
assert.doesNotThrow(() => validateReleaseConfig({...valid,EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:legacy('anon')},id));
for (const value of ['http://example.supabase.co','https://user:password@example.test','https://example.test?token=synthetic']) assert.throws(() => validateReleaseConfig({...valid,EXPO_PUBLIC_SUPABASE_URL:value},id));
assert.throws(() => validateReleaseConfig({...valid,EXPO_PUBLIC_API_URL:'http://example.test'},id));
assert.throws(() => validateReleaseConfig(valid,'placeholder'));
const buildConfig = require('../app.config'); const original = process.env.EAS_BUILD_PROFILE;
try { process.env.EAS_BUILD_PROFILE='production';assert.throws(() => buildConfig({config:{name:'WORKIT'}})); } finally { if(original===undefined)delete process.env.EAS_BUILD_PROFILE;else process.env.EAS_BUILD_PROFILE=original; }
console.log('Production config: missing/placeholder/secret keys, invalid project ID, unsafe URLs and production build guard checked. Test IDs/keys never enter app config.');
