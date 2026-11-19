// n8n Codeノード「code1」（ワークフロー: ai-check）

// チェックリストのブロックをテキスト化
const ruleBlocks = $input.first().json.results;
const ruleLines = [];
for (const b of ruleBlocks) {
  const c = b[b.type];
  const rt = (c && c.rich_text) || [];
  const text = rt.map(t => t.plain_text).join('');
  if (b.type.startsWith('heading')) ruleLines.push('## ' + text);
  else if (b.type.includes('list_item')) ruleLines.push('- ' + text);
  else ruleLines.push(text);
}
const rules = ruleLines.join('\n');

// 本文をテキスト連結ノードから取得（★コピー後の実際のノード名に置き換える）
const body = $('renketu1').first().json.body_text;
const pageId = $('renketu1').first().json.page_id;

const prompt = `あなたは研究室の広報物の校正担当です。以下のチェックリストに基づき、対象文章を確認してください。

# 重要な制約
- チェックリストのルール違反、および明白な誤字脱字・タイプミス・文法誤り・表記ゆれを指摘する（誤字脱字はチェックリストに記載がなくても指摘してよい）
- 内容の良し悪しや文章の好みには言及しない
- 対象文章は研究紹介記事であり、日本語版と英語版が含まれる。それぞれに該当するルールを適用すること
- 日本語版と英語版で、数値・研究内容・結論が一致しているかを確認すること
- 指摘は必ず対象文章に実在する箇所に対して行い、ルール名は指摘内容と一致させること。判断に迷う場合は指摘しない

# チェックリスト
${rules}

# 対象文章
${body}

# 出力形式
以下のJSON形式のみで出力すること。
{
  "verdict": "pass" または "fail",
  "issues": [
    { "section": "どの部分か（例: 日本語版、英語版）", "location": "該当箇所の引用（20字程度）", "rule": "違反したルール", "suggestion": "修正案" }
  ]
}
issuesが空なら verdict は pass。`;

return [{ json: { prompt, page_id: pageId } }];
