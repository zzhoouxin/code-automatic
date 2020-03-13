import { createModel } from "@rematch/core"
import {
  userFavoriteCollect,
  productQueryRecommendProductId,
  deliveryCompanyCreate,
  FavoriteDto,
  ProductId,
  DeliveryCompanyDto
} from "./action"

export const codeAutomaticModel = createModel({
  state: {
    userFavoriteCollectData: {},

    productQueryRecommendProductIdData: {},

    deliveryCompanyCreateData: {}
  },
  reducers: {
    setState: (state, payload) => {
      return { ...state, ...payload }
    }
  },

  effects: dispatch => ({
    async userFavoriteCollect(favoriteDto: FavoriteDto) {
      let { code, obj } = await userFavoriteCollect(favoriteDto)
      if (code === 1) {
        dispatch.codeAutomaticModel.setState({
          userFavoriteCollectData: obj
        })
      }
    },

    async productQueryRecommendProductId(productId: ProductId) {
      let { code, obj } = await productQueryRecommendProductId(productId)
      if (code === 1) {
        dispatch.codeAutomaticModel.setState({
          productQueryRecommendProductIdData: obj
        })
      }
    },

    async deliveryCompanyCreate(deliveryCompanyDto: DeliveryCompanyDto) {
      let { code, obj } = await deliveryCompanyCreate(deliveryCompanyDto)
      if (code === 1) {
        dispatch.codeAutomaticModel.setState({
          deliveryCompanyCreateData: obj
        })
      }
    }
  })
})
