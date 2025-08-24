import React, { useContext } from "react";
import { useLocation } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai"
import { IoIosNotifications } from "react-icons/io"
import { MdMessage } from "react-icons/md"
import { UseTextInput } from "../store/useStore";

export default function Navbar({ setToggle }) {
    const {textInput, setInput} = UseTextInput()
    const location = useLocation();
    const loginpath = location.pathname === "/login"
    let ii = location.pathname;
    const path = ii === "/stocks" || ii === "/customers" || ii === "/orders"
    
    return (
        !loginpath &&
        <div style={styles.nav}>
            <div style={styles.openSideBar} onClick={setToggle}>&#9776;</div>
            <div style={styles.navContent}>
                {path &&
                    <div style={{ position: "relative" }}>
                        <input type="text" id="search" placeholder=" search" style={styles.search} value={textInput} onChange={(e) => {setInput(e.target.value)}} maxLength={32}/>
                        <AiOutlineSearch style={{ color: "#888", position: "absolute", right: "90%", bottom: 10, marginRight: 6}} />
                        <p style={{ fontSize: 20, position: "absolute", right: 34, bottom: 6, cursor: "context-menu" }} onClick={() => {setInput("")}}>&#215;</p>
                    </div>
                }
                <div style={styles.navRightIcons}>
                    <MdMessage size={22}/>
                    <span style={styles.count}>{1}</span>
                </div>
                <div style={styles.navRightIcons}>
                    <IoIosNotifications size={24} 
                        // onClick={_ => electron.notificationApi.sendNotification('Hi there!')}
                    />
                    <span style={styles.count}>{9}</span>
                </div>
            </div>
        </div>
        
    )
}

const styles = {
    openSideBar: {
        fontSize: 24,
        paddingTop: 2,
        cursor: "pointer",
        color: "#fff",
    },
    search:{
        outline: "none",
        paddingLeft: 14,
        paddingRight: 18,
        marginRight: 32,
        marginBottom: 8
    },
    navRightIcons: {
        marginLeft: 4,
        marginRight: 8,
        color: "#fff",
        cursor: "context-menu",
        userSelect: "none",
    },
    navContent: {
        width: "100%",
        paddingTop: 8,
        paddingRight: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        backgroundColor: "rgb(18, 18, 25)",
    },
    nav: {
        width: "100vw",
        height: 34,
        display: "flex",
        position: "fixed",
        top: 0,
        backgroundColor: "rgb(18, 18, 25)",
        zIndex: 7
    },
    count: {
        position: 'relative',
        top: '-14px',
        right: '9px',
        backgroundColor: "#f00",
        color: "#fff",
        padding: '1px 4px',
        fontSize: 8,
        fontWeight: "bold",
        border: "1px solid rgb(18, 18, 25)",
        borderRadius: '50%',
    }
}