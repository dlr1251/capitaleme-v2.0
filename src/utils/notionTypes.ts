// Unified Notion API Types for robust, type-safe handling

// --- Rich Text ---
export type NotionRichText = {
  type: 'text';
  text: {
    content: string;
    link?: { url: string } | null;
  };
  plain_text: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  href?: string;
};

// --- Properties ---
export type NotionTitleProperty = {
  type: 'title';
  title: NotionRichText[];
};
export type NotionRichTextProperty = {
  type: 'rich_text';
  rich_text: NotionRichText[];
};
export type NotionSelectProperty = {
  type: 'select';
  select: { name: string; color?: string } | null;
};
export type NotionCheckboxProperty = {
  type: 'checkbox';
  checkbox: boolean;
};
export type NotionDateProperty = {
  type: 'date';
  date: { start: string; end?: string } | null;
};
export type NotionFilesProperty = {
  type: 'files';
  files: Array<{
    name: string;
    type: 'external' | 'file';
    external?: { url: string };
    file?: { url: string; expiry_time: string };
  }>;
};

export type NotionProperty =
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionSelectProperty
  | NotionCheckboxProperty
  | NotionDateProperty
  | NotionFilesProperty
  | { type: string; [key: string]: any };

// --- Page ---
export type NotionPage = {
  id: string;
  url: string;
  properties: Record<string, NotionProperty>;
  last_edited_time: string;
  created_time?: string;
  object: 'page';
  icon?: { type: 'emoji'; emoji: string };
};

// --- Block Types ---
export type NotionBlockBase = {
  id: string;
  type: string;
  has_children?: boolean;
  children?: NotionBlock[];
  [key: string]: any;
};

export type ParagraphBlock = NotionBlockBase & {
  type: 'paragraph';
  paragraph: { rich_text: NotionRichText[]; color?: string };
};
export type Heading1Block = NotionBlockBase & {
  type: 'heading_1';
  heading_1: { rich_text: NotionRichText[]; color?: string };
};
export type Heading2Block = NotionBlockBase & {
  type: 'heading_2';
  heading_2: { rich_text: NotionRichText[]; color?: string };
};
export type Heading3Block = NotionBlockBase & {
  type: 'heading_3';
  heading_3: { rich_text: NotionRichText[]; color?: string };
};
export type BulletedListItemBlock = NotionBlockBase & {
  type: 'bulleted_list_item';
  bulleted_list_item: { rich_text: NotionRichText[] };
};
export type NumberedListItemBlock = NotionBlockBase & {
  type: 'numbered_list_item';
  numbered_list_item: { rich_text: NotionRichText[] };
};
export type ToDoBlock = NotionBlockBase & {
  type: 'to_do';
  to_do: { rich_text: NotionRichText[]; checked: boolean };
};
export type ToggleBlock = NotionBlockBase & {
  type: 'toggle';
  toggle: { rich_text: NotionRichText[] };
};
export type QuoteBlock = NotionBlockBase & {
  type: 'quote';
  quote: { rich_text: NotionRichText[] };
};
export type CalloutBlock = NotionBlockBase & {
  type: 'callout';
  callout: { rich_text: NotionRichText[]; icon?: { type: 'emoji'; emoji: string } };
};
export type CodeBlock = NotionBlockBase & {
  type: 'code';
  code: { rich_text: NotionRichText[]; language: string };
};
export type ImageBlock = NotionBlockBase & {
  type: 'image';
  image: { type: 'external' | 'file'; external?: { url: string }; file?: { url: string }; caption?: NotionRichText[] };
};
export type VideoBlock = NotionBlockBase & {
  type: 'video';
  video: { type: 'external' | 'file'; external?: { url: string }; file?: { url: string }; caption?: NotionRichText[] };
};
// ... add more block types as needed

export type NotionBlock =
  | ParagraphBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | BulletedListItemBlock
  | NumberedListItemBlock
  | ToDoBlock
  | ToggleBlock
  | QuoteBlock
  | CalloutBlock
  | CodeBlock
  | ImageBlock
  | VideoBlock
  | NotionBlockBase; // fallback for unknown types

// --- Type Guards ---
export function isBlockWithChildren(block: NotionBlock): block is NotionBlock & { has_children: true; children: NotionBlock[] } {
  return !!block.has_children && Array.isArray(block.children);
}

export function isParagraphBlock(block: NotionBlock): block is ParagraphBlock {
  return block.type === 'paragraph';
}
export function isHeading1Block(block: NotionBlock): block is Heading1Block {
  return block.type === 'heading_1';
}
export function isHeading2Block(block: NotionBlock): block is Heading2Block {
  return block.type === 'heading_2';
}
export function isHeading3Block(block: NotionBlock): block is Heading3Block {
  return block.type === 'heading_3';
}
// ... add more type guards as needed

// --- Utility: Render Rich Text (for Astro/JSX) ---
export function renderRichText(richText: NotionRichText[]): string {
  return richText.map((item) => {
    let content = item.text.content;
    let className = '';
    if (item.annotations?.bold) className += 'font-bold ';
    if (item.annotations?.italic) className += 'italic ';
    if (item.annotations?.strikethrough) className += 'line-through ';
    if (item.annotations?.underline) className += 'underline ';
    if (item.annotations?.code) className += 'font-mono bg-gray-100 px-1 rounded ';
    if (item.annotations?.color && item.annotations.color !== 'default') className += `text-${item.annotations.color}-600 `;
    if (item.href) {
      return `<a href="${item.href}" class="${className}">${content}</a>`;
    }
    return `<span class="${className}">${content}</span>`;
  }).join('');
}

// --- Export all types for use in API and components --- 