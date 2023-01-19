var MatomoTracker = require('matomo-tracker');

// Initialize with your site ID and Matomo URL
var matomo = new MatomoTracker(2, 'https://analytics.hlrm.xyz/matomo.php');

// Optional: Respond to tracking errors
matomo.on('error', function(err) {
  console.log('error tracking request: ', err);
});

export const tracker = matomo;
