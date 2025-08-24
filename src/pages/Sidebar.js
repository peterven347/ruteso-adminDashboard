import React, { } from "react";
import { Link, useLocation } from 'react-router-dom'
import { BiArrowBack, BiBarChart } from "react-icons/bi"
import { MdDashboard, MdWarehouse } from "react-icons/md";
import { PiUsersThreeFill } from "react-icons/pi"
import { RiShoppingCartFill } from "react-icons/ri"
import { logout } from "../utils/https";

export default function Sidebar({ toggle, setToggle }) {
    const location = useLocation()
    const path = location.pathname === '/'
    const loginpath = location.pathname === "/login"

    return (
        !loginpath &&
        <>
            {toggle && <div style={styles.sidebar}>
                {!path ? <div style={styles.closeSideBar} onClick={setToggle}>&#215;</div> : <div style={{ marginTop: 37 }}></div>}
                <div style={styles.linkdiv}>
                    <Link style={styles.linktext} to="/">
                        <MdDashboard color="#fff" size={22} style={styles.icon} />Dashboard
                    </Link>
                </div>
                <div style={styles.linkdiv} onClick={setToggle}>
                    <Link style={styles.linktext} to="/stocks">
                        <MdWarehouse color="#fff" size={22} style={styles.icon} />
                        <p>Stock Inventory</p>
                    </Link>
                </div>
                <div style={styles.linkdiv} onClick={setToggle}>
                    <Link style={styles.linktext} to="/orders">
                        <RiShoppingCartFill color="#fff" size={22} style={styles.icon} />
                        <p>Order Management</p>
                    </Link>
                </div>
                <div style={styles.linkdiv} onClick={setToggle}>
                    <Link style={styles.linktext} to="/customers">
                        <PiUsersThreeFill color="#fff" size={22} style={styles.icon} />
                        <p>Customers</p>
                    </Link>
                </div>
                <div style={styles.linkdiv} onClick={setToggle}>
                    <Link style={styles.linktext} to="/stats">
                        <BiBarChart color="#fff" size={22} style={styles.icon} />
                        <p>Statistics</p>
                    </Link>
                </div>
                <div style={{...styles.linkdiv, ...styles.linktext, marginTop:16, cursor: "pointer"}} onClick={logout}>
                    <BiArrowBack color="#f00" size={22} style={styles.icon} />
                    <p>Logout</p>
                </div>
                <footer style={styles.footer}>
                    <p>Copyright &#169; {new Date().getFullYear()}. Rakumi</p>
                </footer>
            </div>
            }
        </>
    )
}

const styles = {
    linkdiv: {
        marginBottom: 28,
    },
    linktext: {
        fontSize: 14,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        flexShrink: 0,
    },
    icon: {
        minWidth: 40,
        marginRight: 8,
    },
    footer: {
        width: "auto",
        color: "#555",
        marginTop: "auto",
    },
    sidebar: {
        display: "flex",
        flexDirection: "column",
        minWidth: 228,
        height: "100vh",
        backgroundColor: "rgb(18, 18, 25)",
        position: "fixed",
        zIndex: 7,
        textAlign: "center",
        userSelect: "none"
    },
    closeSideBar: {
        fontSize: 32,
        marginTop: -6,
        marginLeft: "auto",
        color: "#fff",
        cursor: "context-menu"
    }
}

