// n8n Codeノード「code」（ワークフロー: ai-check）

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

// SNS本文を、テキスト連結ノードから取得（ノード名は実際のものに置き換え）
const body = $('renketu').first().json.body_text;
const pageId = $('renketu').first().json.page_id;

const prompt = `あなたは研究室の広報物の校正担当です。以下のチェックリストに基づき、対象文章を確認してください。

# 重要な制約
- チェックリストのルール違反と、明白な誤字脱字・文法誤りのみを指摘する
- 内容の良し悪しや文章の好みには言及しない
- 対象文章には複数のSNS向け原稿（X/LinkedIn用・Instagram用、日本語・英語）が含まれる。見出しごとに該当するルールを適用すること
- チェックリストに【例・要確認】と書かれた項目は、まだ仮のルールなので参考程度に扱う
- チェックリストのルール違反に加え、明白な誤字脱字・タイプミス・文法誤り・表記ゆれは、チェックリストに記載がなくても指摘する

# チェックリスト
${rules}

# 対象文章
${body}

# 出力形式
以下のJSON形式のみで出力すること。
{
  "verdict": "pass" または "fail",
  "issues": [
    { "section": "どの原稿か（例: Instagram用 日本語）", "location": "該当箇所の引用（20字程度）", "rule": "違反したルール", "suggestion": "修正案" }
  ]
}
issuesが空なら verdict は pass。`;

return [{ json: { prompt, page_id: pageId, body_len: (body || '').length, rules_len: (rules || '').length } }];
//return [{ json: { prompt, page_id: pageId } }];
