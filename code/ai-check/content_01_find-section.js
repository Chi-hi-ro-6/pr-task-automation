// n8n Codeノード「Code in JavaScript2」（ワークフロー: ai-check）

const sectionName = 'コンテンツ';   // コンテンツ用の分岐にコピーするときは 'コンテンツ' に変える
const norm = s => s.trim().normalize('NFKC');

const blocks = $input.first().json.results;

const target = blocks.find(b => {
  const rt = (b[b.type] && b[b.type].rich_text) || [];
  const text = rt.map(t => t.plain_text).join('');
  return b.has_children && norm(text).startsWith(norm(sectionName));
});

if (!target) {
  throw new Error(sectionName + ' セクションが見つかりません');
}

return [{ json: { block_id: target.id, page_id: target.parent.page_id } }];
