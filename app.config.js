// EAS assigns this ID. Never ship a placeholder or another project's ID.
module.exports = ({ config }) => {
  const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || config.extra?.eas?.projectId;
  if (projectId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) {
    throw new Error('EXPO_PUBLIC_EAS_PROJECT_ID must be the UUID from your WORKIT EAS project.');
  }
  return {
    ...config,
    ...(projectId ? { extra: { ...config.extra, eas: { ...config.extra?.eas, projectId } } } : {}),
  };
};
