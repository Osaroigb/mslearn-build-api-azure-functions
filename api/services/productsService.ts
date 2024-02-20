import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

// Set connection string from CONNECTION_STRING value in local.settings.json
const CONNECTION_STRING = process.env.CONNECTION_STRING;
// let client = new CosmosClient(process.env.CONNECTION_STRING);

const productService = {
  init() {
    try {
      this.client = new CosmosClient(CONNECTION_STRING);
      this.database = this.client.database("tailwind");
      this.container = this.database.container("products");
    } catch (err) {
      console.log(err.message);
    }
  },
  async create(productToCreate) {
    const { resource } = await this.container.items.create(productToCreate);
    return resource;
  },
  async read(): Promise<string> {
    const iterator = this.container.items.readAll();
    const { resources } = await iterator.fetchAll();
    return JSON.stringify(resources);
  },
  // async update(product) {
  //   const { resource } = await this.container.item(
  //     product.id,
  //     product.brand.name,
  //   )
  //     .replace(product);
  //   return resource;
  // },
  async update(id: string, productToUpdate) {
    // Assuming productToUpdate no longer contains id within it
    // and brand.name is required as the partition key or for other reasons
    const { resource } = await this.container
      .item(id, productToUpdate.brand.name)
      .replace(productToUpdate);
    return resource;
  },
  // async delete(id, brandName) {
  //   const result = await this.container.item(id, brandName).delete();
  // },
  async delete(id, brandName) {
    // const { id } = context.bindingData; // Extracting id from route parameters
    // const brandName = context.req.query.brandName; // Extracting brandName from query parameters
  
    await this.container.item(id, brandName).delete();
    return { message: `Deleted item with id: ${id} and brand: ${brandName}` };
  }
};

productService.init();

export default productService;
