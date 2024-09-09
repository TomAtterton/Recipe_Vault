// @ts-nocheck
const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const { mergeContents } = require('@expo/config-plugins/build/utils/generateCode');
const fs = require('fs');
const path = require('path');

// Utility to read the file
async function readFileAsync(filePath) {
  return fs.promises.readFile(filePath, 'utf8');
}

// Utility to write content to a file
async function saveFileAsync(filePath, content) {
  return fs.promises.writeFile(filePath, content, 'utf8');
}

// Function to disable AD ID support (from the second snippet)
function disableAdIDSupport(src) {
  return mergeContents({
    tag: `fix-build`,
    src,
    newSrc: `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings["ONLY_ACTIVE_ARCH"] = "NO"
      end
    end`,
    anchor: /post_install/,
    offset: 1,
    comment: '#',
  }).contents;
}

// Function to handle both changes (IQKeyboardManager and AD ID support)
const withCustomPodfileModifications = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let contents = await readFileAsync(podfilePath);

      // Remove any existing IQKeyboardManagerSwift line (if present) to avoid duplicates
      contents = contents.replace(
        /pod 'IQKeyboardManagerSwift', :git => 'https:\/\/github.com\/douglasjunior\/IQKeyboardManager.git', :branch => 'react-native-keyboard-manager'\n\n/g,
        '',
      );

      // Re-add the IQKeyboardManagerSwift pod line
      contents = `pod 'IQKeyboardManagerSwift', :git => 'https://github.com/douglasjunior/IQKeyboardManager.git', :branch => 'react-native-keyboard-manager'\n\n${contents}`;

      // Apply the Ad ID support modification
      contents = disableAdIDSupport(contents);

      // Save the modified Podfile
      await saveFileAsync(podfilePath, contents);

      return config;
    },
  ]);
};

// Export the plugin with both modifications
module.exports = (config) => withPlugins(config, [withCustomPodfileModifications]);
