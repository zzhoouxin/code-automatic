import { post } from "../../../../base/httpClient"

/**
 * jsApiSignature
 * @param url :
 */
export const wechatJsapi = (
  url: Url
): Promise<BaseResponse<ResponseVoWxJsapiSignature>> => {
  return post("/wechat/jsapi", url)
}

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
 * create
 * @param newDto : {content:外部内容|string,img:标题图片|string,subtitle:新闻副标题|string,title:新闻标题|string,type:新闻类型|integer,url:外部新闻URL|string,}
 */
export const newsCreate = (newDto: NewDto): Promise<BaseResponse> => {
  return post("/news/create", newDto)
}

export interface BaseResponse<T = any> {
  code: number;
  ext: any;
  obj: T;
  success: boolean;
}

interface ResponseVoWxJsapiSignature {
  appId: string;
  nonceStr: string;
  signature: string;
  timestamp: number;
  url: string;
}
interface Url {
  url: string;
}
interface FavoriteDto {
  productId: number;
}
interface NewDto {
  content: string;
  img: string;
  subtitle: string;
  title: string;
  type: number;
  url: string;
}
