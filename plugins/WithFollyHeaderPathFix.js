const { withPodfile } = require('@expo/config-plugins');

const PATCH_MARKER = 'folly_public_headers = \'"${PODS_ROOT}/Headers/Public/RCT-Folly"\'';

const FOLLY_HEADER_PATCH = [
  '    # Xcode 26 + RN 0.83 can miss Folly includes in some React-Fabric compile units.',
  '    # Ensure Folly headers are always on the search path for Pods targets.',
  '    # Also disable fmt consteval in Pods because Xcode 16.3+/26 can fail on fmt 11.0.2.',
  '    installer.pods_project.targets.each do |target|',
  '      target.build_configurations.each do |build_configuration|',
  "        header_search_paths = build_configuration.build_settings['HEADER_SEARCH_PATHS'] || ['$(inherited)']",
  '        header_search_paths = [header_search_paths] unless header_search_paths.is_a?(Array)',
  "        preprocessor_definitions = build_configuration.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] || ['$(inherited)']",
  '        preprocessor_definitions = [preprocessor_definitions] unless preprocessor_definitions.is_a?(Array)',
  '',
  '        folly_public_headers = \'"${PODS_ROOT}/Headers/Public/RCT-Folly"\'',
  '        folly_source_headers = \'"${PODS_ROOT}/RCT-Folly"\'',
  "        fmt_consteval_fix = 'FMT_USE_CONSTEVAL=0'",
  '',
  '        header_search_paths << folly_public_headers unless header_search_paths.include?(folly_public_headers)',
  '        header_search_paths << folly_source_headers unless header_search_paths.include?(folly_source_headers)',
  '        preprocessor_definitions << fmt_consteval_fix unless preprocessor_definitions.include?(fmt_consteval_fix)',
  '',
  "        build_configuration.build_settings['HEADER_SEARCH_PATHS'] = header_search_paths",
  "        build_configuration.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = preprocessor_definitions",
  '      end',
  '    end',
  '',
  "    fmt_inl_path = File.join(installer.sandbox.root.to_s, 'fmt', 'include', 'fmt', 'format-inl.h')",
  '    if File.exist?(fmt_inl_path)',
  '      fmt_inl_contents = File.read(fmt_inl_path)',
  '      fmt_inl_patches = {',
  "        'fmt::format_to(it, FMT_STRING(\"{}{}\"), message, SEP);' => 'fmt::format_to(it, fmt::runtime(\"{}{}\"), message, SEP);',",
  "        'fmt::format_to(it, FMT_STRING(\"{}{}\"), ERROR_STR, error_code);' => 'fmt::format_to(it, fmt::runtime(\"{}{}\"), ERROR_STR, error_code);',",
  "        'FMT_THROW(system_error(errno, FMT_STRING(\"cannot write to file\")));' => 'FMT_THROW(system_error(errno, fmt::runtime(\"cannot write to file\")));',",
  "        'out = fmt::format_to(out, FMT_STRING(\"{:x}\"), value);' => 'out = fmt::format_to(out, fmt::runtime(\"{:x}\"), value);',",
  "        'out = fmt::format_to(out, FMT_STRING(\"{:08x}\"), value);' => 'out = fmt::format_to(out, fmt::runtime(\"{:08x}\"), value);',",
  "        'out = fmt::format_to(out, FMT_STRING(\"p{}\"),' => 'out = fmt::format_to(out, fmt::runtime(\"p{}\"),',",
  "        'FMT_THROW(system_error(errno, FMT_STRING(\"getc failed\")));' => 'FMT_THROW(system_error(errno, fmt::runtime(\"getc failed\")));',",
  "        'FMT_THROW(system_error(errno, FMT_STRING(\"ungetc failed\")));' => 'FMT_THROW(system_error(errno, fmt::runtime(\"ungetc failed\")));',",
  '      }',
  '',
  '      updated_fmt_inl_contents = fmt_inl_contents.dup',
  '      fmt_inl_patches.each do |original_line, patched_line|',
  '        updated_fmt_inl_contents = updated_fmt_inl_contents.gsub(original_line, patched_line)',
  '      end',
  '',
  '      if updated_fmt_inl_contents != fmt_inl_contents',
  '        File.write(fmt_inl_path, updated_fmt_inl_contents)',
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
