// n8n Codeノード「２週間前の投稿か判断」（ワークフロー: two-week-notice）

for (const item of items) {
  const dueDateStr = item.json.DueDate;
  if (!dueDateStr) {
    item.json.isTarget = false;
    continue;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fourteenDaysLater = new Date(today);
  fourteenDaysLater.setDate(today.getDate() + 14);
  
  const targetStr = new Date(dueDateStr).toISOString().split('T')[0];
  const target14Str = fourteenDaysLater.toISOString().split('T')[0];
  
  // ここを修正：オブジェクトの中の .name を見るように変更
  const statusName = item.json.Status_Content?.name || ""; 
  
  // 「作業前」または「空白」を対象にするならこう
  const isPending = (statusName === "作業前" || statusName === "");
  
  item.json.isTarget = (targetStr === target14Str && isPending);
}
return items.filter(item => item.json.isTarget === true);
