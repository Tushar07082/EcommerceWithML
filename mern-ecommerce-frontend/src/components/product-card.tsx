import { FaPlus } from "react-icons/fa";
import { RootState, server } from "../redux/store";
import { CartItem } from "../types/types";
import { useAddProductViewedMutation } from "../redux/api/userAPI";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
}: ProductsProps) => {
  const [addProductViewed] = useAddProductViewedMutation();

  const { user } = useSelector(
    (state: RootState) => state.userReducer
  );

  const handleClick = async() =>{
    try{
      const res = await addProductViewed({
        _id: user?._id!,
        _product_id: productId!,
      });
      console.log(res);

    }catch(err){
      console.log(err);
    }
    
  }
  return (
    <Link to={`/order/${productId}`} key={productId}>
    <div className="product-card" onClick={handleClick}>
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>

      <div>
        <button
          onClick={() =>
            handler({ productId, price, name, photo, stock, quantity: 1 })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
