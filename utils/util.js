// 格式化富文本内容
function formatRichText(html) {
  if (!html) {
      return html
  }
  let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
      match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
      match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
      match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
      return match;
  });
  newContent = html.replace(/<table[^>]*>/gi, function(match, captrue) {
    match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
    return match
  })
  newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
      match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
      return match;
  });
  newContent = newContent.replace(/<br[^>]*\/>/gi, '');
  newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block;margin-top:0;margin-bottom:0;"');
  return newContent;
}

module.exports = {
  formatRichText
}
