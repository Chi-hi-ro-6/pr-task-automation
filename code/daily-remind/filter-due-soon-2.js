// n8n Codeノード「２週間前の投稿か判断1」（ワークフロー: daily-remind）

// 事前チェック用：対象記事が1件でもあるかどうかだけを判定する
let hasTarget = false;

for (const item of items) {
  const dueDateStr = item.json.DueDate;
  if (!dueDateStr) continue;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fourteenDaysLater = new Date(today);
  fourteenDaysLater.setDate(today.getDate() + 14);

  const taskDate = new Date(dueDateStr);
  taskDate.setHours(0, 0, 0, 0);

  const statusName = item.json.Status_Content?.name || "";
  const isPending = (statusName === "作業前" || statusName === "");

  const isTargetRange = (taskDate >= today && taskDate < fourteenDaysLater && isPending);

  if (isTargetRange) {
    hasTarget = true;
    break; // 1件見つかれば十分なのでループを抜ける
  }
}

// 件数に関わらず必ず1アイテムだけ返す
return [{ json: { hasTarget } }];
