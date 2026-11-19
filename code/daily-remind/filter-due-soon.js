// n8n Codeノード「２週間前の投稿か判断」（ワークフロー: daily-remind）

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
  fourteenDaysLater.setDate(today.getDate() + 14);
  
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
  // 1. ぴったり14日後 (今回はリマインド対象外にするため、フラグとしてはfalse固定か、判定だけ残す)
  item.json.isTargetExact = (taskDateStr === target14Str && isPending);
  
  // 2. 【変更】2週間以内（14日後ぴったりを含めない＝13日後まで）かつ過ぎていない
  // 「<= fourteenDaysLater」 から 「< fourteenDaysLater」 に変更
  item.json.isTargetRange = (taskDate >= today && taskDate < fourteenDaysLater && isPending);
}

// 【変更】2週間以内（ぴったりを除く）の条件に合致するものだけを通す
// 「item.json.isTargetExact」の条件を削除
return items.filter(item => item.json.isTargetRange);
