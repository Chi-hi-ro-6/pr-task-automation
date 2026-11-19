// n8n Codeノード「renketu」（ワークフロー: ai-check）

const blocks = $input.first().json.results;
const lines = [];

for (const b of blocks) {
  const content = b[b.type];
  const rt = (content && content.rich_text) || [];
  const text = rt.map(t => t.plain_text).join('');

  if (b.type.startsWith('heading')) {
    lines.push('## ' + text);          // 見出しは目印を付ける
  } else if (b.type === 'bulleted_list_item' || b.type === 'numbered_list_item') {
    lines.push('- ' + text);           // 箇条書きも構造を保つ
  } else {
    lines.push(text);                  // 空行はそのまま空行として残す
  }
}

const bodyText = lines.join('\n');

return [{ json: {
  body_text: bodyText,
  char_count: bodyText.length,
  page_id: $('HTTPR').first().json.page_id
}}];
