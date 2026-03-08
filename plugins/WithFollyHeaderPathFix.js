const { withPodfile } = require('@expo/config-plugins');

const PATCH_MARKER = 'folly_public_headers = \'"${PODS_ROOT}/Headers/Public/RCT-Folly"\'';

const FOLLY_HEADER_PATCH = [
  '    # Xcode 26 + RN 0.83 can miss Folly includes in some React-Fabric compile units.',
  '    # Ensure Folly headers are always on the search path for Pods targets.',
  '    installer.pods_project.targets.each do |target|',
  '      target.build_configurations.each do |build_configuration|',
  "        header_search_paths = build_configuration.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']",
  '        header_search_paths = [header_search_paths] unless header_search_paths.is_a?(Array)',
  '',
  '        folly_public_headers = \'"${PODS_ROOT}/Headers/Public/RCT-Folly"\'',
  '        folly_source_headers = \'"${PODS_ROOT}/RCT-Folly"\'',
  '',
  '        header_search_paths << folly_public_headers unless header_search_paths.include?(folly_public_headers)',
  '        header_search_paths << folly_source_headers unless header_search_paths.include?(folly_source_headers)',
  '',
  "        build_configuration.build_settings['HEADER_SEARCH_PATHS'] = header_search_paths",
  '      end',
  '    end',
].join('\n');

function injectFollyHeaderPatch(podfileContents) {
  if (podfileContents.includes(PATCH_MARKER)) {
    return podfileContents;
  }

  const insertionToken = '    )\n  end';

  if (!podfileContents.includes(insertionToken)) {
    throw new Error(
      'Unable to apply Folly header path patch: expected react_native_post_install block was not found.'
    );
  }

  return podfileContents.replace(
    insertionToken,
    `    )\n\n${FOLLY_HEADER_PATCH}\n  end`
  );
}

module.exports = function withFollyHeaderPathFix(config) {
  return withPodfile(config, (modConfig) => {
    modConfig.modResults.contents = injectFollyHeaderPatch(modConfig.modResults.contents);
    return modConfig;
  });
};
