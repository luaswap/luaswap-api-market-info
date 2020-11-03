const BigNumber = require('bignumber.js')

function getAmountOut(
  amountIn,
  reservesIn,
  reservesOut)  {
  const amountOut = amountIn.eq(0)
    ? new BigNumber(0)
    : reservesOut.minus(reservesOut.multipliedBy(reservesIn).dividedBy(reservesIn.plus(amountIn.multipliedBy(0.996))))
  return {
    amountOut,
    reservesInAfter: reservesIn.plus(amountIn),
    reservesOutAfter: reservesOut.minus(amountOut)
  }
}

function getAmountIn(
  amountOut,
  reservesIn,
  reservesOut) {
  const amountIn = amountOut.eq(0)
    ? new BigNumber(0)
    : amountOut.isGreaterThanOrEqualTo(reservesOut)
    ? new BigNumber(Infinity)
    : reservesIn
        .multipliedBy(reservesOut)
        .dividedBy(reservesOut.minus(amountOut)) // reserves in after
        .minus(reservesIn) // minus reserves in
        .dividedBy(0.996) // fee

  return {
    amountIn,
    reservesInAfter: reservesIn.plus(amountIn),
    reservesOutAfter: reservesOut.minus(amountOut)
  }
}

module.exports = function computeBidsAsks(
  baseReserves,
  quoteReserves,
  numSegments = 200) {
  if (baseReserves.eq(0) || quoteReserves.eq(0)) {
    return {
      bids: [],
      asks: []
    }
  }

  // we don't do exactly 100 segments because we do not care about the trade that takes exact out of entire reserves
  const increment = baseReserves.dividedBy(numSegments + 1)
  const baseAmounts = Array.from({ length: numSegments }, (x, i) => increment.multipliedBy(i))

  const bids = baseAmounts.map((buyBaseAmount) => {
    const { reservesInAfter: baseReservesBefore, reservesOutAfter: quoteReservesBefore } = getAmountOut(
      buyBaseAmount,
      baseReserves,
      quoteReserves
    )
    const { amountOut } = getAmountOut(increment, baseReservesBefore, quoteReservesBefore)
    return [amountOut.dividedBy(increment).toString(), increment.toString()]
  })

  const asks = baseAmounts.map((sellBaseAmount) => {
    const { reservesInAfter: baseReservesBefore, reservesOutAfter: quoteReservesBefore } = getAmountIn(
      sellBaseAmount,
      quoteReserves,
      baseReserves
    )
    const { amountIn } = getAmountIn(increment, baseReservesBefore, quoteReservesBefore)
    return [amountIn.dividedBy(increment).toString(), increment.toString()]
  })

  return {
    bids,
    asks
  }
}
