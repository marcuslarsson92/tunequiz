'use client';
import React, { useEffect } from "react";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  address: {
    city: string;
  };
}

interface Props {
    items: string [];
    header: string;
}

const UsersPage: React.FC<Props> = ({ items, header }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);

    
    
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch("https://jsonplaceholder.typicode.com/users");
            const data: User[] = await res.json();
            setUsers(data);        
        }
        fetchUsers();
    }, []);

  

    return (
        <>
          <h1 className="text-2xl font-bold">{header}</h1>
    
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border text-black border-gray-300 px-4 py-2">Name</th>
                <th className="border text-black  border-gray-300 px-4 py-2">City</th>
              </tr>
            </thead>
    
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(index);
                    console.log(`Pressed on ${user.name} at index ${index}`);
                  }}
                  className="cursor-pointer hover:bg-gray-200"
                >
                  <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.address.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    };
export default UsersPage;
