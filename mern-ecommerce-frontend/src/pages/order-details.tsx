import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import ProductView from "../components/product-view";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useLatestProductsQuery } from "../redux/api/productAPI";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");
  const dispatch = useDispatch();
  const productId = useParams(); 

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) {
    toast.error("Cannot Fetch the Products");
  }

  // Filter the product if data is available and productId is valid
  const product = data?.products.find((product) => product._id === productId.id);

  return (
    <div className="home">
      <h1>Product Details</h1>
      <main>
        {isLoading ? (
          <Skeleton />
        ) : product ? ( // Render ProductView only if product is found
          <ProductView
            key={product._id}
            productId={product._id}
            name={product.name}
            price={product.price}
            desc={product.desc}
            handler={addToCartHandler}
            stock={product.stock}
            photo={product.photo}
          />
        ) : (
          <p>No product found</p>
        )}
      </main>
    </div>
  );
};

export default Home;



// import toast from "react-hot-toast";
// import { Skeleton } from "../components/loader";
// import ProductView from "../components/product-view";
// import { useParams } from "react-router-dom";
// import { useLatestProductsQuery } from "../redux/api/productAPI";

// const Home = () => {
//   const { data, isLoading, isError } = useLatestProductsQuery("");

//   const productId  = useParams<{ productId: string }>();
//   console.log(data?.products, productId)

//   if (isError) toast.error("Cannot Fetch the Products");

//   return (
//     <div className="home">
      

//       <h1>Product Details</h1>

      
//       <main>
//         {isLoading ? (
//           <Skeleton width="80vw" />
//         ) : (
//           data?.products
//             .filter(
//               (product) =>
//               product._id === productId
//             )
//             .map((product) => (
//               <ProductView
//                 key={product._id}
//                 productId={product._id}
//                 name={product.name}
//                 price={product.price}
//                 stock={product.stock}
//                 photo={product.photo}
//               />
//             ))
//         )}
//       </main>
//     </div>
//   );
// };

// export default Home;
