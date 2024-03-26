import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault(); // Prevent the default behavior
    handler({ productId, price, name, photo, stock, quantity: 1 });
  };
  
  return (
    <Link to={`/order/${productId}`} key={productId}>
      <div className="product-card">
        <img src={`${server}/${photo}`} alt={name} />
        <p>{name}</p>
        <span>₹{price}</span>

        <div>
          <button
            onClick={handleClick}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
