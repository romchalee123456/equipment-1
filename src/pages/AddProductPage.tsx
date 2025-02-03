import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { Package2, Edit, Upload, Home, Users, ShoppingBag, BarChart2, Settings, ChevronRight } from 'lucide-react';
    
    function AddProductPage() {
      const [products, setProducts] = useState([]);
      const [productName, setProductName] = useState('');
      const [category, setCategory] = useState('');
      const [description, setDescription] = useState('');
      const [price, setPrice] = useState(0);
      const [comparePrice, setComparePrice] = useState(0);
      const [costPerItem, setCostPerItem] = useState(0);
      const [profit, setProfit] = useState(0);
      const [margin, setMargin] = useState(0);
      const [quantity, setQuantity] = useState(0);
      const [imageURL, setImageURL] = useState('');
      const [notes, setNotes] = useState('');
      const [loading, setLoading] = useState(true);
      const [isAddingToExisting, setIsAddingToExisting] = useState(false);
      const [selectedProduct, setSelectedProduct] = useState<any>(null);
    
      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get('https://fakestoreapi.com/products');
            setProducts(response.data);
          } catch (error) {
            console.error('Error fetching products:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProducts();
      }, []);
    
      useEffect(() => {
        if (price > 0 && costPerItem > 0) {
          const profitValue = price - costPerItem;
          const marginValue = (profitValue / price) * 100;
          setProfit(profitValue);
          setMargin(marginValue);
        }
      }, [price, costPerItem]);
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAddingToExisting && selectedProduct) {
          console.log('Adding to existing product:', {
            ...selectedProduct,
            quantity: selectedProduct.quantity + quantity,
          });
          alert('Quantity added to existing product!');
        } else {
          console.log({
            productName,
            category,
            description,
            price,
            comparePrice,
            costPerItem,
            profit,
            margin,
            quantity,
            imageURL,
            notes,
          });
          alert('Product Added!');
        }
      };
    
      const handleSelectProduct = (product: any) => {
        setSelectedProduct(product);
        setProductName(product.title);
        setCategory(product.category);
        setDescription(product.description);
        setPrice(product.price);
        setIsAddingToExisting(true);
      };
    
      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl">กำลังโหลดข้อมูล...</div>
          </div>
        );
      }
    
      return (
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <span>สินค้า</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium">เพิ่มสินค้า</span>
              </div>
            </div>
    
            <div className="mb-4">
              <button
                onClick={() => setIsAddingToExisting(!isAddingToExisting)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                {isAddingToExisting ? 'เพิ่มสินค้าใหม่' : 'เพิ่มจำนวนสินค้าที่มีอยู่'}
              </button>
            </div>
    
            {isAddingToExisting ? (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">เลือกสินค้า</h2>
                <div className="space-y-4">
                  {products.map((product: any) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 object-contain bg-gray-50 rounded"
                        />
                        <span>{product.title}</span>
                      </div>
                      <button
                        onClick={() => handleSelectProduct(product)}
                        className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        เลือก
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
    
            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">ข้อมูลสินค้า</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        disabled={isAddingToExisting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                      <textarea
                        className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isAddingToExisting}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center space-x-2"
                        disabled={isAddingToExisting}
                      >
                        <Upload className="h-4 w-4" />
                        <span>อัพโหลดรูปภาพ</span>
                      </button>
                    </div>
                  </div>
                </div>
    
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">การกำหนดราคา</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        disabled={isAddingToExisting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ราคาเปรียบเทียบ</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={comparePrice}
                        onChange={(e) => setComparePrice(Number(e.target.value))}
                        disabled={isAddingToExisting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ต้นทุนต่อรายการ</label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        value={costPerItem}
                        onChange={(e) => setCostPerItem(Number(e.target.value))}
                        disabled={isAddingToExisting}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">กำไร</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                          value={profit.toFixed(2)}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อัตรา</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                          value={margin.toFixed(2)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
    
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">สินค้าคงคลัง</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จำนวน</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
    
              {/* Right Column */}
              <div className="col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">หมายเหตุ</h2>
                    <button type="button">
                      <Edit className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="เพิ่มหมายเหตุ..."
                  />
                </div>
              </div>
    
              {/* Submit Button */}
              <div className="col-span-3">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
    
    export default AddProductPage;
