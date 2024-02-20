// import productsService from "../services/productsService";
// import { AzureFunction, Context, HttpRequest } from "@azure/functions";

// const httpTrigger: AzureFunction = async function (
//   context: Context,
//   req: HttpRequest,
// ): Promise<void> {
//   let response;

//   try {
//     const id = req.params.id;
//     const brand = req.body.brand;
//     const result = await productsService.delete(id, brand.name);
//     response = { body: result, status: 200 };
//   } catch (err) {
//     response = { body: err.message, status: 500 };
//   }

//   context.res = response;
// };

// export default httpTrigger;

import productService from "../services/productsService";
import { AzureFunction, Context } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
): Promise<void> {
  let response;

  try {
    // Extracting id from route parameters directly
    const id = context.bindingData.id;

    // Now expecting brandName to be a query parameter, not in the request body
    const brandName = context.req.query.brandName;
    if (!brandName) throw new Error("Brand name is required as a query parameter.");

    const result = await productService.delete(id, brandName);
    response = { body: result, status: 200 };
  } catch (err) {
    response = { body: err.message, status: 500 };
  }

  context.res = response;
};

export default httpTrigger;
