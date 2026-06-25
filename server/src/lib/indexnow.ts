import axios from 'axios';

export const submitToIndexNow = async (url: string) => {
  try {
    const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
    if (!INDEXNOW_KEY) {
      console.warn('INDEXNOW_KEY not found in environment, skipping ping.');
      return;
    }

    const host = new URL(url).hostname;
    
    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
      urlList: [url]
    };

    console.log(`Submitting URL to IndexNow: ${url}`);
    
    await axios.post('https://api.indexnow.org/IndexNow', payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`Successfully pinged IndexNow for ${url}`);
  } catch (error: any) {
    console.error('Error submitting to IndexNow:', error.message);
  }
};
