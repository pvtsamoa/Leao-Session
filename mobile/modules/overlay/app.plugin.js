const { withAndroidManifest, withAppBuildGradle, withMainApplication } = require('@expo/config-plugins');

function withOverlayPermission(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults;
    const permissions = manifest.manifest['uses-permission'] || [];
    const already = permissions.some((p) => p.$?.['android:name'] === 'android.permission.SYSTEM_ALERT_WINDOW');
    if (!already) {
      permissions.push({ $: { 'android:name': 'android.permission.SYSTEM_ALERT_WINDOW' } });
      manifest.manifest['uses-permission'] = permissions;
    }
    return cfg;
  });
}

function withOverlayGradle(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (!cfg.modResults.contents.includes('expo-overlay')) {
      cfg.modResults.contents = cfg.modResults.contents.replace(
        /dependencies\s*\{/,
        `dependencies {\n    implementation project(':expo-overlay')`
      );
    }
    return cfg;
  });
}

function withOverlayMainApplication(config) {
  return withMainApplication(config, (cfg) => {
    const src = cfg.modResults.contents;
    if (!src.includes('OverlayPackage')) {
      cfg.modResults.contents = src
        .replace(
          /import expo\.modules\.ReactNativeHostWrapper/,
          `import expo.modules.ReactNativeHostWrapper\nimport expo.modules.overlay.OverlayPackage`
        )
        .replace(
          /PackageList\(this\)\.packages/,
          `PackageList(this).packages.also { it.add(OverlayPackage()) }`
        );
    }
    return cfg;
  });
}

module.exports = (config) => {
  config = withOverlayPermission(config);
  config = withOverlayGradle(config);
  config = withOverlayMainApplication(config);
  return config;
};
