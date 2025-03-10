import { useEffect } from 'react';

/**
 * Custom hook to update document title
 * @param title - The title to set for the document
 * @param prefix - Optional prefix to add before the title
 */
const useDocumentTitle = (title: string, prefix?: string) => {
  useEffect(() => {
    const formattedTitle = prefix ? `${prefix} | ${title}` : title;
    document.title = formattedTitle;
    
    // Reset to original title when component unmounts
    return () => {
      // document.title = originalTitle; // Uncomment if you want to restore original title
    };
  }, [title, prefix]);
};

export default useDocumentTitle; 