import React, { useState } from 'react';
    import { Package2, Home, Users, ShoppingBag, BarChart2, Settings, ChevronRight } from 'lucide-react';
    import type { OrderHistory } from '../types';
    
    function OrderHistoryPage() {
      const [activeTab, setActiveTab] = useState<'latest' | 'oldest'>('latest');
      const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([
        {
          id: '1',
          date: '2024-01-26',
          documentNo: 'IB-000001',
          location: '122',
          personId: '0003',
          personName: 'นายเอกพล โจมา',
          items: [
            { id: '1', name: 'Product 1', image: '', price: 10, quantity: 10, orderQuantity: 2 },
            { id: '2', name: 'Product 2', image: '', price: 20, quantity: 10, orderQuantity: 1 }
          ],
          total: 40
        },
        {
          id: '2',
          date: '2024-01-27',
          documentNo: 'IB-000002',
          location: '122',
          personId: '0003',
          personName: 'นายเอกพล โจมา',
          items: [
            { id: '3', name: 'Product 3', image: '', price: 15, quantity: 10, orderQuantity: 3 },
            { id: '4', name: 'Product 4', image: '', price: 25, quantity: 10, orderQuantity: 1 }
          ],
          total: 70
        }
      ]);
    
      const sortedOrders = [...orderHistory].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return activeTab === 'latest' ? dateB - dateA : dateA - dateB;
      });
    
      return (
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <span>สินค้า</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium">ประวัติการเบิกสินค้า</span>
              </div>
            </div>
    
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b">
                <div className="flex">
                  <button
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'latest'
                        ? 'border-b-2 border-[#8B4513] text-[#8B4513]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('latest')}
                  >
                    ล่าสุด
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'oldest'
                        ? 'border-b-2 border-[#8B4513] text-[#8B4513]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('oldest')}
                  >
                    เก่าที่สุด
                  </button>
                </div>
              </div>
            </div>
    
            {/* Order History Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 text-sm font-medium text-gray-600">วันที่</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">หมายเลขเอกสาร</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">สถานที่</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">รหัสประจำตัว</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">ชื่อ</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-600">รายการ</th>
                    <th className="text-right p-4 text-sm font-medium text-gray-600">ทั้งหมด</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map(order => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="p-4">{new Date(order.date).toLocaleDateString('th-TH')}</td>
                      <td className="p-4">{order.documentNo}</td>
                      <td className="p-4">{order.location}</td>
                      <td className="p-4">{order.personId}</td>
                      <td className="p-4">{order.personName}</td>
                      <td className="p-4">
                        <ul className="list-disc list-inside">
                          {order.items.map(item => (
                            <li key={item.id} className="text-gray-600">
                              {item.name} ({item.orderQuantity})
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 text-right">${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    
    export default OrderHistoryPage;
