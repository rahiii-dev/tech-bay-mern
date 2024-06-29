import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useState } from "react";

interface User {
    _id : string;
    fullName: string;
    email: string;
    date: string;
    isBlocked: boolean;
}

const users: User[] = [
  { _id: '4', fullName: "Alice Johnson", email: "alice@gmail.com", date: "22 June 2022", isBlocked: true },
  { _id: '5', fullName: "Charlie Brown", email: "charlie@gmail.com", date: "23 June 2022", isBlocked: false },
  { _id: '6', fullName: "David Wilson", email: "david@gmail.com", date: "24 June 2022", isBlocked: true },
  { _id: '1', fullName: "John Doe", email: "john@gmail.com", date: "19 June 2022", isBlocked: false },
  { _id: '2', fullName: "Jane Doe", email: "jane@gmail.com", date: "20 June 2022", isBlocked: true },
  { _id: '3', fullName: "Bob Smith", email: "bob@gmail.com", date: "21 June 2022", isBlocked: false },
  { _id: '7', fullName: "Eve White", email: "eve@gmail.com", date: "25 June 2022", isBlocked: false },
  { _id: '8', fullName: "Frank Miller", email: "frank@gmail.com", date: "26 June 2022", isBlocked: true },
  { _id: '9', fullName: "Grace Lee", email: "grace@gmail.com", date: "27 June 2022", isBlocked: false },
  { _id: '10', fullName: "Hannah Young", email: "hannah@gmail.com", date: "28 June 2022", isBlocked: true }
];

const filterUsers = (users: User[], filter:string): User[] => {
  switch (filter) {
    case 'blocked':
      return users.filter((user) => user.isBlocked);
    case 'unblocked':
      return users.filter((user) => !user.isBlocked);
    default:
      return users;
  }
};

const Customers = () => {
  const [filter, setFilter] = useState("all");

  const filteredCustomers = filterUsers(users, filter);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <Tabs defaultValue="all" className="w-[400px]" onValueChange={setFilter}>
          <TabsList className="flex items-center justify-between gap-2 bg-primary-foreground rounded-sm">
            <TabsTrigger value="all" className="bg-secondary w-full rounded-sm p-1">All</TabsTrigger>
            <TabsTrigger value="blocked" className="bg-secondary w-full rounded-sm p-1">Blocked</TabsTrigger>
            <TabsTrigger value="unblocked" className="bg-secondary w-full rounded-sm p-1">Unblocked</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="text-sm font-medium">
          Showing 1 - 10 of 100
        </div>
      </div>
      <div className="bg-primary-foreground rounded-md shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell>
                  <div>
                    <Button
                      variant={user.isBlocked ? "default" : "destructive"}
                      className="min-w-[80px]"
                      size={"sm"}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Customers;
