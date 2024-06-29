import React from "react";
import Sidebar from "../../components/Admin/Sidebar";
import './AdminLayout.css';
import Header from "../../components/Admin/Header";

type AdminLayoutProp = {
    children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProp) => {
    return (
        <div className="admin-layout-wrapper bg-secondary h-screen w-screen flex overflow-hidden">
            <Sidebar/>
            <div className="flex-grow px-4">
                <Header/>
                <main className="py-3">
                    <div className="h-full overflow-x-hidden overflow-y-scroll custom-scrollbar relative">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
