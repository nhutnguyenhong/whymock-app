export const download = (content, fileName) => {
  const c = "data:text/json;charset=utf-8," + content;
  var encodedUri = encodeURI(c);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName + ".json");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const _getHashId = () => uuidv4();

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
