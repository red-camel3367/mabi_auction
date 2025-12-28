const fetchMabiAPI = require('../util/fetchauctionAPI'); // 가져오기

function getCouponMarketData() {
  const coupons = [
    { name: '경매장 수수료 10% 할인 쿠폰', rate: 0.1 },
    { name: '경매장 수수료 20% 할인 쿠폰', rate: 0.2 },
    { name: '경매장 수수료 30% 할인 쿠폰', rate: 0.3 },
    { name: '경매장 수수료 50% 할인 쿠폰', rate: 0.5 },
    { name: '경매장 수수료 100% 할인 쿠폰', rate: 1.0 }
  ];

  return coupons.map(coupon => {
    const listData = fetchMabiAPI("auction/list", coupon.name);
    let lowestPrice = Infinity;

    if (listData && listData.auction_item && listData.auction_item.length > 0) {
      lowestPrice = listData.auction_item.reduce((min, cur) => 
        cur.auction_price_per_unit < min ? cur.auction_price_per_unit : min, 
        listData.auction_item[0].auction_price_per_unit
      );
    }
    await(100);
    // Utilities.sleep(100); // API 부하 방지, GAS 환경에서 필요시 사용

    return { ...coupon, price: lowestPrice };
  });
}

module.exports = getCouponMarketData; // 함수 내보내기
