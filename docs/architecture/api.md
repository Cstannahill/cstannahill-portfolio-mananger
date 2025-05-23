# API Documentation

This document outlines the API endpoints and integration points for the Portfolio Manager application.

## Core API Endpoints

### Portfolio Management

#### Get All Portfolios

```
GET /api/portfolios
```

Returns all portfolios belonging to the current user.

Response:
```json
{
  "portfolios": [
    {
      "id": "string",
      "name": "string",
      "totalValue": "number",
      "lastUpdated": "date"
    }
  ]
}
```

#### Get Portfolio Details

```
GET /api/portfolios/{portfolioId}
```

Returns detailed information for a specific portfolio.

Response:
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "baseCurrency": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "accounts": [
    // Account objects
  ],
  "totalValue": "number",
  "targetAllocation": {
    // Allocation object
  }
}
```

#### Create New Portfolio

```
POST /api/portfolios
```

Request:
```json
{
  "name": "string",
  "description": "string",
  "baseCurrency": "string",
  "targetAllocation": {
    // Allocation object
  }
}
```

#### Update Portfolio

```
PUT /api/portfolios/{portfolioId}
```

Request:
```json
{
  "name": "string",
  "description": "string",
  "baseCurrency": "string",
  "targetAllocation": {
    // Allocation object
  }
}
```

### Asset Management

#### Get Assets by Account

```
GET /api/accounts/{accountId}/assets
```

Returns all assets within a specific account.

#### Add Asset

```
POST /api/accounts/{accountId}/assets
```

Request:
```json
{
  "ticker": "string",
  "name": "string",
  "assetType": "string",
  "quantity": "number",
  "costBasis": "number",
  "purchaseDate": "date"
}
```

#### Update Asset

```
PUT /api/assets/{assetId}
```

Request:
```json
{
  "quantity": "number",
  "currentPrice": "number",
  "metadata": {
    // Asset metadata
  }
}
```

### Transaction Management

#### Get Transactions by Asset

```
GET /api/assets/{assetId}/transactions
```

Returns all transactions for a specific asset.

#### Record New Transaction

```
POST /api/assets/{assetId}/transactions
```

Request:
```json
{
  "type": "string",
  "date": "date",
  "quantity": "number",
  "price": "number",
  "totalAmount": "number",
  "fees": "number",
  "notes": "string"
}
```

### Performance Analytics

#### Get Portfolio Performance

```
GET /api/portfolios/{portfolioId}/performance?period=1m&interval=daily
```

Returns performance data for a specific time period and interval.

Response:
```json
{
  "startDate": "date",
  "endDate": "date",
  "interval": "string",
  "dataPoints": [
    {
      "date": "date",
      "value": "number",
      "change": "number",
      "percentageChange": "number"
    }
  ],
  "summary": {
    "totalReturn": "number",
    "percentageReturn": "number",
    "annualizedReturn": "number"
  }
}
```

## External API Integrations

### Market Data

The application integrates with the following market data providers:

1. **Financial Data API**
   - Purpose: Real-time and historical market data
   - Endpoints: TBD based on selected provider
   - Authentication: API key-based

2. **News API**
   - Purpose: Financial news relevant to portfolio holdings
   - Endpoints: TBD based on selected provider
   - Authentication: API key-based

3. **Fundamental Data API**
   - Purpose: Company financial data and metrics
   - Endpoints: TBD based on selected provider
   - Authentication: API key-based

### Integration Architecture

All external API integrations follow a common pattern:

1. **API Adapters**: Standardize responses from different providers
2. **Caching Layer**: Minimize redundant API calls
3. **Rate Limiting**: Respect API provider limits
4. **Fallback Mechanisms**: Handle API outages gracefully
5. **Credential Management**: Secure storage of API keys

## Authentication and Authorization

The API uses JWT (JSON Web Tokens) for authentication. All API requests (except authentication endpoints) must include a valid token in the Authorization header:

```
Authorization: Bearer {jwt_token}
```

### Authentication Endpoints

#### Login

```
POST /api/auth/login
```

Request:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "refreshToken": "string",
  "expiresIn": "number"
}
```

#### Refresh Token

```
POST /api/auth/refresh
```

Request:
```json
{
  "refreshToken": "string"
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Common error codes:
- `400`: Bad Request - Invalid input parameters
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server-side issues

## Rate Limiting

API requests are rate-limited to prevent abuse. Limits are as follows:
- 100 requests per minute per user
- 1000 requests per hour per user

When rate limits are exceeded, the API will respond with a 429 Too Many Requests status code.

## Versioning

The API is versioned to ensure backward compatibility. The current version is accessible at:

```
/api/v1/...
```

Future versions will be accessible at `/api/v2/`, etc.