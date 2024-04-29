import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery,useRecommendedProductsQuery } from "../redux/api/productAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem } from "../types/types";
import { RootState } from "../redux/store";

const Home = () => {
  const { user } = useSelector(
    (state: RootState) => state.userReducer
  );

  const { data, isLoading, isError } = useLatestProductsQuery("");
  const recommendedData = useRecommendedProductsQuery(user?._id!);
  console.log("recommended Data",recommendedData);
    
  const [selectedCategory, setSelectedCategory] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const category = Cookies.get("selectedCategory");
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (isError) toast.error("Cannot Fetch the Products");

  return (
    <div className="home">
      <section></section>

      {selectedCategory && <h1>
        Similar Products
      </h1>}

      <main>
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products
            .filter(
              (product) =>
                selectedCategory && product.category === selectedCategory
            )
            .map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={addToCartHandler}
                photo={product.photo}
              />
            ))
        )}
      </main>

      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>

      <main>
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
      {
      user
      &&
      <div>
        <h1>
        Recommended Products
      </h1>

      <main>
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          recommendedData?.data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
      </div>
      }

      

      
    </div>
  );
};

export default Home;

// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { Skeleton } from "../components/loader";
// import ProductCard from "../components/product-card";
// import { useLatestProductsQuery } from "../redux/api/productAPI";
// import { addToCart } from "../redux/reducer/cartReducer";
// import { CartItem } from "../types/types";

// const Home = () => {
//   const { data, isLoading, isError } = useLatestProductsQuery("");

//   console.log(data?.products[1].category)

//   const [products, setProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const category = Cookies.get("selectedCategory");
//     if (category) {
//       console.log(category);
//       setSelectedCategory(category);
//     }
//   }, []);

//   // till here

//   const addToCartHandler = (cartItem: CartItem) => {
//     if (cartItem.stock < 1) return toast.error("Out of Stock");
//     dispatch(addToCart(cartItem));
//     toast.success("Added to cart");
//   };

//   if (isError) toast.error("Cannot Fetch the Products");

//   return (
//     <div className="home">
//       <section></section>

//       <h1>
//         Latest Products
//         <Link to="/search" className="findmore">
//           More
//         </Link>
//       </h1>

//       <main>
//         {isLoading ? (
//           <Skeleton width="80vw" />
//         ) : (
//           data?.products.map((i) => (

//             {(i.category == category) ?
//             <ProductCard
//               key={i._id}
//               productId={i._id}
//               name={i.name}
//               price={i.price}
//               stock={i.stock}
//               handler={addToCartHandler}
//               photo={i.photo}
//             />
//             }
//           ))
//         )}
//       </main>

//     </div>
//   );
// };

// export default Home;

// import toast from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { Skeleton } from "../components/loader";
// import ProductCard from "../components/product-card";
// import { useLatestProductsQuery } from "../redux/api/productAPI";
// import { addToCart } from "../redux/reducer/cartReducer";
// import { CartItem } from "../types/types";

// const Home = () => {
//   const { data, isLoading, isError } = useLatestProductsQuery("");

//   const dispatch = useDispatch();

//   const addToCartHandler = (cartItem: CartItem) => {
//     if (cartItem.stock < 1) return toast.error("Out of Stock");
//     dispatch(addToCart(cartItem));
//     toast.success("Added to cart");
//   };

//   if (isError) toast.error("Cannot Fetch the Products");

//   return (
//     <div className="home">
//       <section></section>

//       <h1>
//         Latest Products
//         <Link to="/search" className="findmore">
//           More
//         </Link>
//       </h1>

//       <main>
//         {isLoading ? (
//           <Skeleton width="80vw" />
//         ) : (
//           data?.products.map((i) => (
//             <ProductCard
//               key={i._id}
//               productId={i._id}
//               name={i.name}
//               price={i.price}
//               stock={i.stock}
//               handler={addToCartHandler}
//               photo={i.photo}
//             />
//           ))
//         )}
//       </main>
//     </div>
//   );
// };

// export default Home;
