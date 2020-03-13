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
    userFavoriteCollect: {},

    productQueryRecommendProductId: {},

    deliveryCompanyCreate: {}
  },
  reducers: {
    setState: (state, payload) => {
      return { ...state, ...payload }
    }
  },

  effects: dispatch => ({
    async _userFavoriteCollect(favoriteDto: FavoriteDto) {
      let { code, obj } = await userFavoriteCollect(favoriteDto)
      if (code === 1) {
        dispatch.codeAutomaticModel.setState({
          userFavoriteCollectData: obj
        })
      }
    },

    async _productQueryRecommendProductId(productId: ProductId) {
      let { code, obj } = await productQueryRecommendProductId(productId)
      if (code === 1) {
        dispatch.codeAutomaticModel.setState({
          productQueryRecommendProductIdData: obj
        })
      }
    },

    async _deliveryCompanyCreate(deliveryCompanyDto: DeliveryCompanyDto) {
      let { code, obj } = await deliveryCompanyCreate(deliveryCompanyDto)
      if (code === 1) {
        dispatch.codeAutomaticModel.setState({
          deliveryCompanyCreateData: obj
        })
      }
    }
  })
})
