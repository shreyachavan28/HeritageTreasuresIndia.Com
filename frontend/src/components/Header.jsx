import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/07/23/25/10/360_F_723251022_lk5PQ6Q5Fxs1Lb84NlfdxGA0Purou4WE.jpg')" }}
      >
        <div className="flex flex-col h-full bg-black bg-opacity-20">
          {/* Website name at the top left corner */}
          

          <div className="flex justify-around flex">
            <div className="hidden xl:block" style={{ transform: "scale(0.81)" }}>
              <div className="grid grid-cols-2">
                {data.map((product) => (
                  <div key={product._id}>
                    <SmallProduct product={product} />
                  </div>
                ))}
              </div>
            </div>
            <ProductCarousel />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
