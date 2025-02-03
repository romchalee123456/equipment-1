import React, { useState, useEffect } from 'react';
    import { Package2, Home, Users, ShoppingBag, BarChart2, Settings, Search } from 'lucide-react';
    import axios from 'axios';
    
    type Product = {
      id: string;
      name: string;
      status: string;
      inventory: number;
      salesChannels: number;
      category: string;
      vendor: string;
    };
    
    function ProductListPage() {
      const [products, setProducts] = useState<Product[]>([]);
      const [activeTab, setActiveTab] = useState('all');
      const [loading, setLoading] = useState(true);
      const [searchTerm, setSearchTerm] = useState('');
      const [currentPage, setCurrentPage] = useState(1);
      const productsPerPage = 10;
    
      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get('https://fakestoreapi.com/products');
            const transformedProducts = response.data.map((item: any) => ({
              id: item.id.toString(),
              name: item.title,
              status: ['Active', 'Draft', 'Archived'][Math.floor(Math.random() * 3)],
              inventory: Math.floor(Math.random() * 100),
              salesChannels: Math.floor(Math.random() * 5),
              category: item.category,
              vendor: 'Neutral Threads'
            }));
            setProducts(transformedProducts);
          } catch (error) {
            console.error('Error fetching products:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProducts();
      }, []);
    
      const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || product.status.toLowerCase() === activeTab;
        return matchesSearch && matchesTab;
      });
    
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
      const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl">กำลังโหลดข้อมูล...</div>
          </div>
        );
      }
    
      return (
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-semibold">สินค้า</h1>
            </div>
    
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-6">
                  <button
                    className={`px-4 py-2 rounded-md ${
                      activeTab === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('all')}
                  >
                    ทั้งหมด
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      activeTab === 'active' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('active')}
                  >
                    กำลังใช้งานอยู่
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      activeTab === 'draft' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('draft')}
                  >
                    แบบร่าง
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      activeTab === 'archived' ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('archived')}
                  >
                    เก็บถาวรแล้ว
                  </button>
                </div>
              </div>
    
              <div className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2"
                    placeholder="ค้นหาสินค้า..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
    
            {/* Product Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">สินค้า</th>
                    <th className="text-left p-4">สถานะ</th>
                    <th className="text-left p-4">สินค้าคงคลัง</th>
                    <th className="text-left p-4">หมวดหมู่</th>
                    <th className="text-left p-4">เวนเดอร์</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{product.name}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          product.status === 'Active' ? 'bg-green-100 text-green-800' :
                          product.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4">{product.inventory} ในสต็อก</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">{product.vendor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
    
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 items-center">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 mx-1 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  &lt;
                </button>
                <span className="mx-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700">
                    {currentPage}
                  </span>
                  of
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700">
                    {totalPages}
                  </span>
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 mx-1 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    export default ProductListPage;
