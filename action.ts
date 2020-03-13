import { post } from "../../../../base/httpClient"

/**
 * 收藏
 * @param favoriteDto : {productId:商品Id|integer,}
 */
export const userFavoriteCollect = (
  favoriteDto: FavoriteDto
): Promise<BaseResponse> => {
  return post("/user/favorite/collect", favoriteDto)
}

/**
 * 查询推荐商品
 * @param productId :
 */
export const productQueryRecommendProductId = (
  productId: ProductId
): Promise<BaseResponse<ResponseVoListProductVo>> => {
  return post("/product/query-recommend/{productId}", productId)
}

/**
 * 新增快递公司
 * @param deliveryCompanyDto : {deliveryCode:物流公司编码|string,deliveryName:物流公司名称|string,state:状态：0:停用  1:启用|integer,}
 */
export const deliveryCompanyCreate = (
  deliveryCompanyDto: DeliveryCompanyDto
): Promise<BaseResponse> => {
  return post("/delivery-company/create", deliveryCompanyDto)
}

export interface BaseResponse<T = any> {
  code: number;
  ext: any;
  obj: T;
  success: boolean;
}

export interface FavoriteDto {
  productId: number;
}
export interface ResponseVoListProductVo {
  image: string;
  inventory: number;
  marketPrice: number;
  popularizeAmount: number;
  popularizeColonelAmount: number;
  productId: number;
  productName: string;
  productType: number;
  salePrice: number;
  saleState: number;
  shareImage: string;
  showList: number;
  sortWeight: number;
  spec: Spec[];
}
export interface Spec {
  name: string;
  value: string;
}
export interface ProductId {
  productId: string;
}
export interface DeliveryCompanyDto {
  deliveryCode: string;
  deliveryName: string;
  state: number;
}
