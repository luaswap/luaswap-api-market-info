# LuaSwap Endpoints

All LuaSwap pairs consist of two different tokens. ETH is not a native currency in LuaSwap, and is represented
only by WETH in the pairs. 

The canonical WETH address used by the LuaSwap interface is `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`. 

## [`/api/coinmarketcap/summary`](https://api.luaswap.org/api/coinmarketcap/summary)

Returns data for the LuaSwap pairs, sorted by reserves. 

### Request

`GET https://api.luaswap.org/api/coinmarketcap/summary`

### Response

```json5
{
  "0x..._0x...": {                  // the asset ids of the ERC20 tokens (i.e. token addresses), joined by an underscore
    "last_price": "1.234",          // denominated in token0/token1
    "base_volume": "123.456",       // last 24h volume denominated in token0
    "quote_volume": "1234.56"       // last 24h volume denominated in token1
  },
  // ...
}
```

## [`/api/coinmarketcap/assets`](https://api.luaswap.org/api/coinmarketcap/assets)

Returns the tokens in the pairs on LuaSwap, sorted by reserves. 

### Request

`GET https://api.luaswap.org/api/coinmarketcap/assets`

### Response

```json5
{
  // ...,
  "0x...": {              // the address of the ERC20 token
    "name": "...",        // not necesssarily included for ERC20 tokens
    "symbol": "...",      // not necesssarily included for ERC20 tokens
    "id": "0x...",        // the address of the ERC20 token
    "maker_fee": "0",     // always 0
    "taker_fee": "0.004", // always 0.004 i.e. 0.4%
  },
  // ...
}
```

## [`/api/coinmarketcap/ticker`](https://api.luaswap.org/api/coinmarketcap/ticker)

Returns ticker data for the LuaSwap pairs, sorted by reserves.

### Request

`GET https://api.luaswap.org/api/coinmarketcap/ticker`

### Response

```json5
{
  "0x..._0x...": {                    // the asset ids of ETH and ERC20 tokens, joined by an underscore
    "base_name": "...",             // token0 name
    "base_symbol": "...",           // token0 symbol
    "base_id": "0x...",             // token0 address
    "quote_name": "...",            // token1 name
    "quote_symbol": "...",          // token1 symbol
    "quote_id": "0x...",            // token1 address
    "last_price": "1.234",          // the mid price as token1/token0
    "base_volume": "123.456",       // denominated in token0
    "quote_volume": "1234.56"       // denominated in token1
  },
  // ...
}
```

## `/api/coinmarketcap/orderbook/:marketPair`

Returns simulated orderbook data for the given LuaSwap pair.
Since LuaSwap has a continuous orderbook, fixed amounts in an interval are chosen for bids and asks, 
and prices are derived from the LuaSwap formula (accounting for both slippage and fees paid to LPs). 

### Request

`GET https://api.luaswap.org/api/coinmarketcap/orderbook/:marketPair`

### URL Parameters

- `marketPair`: The asset ids of two ERC20 tokens, joined by an underscore, e.g. `0x..._0x...`. The first token address is considered the base in the response.

### Response

```json5
{
  "timestamp": 1234567, // UNIX timestamp of the response
  "bids": [
    ["12", "1.2"],      // denominated in base token, quote token/base token
    ["12", "1.1"],      // denominated in base token, quote token/base token
    // ...
  ],
  "asks": [
    ["12", "1.3"],      // denominated in base token, quote token/base token
    ["12", "1.4"],      // denominated in base token, quote token/base token
    // ...
  ]
}
```

## `/api/coinmarketcap/trades/:marketPair`

Returns all swaps in the last 24 hours for the given LuaSwap pair. 

The pair address is the address of the two tokens in either order.
The first address is considered the base in the response.

Note because LuaSwap supports flash swaps and borrowing of both tokens in a pair, you may wish to exclude these 
trade types (types `"???"` and `"borrow-both"`).

### URL Parameters

- `pair`: The asset ids of two ERC20 tokens, joined by an underscore, e.g. `0x..._0x...`. The first token address is considered the base in the response.

### Request

`GET https://api.luaswap.org/coinmarketcap/trades/:marketPair`

### Response

```json5
[
  {
    "trade_id": "...",
    "price": "1.234",           // denominated in quote token/base token
    "base_volume": "123.456",   // denominated in base token
    "quote_volume": "1234.56",  // denominated in quote token
    "trade_timestamp": 1234567, // UNIX timestamp
    "type": "buy"               // "buy"/"sell"/"borrow-both"/"???" 
  },
  // ...
]
```
