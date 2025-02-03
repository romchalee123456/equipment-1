import React from 'react';

interface Equipment {
  id: number;
  name: string;
  description: string;
  status: string;
  location: string;
}

interface TableProps {
  equipment: Equipment[];
}

export function Table({ equipment }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {equipment.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${item.status === 'available' ? 'bg-green-100 text-green-800' : 
                    item.status === 'in-use' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TableLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-16 bg-gray-200" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-t border-gray-200">
          <div className="grid grid-cols-5 gap-4 p-4">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}