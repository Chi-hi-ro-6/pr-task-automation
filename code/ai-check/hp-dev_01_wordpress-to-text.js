// n8n Codeノード「Code in JavaScript8」（ワークフロー: ai-check）

const post = $input.first().json;
const html = (post.content && post.content.rendered) || '';
const title = (post.title && post.title.rendered) || '';

const text = html
  .replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, '\n［図キャプション］$1\n')
  .replace(/<\/(p|div|h[1-6]|li)>/gi, '\n')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const issues = [];
if (!post.featured_media) {
  issues.push({ section: '記事設定', rule: 'アイキャッチ画像が未設定', location: '-', suggestion: 'アイキャッチ画像を設定してください' });
}
if (!post.categories || post.categories.length === 0) {
  issues.push({ section: '記事設定', rule: 'カテゴリが未設定', location: '-', suggestion: 'カテゴリを設定してください' });
}
/**const imgsNoAlt = [...html.matchAll(/<img(?![^>]*\balt=)[^>]*>/gi)];
if (imgsNoAlt.length > 0) {
  issues.push({ section: '本文', rule: `alt属性のない画像が${imgsNoAlt.length}件`, location: '-', suggestion: '画像にalt属性を設定してください' });
}**/

return [{ json: {
  wp_text: `# タイトル\n${title}\n\n# 本文\n${text}`,
  wp_title: title,
  issues
}}];
