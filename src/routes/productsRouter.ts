import Elysia, { t } from "elysia";
import { prisma } from "../models/db";
import { autoPlugin } from "../middleware/autoPlugin";

export const productRouter = new Elysia({ prefix: "/products" })

  // Fetch all products
  .get("/", async () => {
    try {
      const products = await prisma.product.findMany();
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return { error: "Failed to fetch products." };
    }
  })

  // Create a new product
  .post(
    "/create",
    async ({ body }) => {
      try {
        const { name, description, image, price, stock } = body;
        const newProduct = await prisma.product.create({
          data: {
            name,
            description,
            image,
            price,
            stock,
          },
        });
        return newProduct;
      } catch (error) {
        console.error("Error creating product:", error);
        return { error: "Failed to create product." };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.String({ minLength: 1 }),
        image: t.String({ minLength: 1 }),
        price: t.Number(),
        stock: t.Number(),
      }),
    }
  )

  // Fetch a specific product by ID
  .get(
    "/:id",
    async ({ params }) => {
      try {
        const { id } = params;
        const product = await prisma.product.findFirst({
          where: { id },
        });
        if (!product) {
          return { error: "Product not found." };
        }
        return product;
      } catch (error) {
        console.error("Error fetching product:", error);
        return { error: "Failed to fetch product." };
      }
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
    }
  )

  // Delete a product by ID
  .delete(
    "/:id",
    async ({ params }) => {
      try {
        const { id } = params;
        const deletedProduct = await prisma.product.delete({
          where: { id },
        });
        return deletedProduct;
      } catch (error) {
        console.error("Error deleting product:", error);
        return { error: "Failed to delete product." };
      }
    },
    {
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
    }
  )

  // Update a product by ID
  .put(
    "/:id",
    async ({ params, body }) => {
      try {
        const { id } = params;
        const { name, description, price, image, stock } = body;
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            name,
            description,
            price,
            image,
            stock,
          },
        });
        return updatedProduct;
      } catch (error) {
        console.error("Error updating product:", error);
        return { error: "Failed to update product." };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.String({ minLength: 1 }),
        price: t.Number(),
        image: t.String({ minLength: 1 }),
        stock: t.Number(),
      }),
      params: t.Object({
        id: t.String({ minLength: 1 }),
      }),
    }
  )

  // Use the autoPlugin for additional middleware
  .use(autoPlugin);

