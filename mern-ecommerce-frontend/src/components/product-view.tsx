import { server } from "../redux/store";
import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";
import { Link } from "react-router-dom";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  desc: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductView = ({
  productId,
  price,
  desc,
  name,
  photo,
  stock,
  handler,
}: ProductsProps) => {

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault(); // Prevent the default behavior
    handler({ productId, price, name, photo, stock, quantity: 1 });
  };
  return (
    <Link to={`/order/${productId}`} key={productId}>
      <div className="product-view">
        <div className="product-wrapper">
          <img src={`${server}/${photo}`} alt={name} />
          <div className="product-name">{name}</div>
          <div className="product-wrapper2">
            <div className="product-price">Price: ₹{price}</div>
            <div className="product-stock">Stock: {stock}</div>
          </div>
          <div className="btn">
          <button 
            onClick={handleClick}
          >
            <FaPlus />
          </button>
        </div>
          
        </div>
        <div className="product-desc">{desc}</div>
        
        
      </div>
      
    </Link>
  );
};

export default ProductView;
