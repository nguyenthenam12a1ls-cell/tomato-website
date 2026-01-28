import React, { useState, useEffect, useContext } from 'react'; // Thêm useContext
import '../Add/Add.css'; // Tái sử dụng CSS từ trang Add
import axios from "axios";
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext'; // Import Context

const Edit = () => { // Xóa prop {url}
  
  const { url } = useContext(StoreContext); // Lấy url từ Context
  const { foodId } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  });
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        // 'url' ở đây đã được lấy từ Context
        const response = await axios.get(`${url}/api/food/get/${foodId}`);
        if (response.data.success) {
          const food = response.data.data;
          setData({
            name: food.name,
            description: food.description,
            price: food.price,
            category: food.category
          });
          // 'url' ở đây đã được lấy từ Context
          setImageUrl(`${url}/images/${food.image}`);
        } else {
          toast.error("Không thể tải dữ liệu món ăn");
        }
      } catch (error) {
        toast.error("Lỗi API khi tải dữ liệu");
      }
    };
    fetchFoodData();
  }, [url, foodId]); // Giữ 'url' ở đây

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0])); 
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", foodId);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    
    if (image) {
      formData.append("image", image);
    }

    try {
      // 'url' ở đây đã được lấy từ Context
      const response = await axios.post(`${url}/api/food/update`, formData);
      
      if (response.data.success) {
        toast.success("Cập nhật món ăn thành công!");
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Lỗi API khi cập nhật");
    }
  };

  return (
    <div className='add'>
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={imageUrl || assets.upload_area} alt="" />
          </label>
          <input 
            onChange={onImageChange} 
            type="file" 
            id='image' 
            hidden 
          />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name='name' 
            placeholder='Type here' 
            required
          />
        </div>
        <div className='add-product-description flex-col'>
          <p>Product description</p>
          <textarea 
            onChange={onChangeHandler} 
            value={data.description} 
            name="description" 
            rows="6" 
            placeholder="Write content here" 
            required
          ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select 
              onChange={onChangeHandler} 
              value={data.category} 
              name="category"
            >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodels">Noodels</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input 
              onChange={onChangeHandler} 
              value={data.price} 
              type="Number" 
              name='price' 
              placeholder='$20'
              required
            />
          </div>
        </div>
        <button type='submit' className='add-btn'>Update</button>
      </form>
    </div>
  );
};

export default Edit;