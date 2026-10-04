// EAS assigns this ID. Never ship a placeholder or another project's ID.
module.exports = ({ config }) => {
  const projectId = (process.env.EXPO_PUBLIC_EAS_PROJECT_ID || config.extra?.eas?.projectId || process.env.EAS_BUILD_PROJECT_ID)?.trim();
  if (projectId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) {
    throw new Error('EXPO_PUBLIC_EAS_PROJECT_ID must be the UUID from your WORKIT EAS project.');
  }
  if (process.env.EAS_BUILD_PROJECT_ID && projectId?.toLowerCase() !== process.env.EAS_BUILD_PROJECT_ID.trim().toLowerCase()) {
    throw new Error('Configured project ID does not match the EAS build project.');
  }
  if (process.env.EAS_BUILD_PROFILE === 'production' || process.env.WORKIT_BUILD_TARGET === 'production') {
    require('./scripts/release-config.cjs').validateReleaseConfig(process.env, projectId);
  }
  return {
    ...config,
    ...(projectId ? { extra: { ...config.extra, eas: { ...config.extra?.eas, projectId } } } : {}),
  };
};
