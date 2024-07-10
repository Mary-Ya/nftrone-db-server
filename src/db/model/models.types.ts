import { DataTypes as SeqDataTypes, Sequelize, Model } from "sequelize";
import { ModelStatic } from "sequelize/types";

export type ModelGetter = (sequelize: Sequelize, DataTypes: typeof SeqDataTypes, options?: any) => ModelStatic<Model>;