
import Elysia , { t } from "elysia";
import { prisma } from "../models/db";
import { autoPlugin } from "../middleware/autoPlugin";


export const productRouter = new Elysia({prefix:"/products"})

.get("/" , async({}) => {
    const products = await prisma.product.findMany()
    return products
})

.post("/create" , async({body}) => {
    try {
        const {name ,descrption ,image ,price ,stock } =body;
        const newProduct = await prisma.product.create({
            data: {
               name ,
               descrption,
               image,
               price,
               stock 
            }
        })
        return newProduct;
    } catch (error) {
      console.log("Error On Posting products")  
    }
},{
   body : t.Object({
    name : t.String({
        minLength:1
    }),
    descrption : t.String({
        minLength:1
    }),
    image : t.String({
        minLength:1
    }),
    price:t.Number(),
    stock:t.Number(),
   }) 
})

.use(autoPlugin)

.get("/:id", async({params , request , user}) => {
 try {
    console.log(user ,"user")
    console.log(request ,"request")
    const { id } = params;
    const product = await prisma.product.findFirst({
        where : {
            id:id,
        }
    })
    return { product };
        
    } catch (e) {
        console.log("Error on fetching Particular Product" ,e)
    }
}, {
    params : t.Object ({
        id : t.String({
            minLength:1
        })
    })
}
)




.delete("/:id"  , async({params}) => {

  try {

    const {id} = params;
    const deletedProducts = await prisma.product.delete({
        where : {
            id : id
        }
    
    })
    return deletedProducts
    
  } catch (error) {
    console.log("Error on Deleting Products")
  }

}, {
    params : t.Object({
        id: t.String({
            minLength:1
        })
    })
})

.put("/:id" , async ({params , body}) => {
    try {
        const {id} = params;
        const {name , price , image , stock} = body;
        const updatedProducts  = prisma.product.update({
            where : {
                id : id
            },
            data : {
              name,
              price,
              image,
              stock
            }

        });
        const product = {
            name : (await updatedProducts).name,
            price : (await updatedProducts).price,
            image: (await updatedProducts).image,
            stock:(await updatedProducts).stock
        }

        return product
        
    } catch (error) {
      console.log("Error on Updating Products")  
    }
},{
    body : t.Object({
        name : t.String({
            minLength:1
        }),
        price : t.Number(),
        image:t.String(),
        stock : t.Number()

     }),
     params:t.Object({
        id:t.String({
            minLength:1
        })
     })
}
)



