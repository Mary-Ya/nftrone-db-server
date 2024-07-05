import { Model } from "sequelize";

export const modelToPlainList = async (modelList: Model[]) => {
  return modelList.map((model: Model) => {
    return model.get({ plain: true });
  });
}