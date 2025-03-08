// This service manages the connections to the imgBB API
// The actual image hosting is on imgBB (https://nikesh-bawankar.imgbb.com/albums)
// We store the image URLs in Firebase

import { updateProductImageUrl } from './productService';

const IMGBB_ALBUM_URL = import.meta.env.VITE_IMGBB_API_URL;

/**
 * This function doesn't actually upload to imgBB through API calls
 * since we're storing images manually on imgBB.
 * 
 * Instead, it implements the connection between Firebase product data
 * and the manually uploaded imgBB images.
 * 
 * In a real production application, we would use the imgBB API directly.
 */
export const linkProductToImgBBImage = async (
  productId: string, 
  imageName: string, 
  imageExtension: string = 'jpg'
): Promise<string> => {
  try {
    // Construct the URL where the image should be located on imgBB
    // This assumes a specific naming convention for images on imgBB
    const imageUrl = `${IMGBB_ALBUM_URL}/${productId}_${imageName}.${imageExtension}`;
    
    // Update the product's image URL in Firebase
    await updateProductImageUrl(productId, imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error('Error linking product to imgBB image:', error);
    throw error;
  }
};

/**
 * This function would validate that an image exists at the given URL
 * In a real implementation, we would make a HEAD request to check
 */
export const validateImageUrl = async (imageUrl: string): Promise<boolean> => {
  try {
    // In a real implementation, we would do:
    // const response = await fetch(imageUrl, { method: 'HEAD' });
    // return response.ok;
    
    // For now, we'll assume the URL is valid if it contains the imgBB domain
    return imageUrl.includes('imgbb.com');
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
};

export default {
  linkProductToImgBBImage,
  validateImageUrl
}; 