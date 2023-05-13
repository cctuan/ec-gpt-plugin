import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log({body})
  const queryString = body.queryString
  const filter = {...body}
  delete filter.queryString

  console.log({filter})
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
      "user-agent": "Mobile LINE/TW_Shopping_App_android",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: "query ($types: [SearchType], $queryString: String, $orderBy: OrderBy, $page: Int, $pageSize: Int, $filter: SearchFilterArgs, $comparisonFirst: Boolean) {   search(types: $types, queryString: $queryString, orderBy: $orderBy, page: $page, pageSize: $pageSize, filter: $filter, comparisonFirst: $comparisonFirst) {     keyword     contents {       ... on Product {         ...ProductFragmentForThumbnail         pageView         __typename       }       ... on ComparisonProduct {         ...ComparisonProductFragment         topProducts {           shopProductId           merchant {             shopId             __typename           }           __typename         }         __typename       }       ... on Merchant {         ...MerchantFragmentForCard         __typename       }       __typename     }     pageInfo {       totalPages       totalCount       currentPage       __typename     }     __typename   } }  fragment ProductFragmentForThumbnail on Product {   id   shopProductId   promoteProductId   name   imageUrl   url   outlinkUrl   productPageUrl   discount   price   specialPrice   point {     amount     bonusAmountForApp     calculatedAmount     limit     __typename   }   calculatedPoint   status   merchant {     name     shopId     storeId     merchantId     imageUrl     displayPoints     url     point {       amount       bonusAmountForApp       calculatedAmount       __typename     }     showPointAmount     showEstimatedPoint     __typename   }   productReward {     endTime     startTime     rewardPoint     limit     __typename   }   rewardCountdownEndTime   lowPriceType   priceDifference   productType   hideEstimatedPoint   groupDeal {     count     promotionPrice     groupDealStart     groupDealEnd     __typename   }   __typename }  fragment ComparisonProductFragment on ComparisonProduct {   id   comparisonId   name   url   imageUrl   minPrice   maxPrice   lowPriceType   minPoint   maxPoint   calculatedMinPoint   calculatedMaxPoint   totalProduct   allMerchants {     merchantId     name     imageUrl     __typename   }   __typename }  fragment MerchantFragmentForCard on MerchantInterface {   merchantId   shopId   storeId   name   url   imageUrl   transferPageUrl   point {     amount     previousAmount     eventMessage     bonusAmountForApp     calculatedAmount     __typename   }   displayPoints   showPointAmount   rewardRaised   coupon   opening   redEnvelopeSettingIds   __typename } ",
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
      products: response.products,
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
