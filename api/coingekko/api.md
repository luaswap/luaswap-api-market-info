# V2 Endpoints

All LuaSwap pairs consist of two different tokens. ETH is not a native currency in Luaswap, and is represented
only by WETH in the pairs. 

The canonical WETH address used by the Luaswap interface is `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`. 

## [`/api/coingekko/pairs`](https://api.luaswap.org/api/coingekko/pairs)

Returns data for Luaswap pairs, sorted by reserves. 

### Request

`GET https://api.luaswap.org/api/coingekko/pairs`

### Response

```json5
[
   {
      "ticker_id":"0x2baecdf43734f22fd5c152db08e3c27233f0c7d2_0xb1f66997a5760428d3a87d68b90bfe0ae64121cc",
      "base":"OM",
      "target":"LUA"
   },
   {
      "ticker_id":"0x05d3606d5c81eb9b7b18530995ec9b29da05faba_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "base":"TOMOE",
      "target":"WETH"
   },
   //...
]
```


## [`/api/coingekko/tickers`](https://api.luaswap.org/api/coingekko/tickers)

Return data for 24-hour pricing and volume information on each market pair available on an LuaSwap

### Request

`GET https://api.luaswap.org/api/coingekko/tickers`

### Response

```json5
[
   {
      "ticker_id":"0x2260fac5e5542a773aa44fbcfedf7c193bc2c599_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      "base_currency":"WBTC",
      "target_currency":"USDC",
      "last_price":"13417.87763614859085762055",
      "base_volume":"1.76943914",
      "target_volume":"23915.199825",
      "bid":"0",
      "ask":"0",
      "high":"0",
      "low":"0"
   },
   // ...
]
```

## `/api/coingekko/orderbook`

Return data for order book information

### URL Parameters

- `ticker_id`: (Required) The asset ids of two ERC20 tokens, joined by an underscore, e.g. `0x..._0x...`. The first token address is considered the base in the response.

- `depth`: (Optional) Orders depth quantity: [0, 100, 200, 500...]. 0 returns full depth. Depth = 100 means 50 for each bid/ask side.

### Request

`GET https://api.luaswap.org/api/coingekko/orderbook?ticker_id=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_0xdac17f958d2ee523a2206206994597c13d831ec7&depth=10`

### Response

```json5
{
   "ticker_id":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_0xdac17f958d2ee523a2206206994597c13d831ec7",
   "timestamp":1604378876768,
   "bids":[
      [
         "4.66622234950507263645",
         "346.71267840838022675504"
      ],
      [
         "4.66622234950507263645",
         "293.46256251863515653324"
      ],
      //...
   ],
   "asks":[
      [
         "4.66622234950507263645",
         "419.2639322538073176393"
      ],
      [
         "4.66622234950507263645",
         "512.62078285382956284312"
      ],
      //...
   ]
}
```

## `/api/coingekko/historical_trades`

Return data on historical completed trades for a given market pair

### URL Parameters

- `ticker_id`: (Required) The asset ids of two ERC20 tokens, joined by an underscore, e.g. `0x..._0x...`. The first token address is considered the base in the response.

- `type`: (Required) buy or sell

- `limit`: (Optional) Number of historical trades to retrieve from time of query. [0, 200, 500...]. 0 returns full history.

### Request

`GET https://api.luaswap.org/api/coingekko/historical_trades?ticker_id=0x05d3606d5c81eb9b7b18530995ec9b29da05faba_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&type=buy&limit=100`

### Response

```json5
{
   "buy":[
      {
         "trade_id":"0x9983de989127bf061b2e0124ef65890e036b5545ad95ef89c10388fd76021f8c-0",
         "type":"buy",
         "trade_timestamp":"1604324645",
         "base_volume":"10000",
         "target_volume":"14.203116686900176481",
         "price":"0.00142031166869001765"
      },
      {
         "trade_id":"0x77a74900d6d14608b5a95be4027c133a7a551d79e7129cdac8d57980b62cc845-0",
         "type":"buy",
         "trade_timestamp":"1604320729",
         "base_volume":"10000",
         "target_volume":"14.047396464423666029",
         "price":"0.0014047396464423666"
      },
      // ...
   ]
}
```
