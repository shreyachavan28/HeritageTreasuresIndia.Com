import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter, filteredProductsQuery.isLoading]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/05/40/29/28/360_F_540292899_bo8cFXZSwkS40vYkzvEhmIH4qxO2I5Hs.jpg')",
      
        transform: "scale(0.93)", 
        transformOrigin: "top right" 
       }}
    >
      <div className="flex justify-around h-full bg-black bg-opacity-20">
        <div className="container mx-auto ">
          <div className="flex md:flex-row">
            <div className="bg-[#151515] p-4 mt-4 mb-4 z-10">
              <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
                Filter by Categories
              </h2>

              <div className="p-0 w-[14rem]">
                {categories?.map((c) => (
                  <div key={c._id} className="mb-2">
                    <div className="flex items-center mr-4">
                      <input
                        type="checkbox"
                        id={c._id}
                        onChange={(e) => handleCheck(e.target.checked, c._id)}
                        className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor={c._id}
                        className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                      >
                        {c.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
                Filter by Brands
              </h2>

              <div className="p-5">
                {uniqueBrands?.map((brand) => (
                  <div className="flex items-center mr-4 mb-5" key={brand}>
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={brand}
                      className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>

              <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
                Filter by Price
              </h2>

              <div className="p-5 w-[15rem]">
                <input
                  type="text"
                  placeholder="Enter Price"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
                />
              </div>

              <div className="p-5 pt-0">
                <button
                  className="w-full border my-4"
                  onClick={() => window.location.reload()}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="p-3 flex-1">
              <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.length === 0 ? (
                  <Loader />
                ) : (
                  products?.map((p) => (
                    <div className="p-3" key={p._id}>
                      <ProductCard p={p} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
