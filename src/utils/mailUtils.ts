import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { openURL } from 'expo-linking';

export const handleMail = async ({
  headerText,
  errorMessage,
}: {
  headerText?: string;
  errorMessage?: string;
}) => {
  try {
    const appVersion = Constants.expoConfig?.version || 'Unknown version';
    const deviceModel = Device.modelName || 'Unknown model';
    const osName = Constants.platform?.ios ? 'iOS' : 'Android';
    const osVersion = Device.osVersion || 'Unknown OS Version';

    const deviceInfo = `Device: ${deviceModel} \nPlatform: ${osName} \nOS Version: ${osVersion}`;

    const subject = encodeURIComponent('Error Report');
    const body = encodeURIComponent(`
      ${headerText ? `${headerText}\n\n` : ''}
      ${errorMessage ? `Error Message: ${errorMessage}` : ''}
      App Version: ${appVersion}
      Device Info: ${deviceInfo}
    `);

    // Attempt to open the mail client
    const emailURL = `mailto:hello@tomatterton.com?subject=${subject}&body=${body}`;
    const canOpen = await openURL(emailURL);

    if (!canOpen) {
      console.error('Failed to open mail client');
      alert('Unable to open the mail client. Please try again later.');
    }
  } catch (err) {
    console.error('Error while handling report: ', err);
    alert('An error occurred while attempting to report the issue.');
  }
};
