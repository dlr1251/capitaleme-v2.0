// Calculate reading time from Notion blocks
export function calculateReadingTime(blocks: any[]): number {
  let totalWords = 0;
  
  // Recursive function to process blocks and their children
  function processBlocks(blockList: any[]) {
    blockList.forEach(block => {
      // Count words in different block types
      switch (block.type) {
        case 'paragraph':
          if (block.paragraph?.rich_text) {
            totalWords += countWordsInRichText(block.paragraph.rich_text);
          }
          break;
        case 'heading_1':
        case 'heading_2':
        case 'heading_3':
        case 'heading_4':
        case 'heading_5':
        case 'heading_6':
          if (block[block.type]?.rich_text) {
            totalWords += countWordsInRichText(block[block.type].rich_text);
          }
          break;
        case 'bulleted_list_item':
          if (block.bulleted_list_item?.rich_text) {
            totalWords += countWordsInRichText(block.bulleted_list_item.rich_text);
          }
          break;
        case 'numbered_list_item':
          if (block.numbered_list_item?.rich_text) {
            totalWords += countWordsInRichText(block.numbered_list_item.rich_text);
          }
          break;
        case 'quote':
          if (block.quote?.rich_text) {
            totalWords += countWordsInRichText(block.quote.rich_text);
          }
          break;
        case 'callout':
          if (block.callout?.rich_text) {
            totalWords += countWordsInRichText(block.callout.rich_text);
          }
          break;
        case 'toggle':
          if (block.toggle?.rich_text) {
            totalWords += countWordsInRichText(block.toggle.rich_text);
          }
          break;
        case 'to_do':
          if (block.to_do?.rich_text) {
            totalWords += countWordsInRichText(block.to_do.rich_text);
          }
          break;
        case 'code':
          if (block.code?.rich_text) {
            totalWords += countWordsInRichText(block.code.rich_text);
          }
          break;
        case 'table_of_contents':
          // Skip TOC blocks as they don't contribute to reading time
          break;
        case 'divider':
        case 'image':
        case 'video':
        case 'file':
        case 'pdf':
        case 'bookmark':
        case 'equation':
          // These blocks don't have text content
          break;
        default:
          // For any other block types, try to extract text if possible
          if (block[block.type]?.rich_text) {
            totalWords += countWordsInRichText(block[block.type].rich_text);
          }
      }
      
      // Process children blocks recursively
      if (block.children && Array.isArray(block.children)) {
        processBlocks(block.children);
      }
    });
  }
  
  processBlocks(blocks);
  
  // Average reading speed is about 200-250 words per minute
  // Using 225 words per minute as a reasonable average
  const wordsPerMinute = 225;
  const readingTimeMinutes = Math.ceil(totalWords / wordsPerMinute);
  
  // Return at least 1 minute, or the calculated time
  return Math.max(1, readingTimeMinutes);
}

// Helper function to count words in rich text array
function countWordsInRichText(richText: any[]): number {
  if (!Array.isArray(richText)) return 0;
  
  let totalWords = 0;
  richText.forEach((textItem: any) => {
    if (textItem.plain_text) {
      // Split by whitespace and count non-empty strings
      const words = textItem.plain_text.trim().split(/\s+/);
      totalWords += words.filter((word: string) => word.length > 0).length;
    }
  });
  
  return totalWords;
}

// Alternative function for calculating reading time from plain text
export function calculateReadingTimeFromText(text: string): number {
  if (!text) return 1;
  
  const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0);
  const wordsPerMinute = 225;
  const readingTimeMinutes = Math.ceil(words.length / wordsPerMinute);
  
  return Math.max(1, readingTimeMinutes);
} 