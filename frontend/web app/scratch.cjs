const https = require('https');
https.get('https://play.google.com/store/apps/details?id=com.razorpay.payments.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/property="og:image"\s+content="(https:\/\/[^"]+)"/);
    if (match) console.log(match[1]);
  });
});
