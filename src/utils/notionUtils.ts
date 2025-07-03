export type RichTextItem = {
  type: 'text';
  text: {
    content: string;
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

export function renderRichText(richText: RichTextItem[]) {
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