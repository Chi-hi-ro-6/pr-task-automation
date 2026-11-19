// n8n Codeノード「Code in JavaScript13」（ワークフロー: ai-check）

const r = $input.first().json;
const issues = r.issues || [];

let text;
if (r.verdict === 'pass' || issues.length === 0) {
  text = '【HP本番 AIチェック結果】✅ 指摘事項はありません。';
} else {
  const lines = issues.map((i, n) =>
    `${n + 1}. [${i.section}] ${i.rule}\n   該当: ${i.location}\n   修正案: ${i.suggestion}`
  );
  text = `【HP本番 AIチェック結果】⚠️ ${issues.length}件の指摘があります。\n\n` + lines.join('\n\n')
       + '\n\n※形式面の自動チェックです。誤検出の可能性もあるため、最終判断は担当者が行ってください。';
}

return [{ json: { comment_text: text, page_id: r.page_id } }];
