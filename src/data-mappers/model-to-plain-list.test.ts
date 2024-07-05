import { DataTypes, Model, Sequelize } from "sequelize";
import { modelToPlainList } from "./model-to-plain-list";



describe("modelToPlainList", () => {
  it("should return an empty array if the input model list is empty", async () => {
    const modelList: Model[] = [];
    const result = await modelToPlainList(modelList);
    expect(result).toEqual([]);
  });

  it("should return an array of plain objects representing the models", async () => {
    const db = new Sequelize('sqlite::memory:');

    class MockModel extends Model { }
    MockModel.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      modelName: 'mock',
      sequelize: db,
    });

    const modelList: Model[] = [
      new MockModel({ id: 1, name: "Model 1" }),
      new MockModel({ id: 2, name: "Model 2" }),
    ];

    const result = await modelToPlainList(modelList);
    expect(result).toEqual([{ id: 1, name: "Model 1" }, { id: 2, name: "Model 2" }]);
  });
});