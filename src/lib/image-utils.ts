/**
 * Image Utilities for UnblockedGamesZone
 * Handles on-the-fly WebP conversion and resizing via proxy.
 */

export const getOptimizedImage = (url: string, width: number = 400): string => {
  if (!url) return "/placeholder.svg";
  
  // Remove protocol to avoid double prefixing and handle https
  const cleanUrl = url.replace(/^(http|https):\/\//, '');
  
  // wsrv.nl parameters:
  // url: original image URL (without protocol)
  // w: width in pixels
  // q: quality (80 is optimal for WebP)
  // output: force webp format
  // il: progressive/interlaced loading
  // n: -1 (disable default cache to ensure freshness if needed, or omit for best caching)
  return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=${width}&q=80&output=webp&il`;
};
