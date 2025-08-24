import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Loader } from './components/Loader';
import { useAuth, useGeneral, useProduct } from './store/useStore';
import { socket, fetchData, loadCounts, getPercentage, getUsers, getData } from './utils/https';
import "./App.css"
import ProtectedRoutes from './components/ProtectedRoutes';
import ConnectionErr from './components/ConnectionErr';
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Navbar from './pages/Navbar'
import Orders from './pages/Orders'
import Sidebar from './pages/Sidebar'
import Stats from './pages/Stats'
import Stock from './pages/Stock'

export default function App() {
    const { setProducts } = useProduct()
    const { setAuth } = useAuth()
    const { overlayVisible } = useGeneral()
    const [toggle, setToggle] = useState(false)
    const [online, setOnline] = useState(navigator.onLine)

    useEffect(() => {
        window.addEventListener('online', () => setOnline(true));
        window.addEventListener('offline', () => setOnline(false));

        return () => {
            window.removeEventListener('online', () => setOnline(true));
            window.removeEventListener('offline', () => setOnline(false));
        };
    }, [])

    useEffect(() => {
        socket.on("connect", () => {
            loadCounts()
            getPercentage()
            getData(new Date().getFullYear(), new Date().toLocaleString("default", { month: "short" }))
            fetchData()
            getUsers()
        })
        socket.on("invalid token", () => {
            setAuth(false)
        })
        socket.on("test", () => {
            console.log("test successful")
        })
        socket.on("addItem", (arg) => {
            setProducts((prev) => [...prev, arg])
        })
        socket.on("editItem", (arg) => {
            setProducts((prev) => {
                const target = prev.find((item) => item._id === arg?._id);
                if (!target) return prev
                console.log(target._id)
                const updated = prev.map((item) => {
                    if (item._id === arg?._id) {
                        return {
                            ...arg
                        };
                    }
                    return item;
                });
                return updated
            })
        })
        socket.on("deleteItem", (arg) => {
            setProducts((prev) => {
                return prev.filter(i => i._id !== arg)
            })
        })
        socket.on("purchaseOrder", (arg) => {
            arg.forEach(i => {
                setProducts((prev) => {
                    const target = prev.find((item) => item._id === i._id);
                    if (!target) return prev
                    const updated = prev.map((item) => {
                        if (item._id === i?._id) {
                            return {
                                ...item, total_stock: target.total_stock - i.maxi_quantity
                            };
                        }
                        return item;
                    });
                    return updated
                })
            })
            getData(new Date().getFullYear(), new Date().toLocaleString("default", { month: "short" }))
        })
    }, [])

    return (
        <>
            {online ? null : <ConnectionErr />}
            <div id="snackbar"></div>
            {overlayVisible && <div id="overlay"></div>}
            <div style={{ display: "flex" }}>
                <HashRouter>
                    <Navbar setToggle={() => setToggle(!toggle)} />
                    <Sidebar toggle={toggle} setToggle={() => { setToggle(!toggle); }} />
                    <ProtectedRoutes>
                        <Routes>
                            <Route index element={<Dashboard setToggle={() => setToggle(true)} />} />
                            <Route path="/stocks" element={<Stock />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/stats" element={<Stats />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<div style={styles.invalidRoute}><h1>Page Not Found!</h1></div>} />
                        </Routes>
                    </ProtectedRoutes>
                </HashRouter>
            </div>
            <Loader />
        </>
    )
}

const styles = {
    invalidRoute: {
        width: "100vh",
        height: "100vh",
        display: "flex",
        flex: 1,
        color: "#fff",
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9000,
        // overflow: "none"
    }
}