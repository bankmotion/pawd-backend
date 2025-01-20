export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms * 1000));
};

export const getTokenPriceByPriceBunch = (
  prices: number[][],
  targetTimestamp: number
) => {
  if (!prices.length) return 0;

  let beforeTime = prices[0][0];
  let curTime = prices[0][0];

  for (const [timestamp, price] of prices) {
    curTime = Math.floor(timestamp / 1000);
    if (curTime > targetTimestamp) {
      break;
    }
    beforeTime = curTime;
  }
  const correctTime =
    Math.abs(beforeTime - targetTimestamp) > Math.abs(curTime - targetTimestamp)
      ? curTime
      : beforeTime;

  const price = prices.find(
    ([tempTime, tempPrice]) => Math.floor(tempTime / 1000) === correctTime
  )![1];

  return price;
};
