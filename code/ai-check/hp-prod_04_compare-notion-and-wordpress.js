// n8n Codeノード「Code in JavaScript7」（ワークフロー: ai-check）

const wpNode = $('Code in JavaScript11');
const wpText = wpNode.first().json.wp_text;
const metaIssues = wpNode.first().json.issues || [];

// Notion原稿から日本語部分のみ抽出（英語セクションの開始で打ち切る）
const notionFull = $input.first().json.notion_text;
const allLines = notionFull.split('\n');
const enIdx = allLines.findIndex(l => /^#*\s*[【\[]?\s*(英語|English)\s*[】\]]?\s*$/.test(l.trim()));
const jpLines = enIdx >= 0 ? allLines.slice(0, enIdx) : allLines;
const notionText = jpLines.join('\n');

// 比較用の正規化：見出し・ラベル行・行頭タグを除外
const clean = (raw) => raw
  .split('\n')
  .map(l => l.trim())
  .filter(l => l)
  .filter(l => !/^#/.test(l))                          // 「# タイトル」「## 見出し」
  .filter(l => !/^[【\[].{1,10}[】\]]\s*$/.test(l))      // 「【日本語】」など単独ラベル行
  .map(l => l.replace(/^(タイトル|本文)[：:]\s*/, ''))     // 「タイトル：」「本文：」接頭辞
  .map(l => l.replace(/^[［\[].{1,10}[］\]]\s*/, ''));    // 「［図キャプション］」などの行頭タグを除去

// 段落の改行位置の違いを吸収するため、行単位ではなく「文」単位に変換して比較する
const toSentences = (lines) => lines
  .join('')                        // 改行（段落の切れ目）を無視して1本に連結
  .split(/(?<=[。！？])/)           // 文末記号の直後で分割
  .map(s => s.trim())
  .filter(s => s);

const norm = s => s.replace(/\s+/g, '').normalize('NFKC').trim();

const wpLines = toSentences(clean(wpText));
const nLines  = toSentences(clean(notionText));

const issues = [...metaIssues];

const missing = nLines.filter(l => !wpLines.some(w => norm(w) === norm(l)));
const extra   = wpLines.filter(l => !nLines.some(n => norm(n) === norm(l)));

missing.forEach(l => issues.push({
  section: '本文', rule: '原稿にあるがHPに無い文章',
  location: l.slice(0, 40), suggestion: '原稿からコピーしてください'
}));
extra.forEach(l => issues.push({
  section: '本文', rule: 'HPにあるが原稿に無い文章',
  location: l.slice(0, 40), suggestion: '原稿と一致しているか確認してください'
}));

return [{ json: {
  verdict: issues.length === 0 ? 'pass' : 'fail',
  issues,
  page_id: $('Switch').first().json.id
}}];
