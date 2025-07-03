// src/lib/notion.js
import { Client } from '@notionhq/client';
import 'dotenv/config';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: '2022-06-28',
});
const pageId = process.env.NOTION_PAGE_ID;

export async function getNotionPage() {
  try {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_PAGE_ID) {
      throw new Error('Missing NOTION_API_KEY or NOTION_PAGE_ID');
    }
    const page = await notion.pages.retrieve({ page_id: pageId });
    const title = page.properties.title?.title[0]?.plain_text || 'Untitled';

    const blocks = await notion.blocks.children.list({ block_id: pageId });
    const content = blocks.results
      .map((block) => {
        // Text Blocks
        if (block.type === 'paragraph' && block.paragraph?.rich_text.length > 0) {
          return block.paragraph.rich_text.map((text) => text.plain_text).join('');
        }
        if (block.type === 'heading_1' && block.heading_1?.rich_text.length > 0) {
          return `# ${block.heading_1.rich_text.map((text) => text.plain_text).join('')}`;
        }
        if (block.type === 'heading_2' && block.heading_2?.rich_text.length > 0) {
          return `## ${block.heading_2.rich_text.map((text) => text.plain_text).join('')}`;
        }
        if (block.type === 'heading_3' && block.heading_3?.rich_text.length > 0) {
          return `### ${block.heading_3.rich_text.map((text) => text.plain_text).join('')}`;
        }
        if (block.type === 'bulleted_list_item' && block.bulleted_list_item?.rich_text.length > 0) {
          return `- ${block.bulleted_list_item.rich_text.map((text) => text.plain_text).join('')}`;
        }
        if (block.type === 'numbered_list_item' && block.numbered_list_item?.rich_text.length > 0) {
          return `1. ${block.numbered_list_item.rich_text.map((text) => text.plain_text).join('')}`;
        }
        if (block.type === 'to_do' && block.to_do?.rich_text.length > 0) {
          const checked = block.to_do.checked ? '[x]' : '[ ]';
          return `${checked} ${block.to_do.rich_text.map((text) => text.plain_text).join('')}`;
        }
        if (block.type === 'toggle' && block.toggle?.rich_text.length > 0) {
          return `> ${block.toggle.rich_text.map((text) => text.plain_text).join('')}`;
        }
        if (block.type === 'quote' && block.quote?.rich_text.length > 0) {
          return `> ${block.quote.rich_text.map((text) => text.plain_text).join('')}`;
        }
        if (block.type === 'callout' && block.callout?.rich_text.length > 0) {
          const icon = block.callout.icon?.emoji || 'ℹ️';
          return `${icon} ${block.callout.rich_text.map((text) => text.plain_text).join('')}`;
        }
        if (block.type === 'code' && block.code?.rich_text.length > 0) {
          const codeText = block.code.rich_text.map((text) => text.plain_text).join('');
          const language = block.code.language || 'plaintext';
          return `\`\`\`${language}\n${codeText}\n\`\`\``;
        }

        // Non-Text Blocks
        if (block.type === 'image') {
          const url = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
          const caption = block.image.caption?.map((text) => text.plain_text).join('') || 'Image';
          return `![${caption}](${url})`;
        }
        if (block.type === 'video') {
          const url = block.video.type === 'external' ? block.video.external.url : block.video.file.url;
          return `[Video](${url})`; // Could use HTML <video> if rendering directly
        }
        if (block.type === 'file') {
          const url = block.file.type === 'external' ? block.file.external.url : block.file.file.url;
          const name = block.file.caption?.map((text) => text.plain_text).join('') || 'File';
          return `[${name}](${url})`;
        }
        if (block.type === 'audio') {
          const url = block.audio.type === 'external' ? block.audio.external.url : block.audio.file.url;
          return `[Audio](${url})`; // Could use HTML <audio>
        }
        if (block.type === 'embed' || block.type === 'pdf' || block.type === 'bookmark') {
          const url = block[block.type].url;
          return `[${block.type.charAt(0).toUpperCase() + block.type.slice(1)}](${url})`;
        }
        if (block.type === 'table') {
          // Simplified table rendering (requires fetching table_row children)
          return '[Table: See full implementation for rows]';
        }
        if (block.type === 'divider') {
          return '---';
        }
        if (block.type === 'equation') {
          return `$${block.equation.expression}$`;
        }
        if (block.type === 'breadcrumb') {
          return '[Breadcrumb]';
        }
        if (block.type === 'column_list') {
          return '[Column List]'; // Requires nested column handling
        }
        if (block.type === 'column') {
          return '[Column]'; // Nested within column_list
        }
        if (block.type === 'synced_block') {
          return block.synced_block.synced_from ? '[Synced Block Reference]' : '[Original Synced Block]';
        }
        if (block.type === 'child_page') {
          return `[Child Page: ${block.child_page.title}]`;
        }
        if (block.type === 'child_database') {
          return `[Database: ${block.child_database.title || block.id}]`;
        }
        if (block.type === 'link_to_page') {
          const type = block.link_to_page.type;
          const id = block.link_to_page[type];
          return `[Link to ${type.replace('_id', '')}: ${id}]`;
        }
        if (block.type === 'link_preview') {
          return `[Link Preview: ${block.link_preview.url}]`;
        }
        if (block.type === 'template') {
          return '[Template Button]';
        }
        if (block.type === 'unsupported') {
          return '[Unsupported Block]';
        }

        return ''; // Fallback for unhandled types
      })
      .filter(Boolean)
      .join('\n');

    return {
      id: page.id,
      slug: page.id.replace(/-/g, ''),
      title,
      content,
      pubDate: page.created_time,
    };
  } catch (error) {
    throw error;
  }
}