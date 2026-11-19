// n8n Codeノード「２週間以内の投稿か」（ワークフロー: notify-content）

for (const item of items) {
  const dueDateStr = item.json.DueDate;
  if (!dueDateStr) {
    item.json.isTargetExact = false;
    item.json.isTargetRange = false;
    continue;
  }
  
  // 基準日（今日）
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 14日後の基準
  const fourteenDaysLater = new Date(today);
  fourteenDaysLater.setDate(today.getDate() + 14); // 必要ならここで +15 に調整
  
  // Notionの期限日
  const taskDate = new Date(dueDateStr);
  taskDate.setHours(0, 0, 0, 0);
  
  // 文字列比較用
  const target14Str = fourteenDaysLater.toISOString().split('T')[0];
  const taskDateStr = taskDate.toISOString().split('T')[0];
  
  // ステータス判定
  const statusName = item.json.Status_Content?.name || "";
  const isPending = (statusName === "作業前" || statusName === "");
  
  // 判定フラグ
  // 1. ぴったり14日後 (📣)
  item.json.isTargetExact = (taskDateStr === target14Str && isPending);
  
  // 2. 2週間以内かつ過ぎていない (🧐/👨‍💻)
  item.json.isTargetRange = (taskDate >= today && taskDate <= fourteenDaysLater && isPending);
}

// どちらかの条件に合致するものだけを通す
return items.filter(item => item.json.isTargetExact || item.json.isTargetRange);
