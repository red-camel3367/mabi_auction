require('dotenv').config();
const NEXON_API_KEY = process.env.NEXON_API_KEY; // API 키

/**
 * 넥슨 API 호출 공통 함수 (UrlFetchApp 사용)
 */
function fetchMabiAPI(endpoint, itemName) {
  const url = `https://open.api.nexon.com/mabinogi/v1/${endpoint}?item_name=${encodeURIComponent(itemName)}`;
  const options = {
    "method": "get",
    "headers": {
      "accept": "application/json",
      "x-nxopen-api-key": NEXON_API_KEY
    },
    "muteHttpExceptions": true
  };

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) return null;
  
  return JSON.parse(response.getContentText());
}
module.exports = fetchMabiAPI; // 함수 내보내기