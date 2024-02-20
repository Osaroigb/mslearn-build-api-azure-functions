// import { AzureFunction, Context, HttpRequest } from "@azure/functions";
// import productsService from "../services/productsService";

// const httpTrigger: AzureFunction = async function (
//   context: Context,
//   req: HttpRequest,
// ): Promise<void> {
//   let response;

//   try {
//     const product = req.body;
//     const result = await productsService.update(product);
//     response = { body: result, status: 200 };
//   } catch (err) {
//     response = { body: err.message, status: 500 };
//   }

//   context.res = response;
// };

// export default httpTrigger;

// Example Azure Function that calls the refactored update method
import productService from '../services/productsService';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const id = context.bindingData.id; // Extracting the id from the route parameters
    const productToUpdate = req.body;

    try {
        const updatedProduct = await productService.update(id, productToUpdate);
        context.res = {
            status: 200,
            body: updatedProduct,
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: "An error occurred during the update operation",
        };
    }
};

export default httpTrigger;