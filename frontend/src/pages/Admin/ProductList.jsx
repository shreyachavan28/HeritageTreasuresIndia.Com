import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div
      className="min-h-screen min-w-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/4099355/pexels-photo-4099355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        overflow: 'hidden',
      }}>
      <div className="bg-black bg-opacity-55 p-3 rounded-lg w-full max-w-4xl overflow-hidden" style={{ transform: 'scale(0.8)' }}>
        <div className="flex flex-col md:flex-row">
    
          <AdminMenu />
          <div className="md:w-3/4 p-3  ">
            <div className="h-10 text-2xl font-bold text-white">CREATE PRODUCT</div>

            {imageUrl && (
              <div className="text-center">
                <img
                  src={imageUrl}
                  alt="product"
                  className="block mx-auto max-h-[200px]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                {image ? image.name : "Upload Image"}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="flex w-full md:w-1/2 mb-3 pr-2">
                  <label htmlFor="name" className="w-full h-12 text-xl font-bold text-white">Name</label>
                  <input
                    type="text"
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex w-full md:w-1/2 mb-3 pl-2">
                  <label htmlFor="price" className="w-full h-12 text-xl font-bold text-white">Price</label>
                  <input
                    type="number"
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap">
                <div className="flex w-full md:w-1/2 mb-3 pr-2">
                  <label htmlFor="quantity" className="w-full h-12 text-xl font-bold text-white">Quantity</label>
                  <input
                    type="number"
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="flex w-full md:w-1/2 mb-3 pl-2">
                  <label htmlFor="brand" className="w-full h-12 text-xl font-bold text-white">Brand</label>
                  <input
                    type="text"
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="description" className="my-5 block h-12 text-xl font-bold text-white">Description</label>
              <textarea
                type="text"
                className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="flex flex-wrap">
                <div className="flex w-full md:w-1/2 mb-3 pr-2">
                  <label htmlFor="stock" className="w-full h-12 text-xl font-bold text-white">Count In Stock</label>
                  <input
                    type="number"
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="flex w-full md:w-1/2 mb-3 pl-2">
                  <label htmlFor="category" className="w-full h-12 text-xl font-bold text-white">Category</label>
                  <select
                    placeholder="Choose Category"
                    className="p-4 w-full border rounded-lg bg-[#101011] text-white"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
