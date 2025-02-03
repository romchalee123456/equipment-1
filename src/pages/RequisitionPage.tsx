import React, { useState, useEffect } from 'react';
import { Search, Edit, Package2, Home, Users, ShoppingBag, BarChart2, Settings, ChevronRight, Plus, Minus, Printer } from 'lucide-react';
import axios from 'axios';
import type { Product, CartItem, ApiResponse } from '../types';

function RequisitionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requisitionDate, setRequisitionDate] = useState(new Date().toISOString().slice(0, 10));
  const [requisitionNumber, setRequisitionNumber] = useState('IB-000001');
  const [location, setLocation] = useState('บริษัท FMC สาขาใหญ่');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState('User');
  const [lastRequisitionNumber, setLastRequisitionNumber] = useState(1);

  const locations = [
    'บริษัท FMC สาขาใหญ่',
    'บริษัท FMC สาขา 1',
    'บริษัท FMC สาขา 2',
    'บริษัท FMC สาขา 3',
    'บริษัท FMC สาขา 4',
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<ApiResponse>('/products');
        const transformedProducts = response.data.products.map((item) => ({
          id: item._id,
          name: item.name,
          image: 'https://via.placeholder.com/150',
          price: Number(item.price),
          quantity: Number(item.stock)
        }));
        setProducts(transformedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, orderQuantity: item.orderQuantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, orderQuantity: 1 }]);
    }
  };

  const handleQuantityChange = (id: string, change: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id
        ? { ...item, orderQuantity: Math.max(1, item.orderQuantity + change) }
        : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.orderQuantity), 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const handlePrintRequisition = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmRequisition = async () => {
    try {
      const requisitionData = {
        requisitionDate,
        requisitionNumber,
        location,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.orderQuantity,
          price: item.price
        })),
        notes,
        user: currentUser,
        total,
        status: 'pending'
      };

      await axios.post('/requisitions', requisitionData);
      
      alert('บันทึกการเบิกสินค้าเรียบร้อยแล้ว');
      setIsDialogOpen(false);
      setLastRequisitionNumber(prev => prev + 1);
      setRequisitionNumber(`IB-${String(lastRequisitionNumber + 1).padStart(6, '0')}`);
      setCartItems([]);
      setNotes('');
    } catch (err) {
      console.error('Error saving requisition:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleCancelRequisition = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    setRequisitionNumber(`IB-${String(lastRequisitionNumber).padStart(6, '0')}`);
  }, [lastRequisitionNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
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
            <span className="font-medium">เบิกสินค้า</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Product Selection */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">สินค้า</h2>
              <div className="relative mb-4">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2"
                  placeholder="ค้นหาสินค้า"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {products
                  .filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(product => (
                    <div key={product.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-contain bg-gray-50 rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/150';
                          }}
                        />
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-gray-600">${product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>เพิ่ม</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Cart & Notes */}
          <div className="col-span-1 space-y-6">
            {/* Requisition Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">รายละเอียดการเบิก</h2>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เบิก</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={requisitionDate}
                    onChange={(e) => setRequisitionDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">เลขที่ใบเบิก</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={requisitionNumber}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">สถานที่เบิก</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">เลือกสถานที่</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้เบิก</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                    value={currentUser}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
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

            {/* Cart Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">การชำระเงิน</h2>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.orderQuantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="p-1 rounded-md hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>ยอดรวม ({cartItems.reduce((sum, item) => sum + item.orderQuantity, 0)} รายการ)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>ภาษี (VAT 7%)</span>
                    <span>${vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>ยอดรวมทั้งหมด</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePrintRequisition}
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 mt-4 flex items-center justify-center space-x-2"
                  disabled={cartItems.length === 0}
                >
                  <Printer className="h-4 w-4" />
                  <span>พิมพ์ใบเบิก</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-semibold mb-6">รายละเอียดการเบิก</h2>
            <div className="mb-4">
              <p><strong>วันที่เบิก:</strong> {new Date(requisitionDate).toLocaleDateString('th-TH')}</p>
              <p><strong>เลขที่ใบเบิก:</strong> {requisitionNumber}</p>
              <p><strong>สถานที่เบิก:</strong> {location}</p>
              <p><strong>ชื่อผู้เบิก:</strong> {currentUser}</p>
            </div>
            <h3 className="text-xl font-semibold mb-4">รายการสินค้า</h3>
            <ul className="mb-4">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between py-2 border-b">
                  <span>{item.name} ({item.orderQuantity})</span>
                  <span>${(item.price * item.orderQuantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mb-4">
              <p><strong>หมายเหตุ:</strong> {notes}</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelRequisition}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmRequisition}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                ตกลงในการเบิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequisitionPage;