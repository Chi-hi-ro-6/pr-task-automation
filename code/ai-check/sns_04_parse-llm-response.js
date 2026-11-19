// n8n Codeノード「Code in JavaScript3」（ワークフロー: ai-check）

const text = $input.first().json.choices[0].message.content;
let result;
try {
  result = JSON.parse(text.replace(/```json|```/g, '').trim());
} catch (e) {
  result = { verdict: 'fail', issues: [{ section: '-', rule: 'AI応答の解析失敗', suggestion: '再実行してください', location: '' }] };
}
result.page_id = $('code').first().json.page_id;
return [{ json: result }];
