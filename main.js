const fetchMabiAPI = require('./util/fetchauctionAPI'); // 가져오기

/**
 * 스프레드 시트, GAS 용 기본 골자
 * A3:A21의 아이템을 조회하여 C3:C21에 최저가
 */
function updateAuctionPrices() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange("A3:A21");
  const names = range.getValues();
  const results = [];

  for (let i = 0; i < names.length; i++) {
    const itemName = names[i][0].trim();
    
    if (!itemName) {
      results.push([""]);
      continue;
    }

    try {
      // 1. 현재 경매장 매물 조회 (List API)
      const listData = fetchMabiAPI("auction/list", itemName);
      
      if (listData && listData.auction_item && listData.auction_item.length > 0) {
        // 제공하신 findLowestPriceItem 로직: 최저가 아이템 찾기
        const lowestPriceItem = listData.auction_item.reduce((lowest, current) => 
            current.auction_price_per_unit < lowest.auction_price_per_unit ? current : lowest
        );
        
        // C열에 '최저가' 입력 (필요 시 평균가 등 다른 정보와 조합 가능)
        results.push([lowestPriceItem.auction_price_per_unit]);
      } else {
        results.push(["매물 없음"]);
      }
    } catch (e) {
      console.error(itemName + " 조회 오류: " + e.message);
      results.push(["에러"]);
    }
    await(150);   
    // Utilities.sleep(150); // API 부하 방지 // GAS 환경에서 필요시 사용
  }

  // 결과 일괄 입력
  sheet.getRange("C3:C21").setValues(results);
}

