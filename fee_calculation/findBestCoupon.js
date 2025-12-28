/**
 * 최적 쿠폰 계산 로직
 * @param {number} baseNetIncome - 쿠폰 미사용 시 최종 수령액
 * @param {number} baseCommission - 할인 전 기본 수수료 (4%)
 * @param {Array} couponData - API로 받아온 쿠폰 시세 및 할인율 객체 배열
 */
function findBestCouponOption(baseNetIncome, baseCommission, couponData) {
  let bestName = "쿠폰 미사용";
  // '쿠폰 미사용'의 추가 이득을 0으로 설정하여 기준점으로 삼음
  let maxAdditionalProfit = 0; 

  couponData.forEach(coupon => {
    // 매물이 없거나 에러인 경우 건너뜀
    if (coupon.price === Infinity || isNaN(coupon.price)) return;

    // 1. 해당 쿠폰으로 절약 가능한 수수료 계산
    const savedCommission = baseCommission * coupon.rate;
    
    // 2. 쿠폰 사용으로 인한 '추가 이득' 계산 (절약 수수료 - 쿠폰 구입비)
    // 이 값이 0보다 커야 쿠폰을 사는 의미가 있음
    const additionalProfit = savedCommission - coupon.price;

    // 3. 추가 이득이 현재까지의 최대치(최소 0 이상)보다 큰 경우 갱신
    if (additionalProfit > maxAdditionalProfit) {
      maxAdditionalProfit = additionalProfit;
      bestName = coupon.name;
    }
  });

  // 최종 수익 = 쿠폰 미사용 시 수익 + 선택된 쿠폰의 추가 이득(마이너스면 0)
  const finalProfit = baseNetIncome + maxAdditionalProfit;

  return { name: bestName, profit: finalProfit };
}

module.exports = findBestCouponOption; // 함수 내보내기