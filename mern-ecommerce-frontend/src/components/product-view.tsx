import { server } from "../redux/store";
import { Link } from "react-router-dom";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  desc: string;
  price: number;
  stock: number;
};

const ProductView = ({
  productId,
  price,
  desc,
  name,
  photo,
  stock,
}: ProductsProps) => {
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
        </div>
        <div className="product-desc">{desc}</div>
      </div>
    </Link>
  );
};

export default ProductView;
