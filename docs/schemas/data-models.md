# Data Models

This document outlines the core data schemas used within the Portfolio Manager application.

## Portfolio

The portfolio is the top-level container for all user investment data.

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "baseCurrency": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "accounts": ["Account"],
  "totalValue": "number",
  "targetAllocation": {
    "assetClass": {
      "stocks": "number",
      "bonds": "number",
      "cash": "number",
      "alternatives": "number"
    },
    "region": {
      "northAmerica": "number",
      "europe": "number",
      "asiaPacific": "number",
      "emergingMarkets": "number"
    }
  }
}
```

## Account

An account represents a specific investment account (e.g., brokerage account, retirement account).

```json
{
  "id": "string",
  "name": "string",
  "type": "enum(brokerage, retirement, bank, other)",
  "institution": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "assets": ["Asset"],
  "totalValue": "number",
  "accountNumber": "string",
  "notes": "string"
}
```

## Asset

An asset represents a specific investment holding.

```json
{
  "id": "string",
  "ticker": "string",
  "name": "string",
  "assetType": "enum(stock, bond, etf, mutualFund, cash, crypto, realEstate, other)",
  "quantity": "number",
  "costBasis": "number",
  "currentPrice": "number",
  "currentValue": "number",
  "currency": "string",
  "purchaseDate": "date",
  "lastUpdated": "date",
  "metadata": {
    "sector": "string",
    "industry": "string",
    "assetClass": "string",
    "region": "string",
    "riskLevel": "number",
    "dividendYield": "number"
  },
  "notes": "string",
  "transactions": ["Transaction"]
}
```

## Transaction

Records of buys, sells, dividends, and other activities.

```json
{
  "id": "string",
  "assetId": "string",
  "type": "enum(buy, sell, dividend, split, transfer, fee)",
  "date": "date",
  "quantity": "number",
  "price": "number",
  "totalAmount": "number",
  "fees": "number",
  "currency": "string",
  "notes": "string"
}
```

## Performance Record

Historical performance data points for analysis.

```json
{
  "portfolioId": "string",
  "date": "date",
  "totalValue": "number",
  "deposits": "number",
  "withdrawals": "number",
  "returns": {
    "daily": "number",
    "weekly": "number",
    "monthly": "number",
    "ytd": "number",
    "annually": "number",
    "allTime": "number"
  },
  "breakdown": {
    "byAsset": [
      {
        "assetId": "string",
        "value": "number",
        "return": "number"
      }
    ],
    "byAssetClass": [
      {
        "class": "string",
        "value": "number",
        "return": "number"
      }
    ],
    "bySector": [
      {
        "sector": "string",
        "value": "number",
        "return": "number"
      }
    ]
  }
}
```

## Financial Goal

Track progress towards specific financial goals.

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "targetAmount": "number",
  "targetDate": "date",
  "currentAmount": "number",
  "linkedAccounts": ["string"],
  "contributions": [
    {
      "date": "date",
      "amount": "number"
    }
  ],
  "status": "enum(active, completed, abandoned)",
  "priority": "enum(high, medium, low)"
}
```

## User Settings

Application preferences and settings.

```json
{
  "userId": "string",
  "displayCurrency": "string",
  "theme": "string",
  "notifications": {
    "priceAlerts": "boolean",
    "performanceReports": "boolean",
    "dividends": "boolean"
  },
  "dataRefreshRate": "number",
  "defaultPortfolioId": "string",
  "privacySettings": {
    "anonymizeData": "boolean",
    "shareDataForAnalytics": "boolean"
  }
}
```

## Data Relationships

```
Portfolio 1:n Account 1:n Asset 1:n Transaction
Portfolio 1:n PerformanceRecord
User 1:n Portfolio
User 1:1 UserSettings
User 1:n FinancialGoal
```

## Schema Evolution Strategy

As the application evolves, these schemas will need to be extended. The following principles should be followed:

1. Maintain backward compatibility where possible
2. Use versioning for significant schema changes
3. Implement migration strategies for existing data
4. Document all schema changes