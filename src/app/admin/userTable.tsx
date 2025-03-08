"use client"; // Marks this as a client component

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

import { useSession } from 'next-auth/react';




interface UserType {
  _id: string;
  userName: string;
  balance?: number;
  numberOfOperations?: number;
  accessToken?: string;
}

interface PageProps {
  initialUsers?: any; // Make it optional
}

const UserTable = ({ initialUsers = [] }: PageProps) => {
  const [users, setUsers] = useState<UserType[]>(initialUsers);


  const handleIncrement = (id: string) => {
    setUsers(
      (prevUsers) =>
        prevUsers.map((user) =>
          user._id === id
            ? { ...user, numberOfOperations: (user.numberOfOperations || 0) + 1 }
            : user
        )
    );


    fetch('/api/admin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        operation: '+'
      })
    });
  };

  const handleDecrement = (id: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id
          ? { ...user, numberOfOperations: (user.numberOfOperations || 0) - 1 }
          : user
      )
    );
    // Optionally, update the database via an API call here.

    fetch('/api/admin', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        operation: '-'
      })
    });

  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Account</TableHead>


          <TableHead >Acess Token</TableHead>

          <TableHead className="text-right">Edit Left</TableHead>

        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium">{user.userName}</TableCell>
            <TableCell>৳ {user.balance || 0}</TableCell>

            
            <TableCell> {user?.accessToken}</TableCell>




            <TableCell className="text-right">
              <div className="flex justify-end items-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDecrement(user._id)}
                >
                  <Minus />
                </Button>
                {user.numberOfOperations || 0}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleIncrement(user._id)}
                >
                  <Plus />
                </Button>
              </div>
            </TableCell>



          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
