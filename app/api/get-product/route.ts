import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('body: ', body)
  const queryString = body.queryString
  const filter = {...body}
  delete filter.queryString

  const variables = {
    "queryString": queryString,
    "types":["NORMAL","COMPARISON","OVERSEA"],
    "orderBy":"MOST_RELEVANT",
    "filter":filter,
    "comparisonFirst":false,
    "page":1,
    "pageSize":20
  }

  const responseRaw = await fetch(`https://buy.line.me/api/graphql`, {
    method: 'POST',
    headers: {
      "user-agent": "Mobile LINE/TW_Shopping_App_android"
    },
    body: JSON.stringify({
      query: "query ($types: [SearchType], $queryString: String, $orderBy: OrderBy, $page: Int, $pageSize: Int, $filter: SearchFilterArgs, $comparisonFirst: Boolean) {\n  search(types: $types, queryString: $queryString, orderBy: $orderBy, page: $page, pageSize: $pageSize, filter: $filter, comparisonFirst: $comparisonFirst) {\n    keyword\n    contents {\n      ... on Product {\n        ...ProductFragmentForThumbnail\n        pageView\n        __typename\n      }\n      ... on ComparisonProduct {\n        ...ComparisonProductFragment\n        topProducts {\n          shopProductId\n          merchant {\n            shopId\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      ... on Merchant {\n        ...MerchantFragmentForCard\n        __typename\n      }\n      __typename\n    }\n    pageInfo {\n      totalPages\n      totalCount\n      currentPage\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ProductFragmentForThumbnail on Product {\n  id\n  shopProductId\n  promoteProductId\n  name\n  imageUrl\n  url\n  outlinkUrl\n  productPageUrl\n  discount\n  price\n  specialPrice\n  point {\n    amount\n    bonusAmountForApp\n    calculatedAmount\n    limit\n    __typename\n  }\n  calculatedPoint\n  status\n  merchant {\n    name\n    shopId\n    storeId\n    merchantId\n    imageUrl\n    displayPoints\n    url\n    point {\n      amount\n      bonusAmountForApp\n      calculatedAmount\n      __typename\n    }\n    showPointAmount\n    showEstimatedPoint\n    __typename\n  }\n  productReward {\n    endTime\n    startTime\n    rewardPoint\n    limit\n    __typename\n  }\n  rewardCountdownEndTime\n  lowPriceType\n  priceDifference\n  productType\n  hideEstimatedPoint\n  groupDeal {\n    count\n    promotionPrice\n    groupDealStart\n    groupDealEnd\n    __typename\n  }\n  __typename\n}\n\nfragment ComparisonProductFragment on ComparisonProduct {\n  id\n  comparisonId\n  name\n  url\n  imageUrl\n  minPrice\n  maxPrice\n  lowPriceType\n  minPoint\n  maxPoint\n  calculatedMinPoint\n  calculatedMaxPoint\n  totalProduct\n  allMerchants {\n    merchantId\n    name\n    imageUrl\n    __typename\n  }\n  __typename\n}\n\nfragment MerchantFragmentForCard on MerchantInterface {\n  merchantId\n  shopId\n  storeId\n  name\n  url\n  imageUrl\n  transferPageUrl\n  point {\n    amount\n    previousAmount\n    eventMessage\n    bonusAmountForApp\n    calculatedAmount\n    __typename\n  }\n  displayPoints\n  showPointAmount\n  rewardRaised\n  coupon\n  opening\n  redEnvelopeSettingIds\n  __typename\n}\n",
      variables
    })
  })
  const response = await responseRaw.json()
  console.log(response)
  // const pois = response.data.search.contents.map((poi: any) => {
  //   return {
  //     poiURL: `https://travel.line.me/poi/${poi.poiId}`,
  //     ...poi}
  // })
  return NextResponse.json(
    {
      products: response.data.search.contents,
    },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://chat.openai.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, openai-ephemeral-user-id, openai-conversation-id",
      },
    }
  );
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://chat.openai.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, openai-ephemeral-user-id, openai-conversation-id",
      },
    }
  );
}
