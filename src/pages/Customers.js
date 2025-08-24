import React, { useEffect, useState } from "react";
import Popup from "../components/Popup";
import { GrPowerReset } from "react-icons/gr";
import { useLocation } from 'react-router-dom';
import { useCustomer, UseTextInput, useUrl } from "../store/useStore";
import { getSingleUser } from "../utils/https";

export default function Customers() {
    let foundCustomer;
    const { textInput } = UseTextInput()
    const { customers } = useCustomer()
    const [popup, setPopup] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState({})
    const [userId, setUserId] = useState("");
    const location = useLocation();
    const matchCheck = textInput.toUpperCase()
    const filteredData = customers?.filter?.(i => {
        return userId ? userId === i._id :
            matchCheck === i.email.toUpperCase().substr(i.email.toUpperCase().indexOf(matchCheck), textInput.length)
    })

    const popupFn = (email) => {
        setPopup(true)
        foundCustomer = customers.find(customer => customer.email === email);
        getSingleUser(foundCustomer._id, setSelectedCustomer)
        if (email !== foundCustomer.email) {
            alert(email)
        }
    }

    useEffect(() => {
        if (location.state?.userId) {
            setUserId(location.state.userId);
        }
    }, [location.state])

    return (
        <>
            {popup && <Popup data={selectedCustomer} closePopup={() => { setPopup(false); setSelectedCustomer({}) }} />}
            <div style={{ width: "100%" }}>
                <nav style={styles.nav}>
                    <h3>Customers</h3>
                    {userId && <GrPowerReset style={{marginLeft: 30, marginTop: 5}} size={18} onClick={() => setUserId("")}/>}
                </nav>
                {customers.length > 0 ?
                    <table style={{ paddingTop: 58, overflowY: "scroll", width: "100%" }}>
                        <thead style={{ position: "sticky", top: 60, backgroundColor: "#f8f9fa", }}>
                            <tr>
                                {/* <th>UserId</th> */}
                                <th>E-mail</th>
                                <th>Date Registered</th>
                                <th>Last Purchase Date</th>
                                {/* <th>Complaints</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {matchCheck === "" && !userId ?
                                customers?.map?.((i) =>
                                    <tr key={i._id || i.id}>
                                        <td style={{ cursor: "pointer" }} onDoubleClick={() => popupFn(i.email)}>{i.email}</td>
                                        <td style={{ textTransform: "capitalize", fontSize: 14 }}>{`${(new Date(i.createdAt).toDateString().split(" ")[0]).toUpperCase()} ${new Date(i.createdAt).toLocaleString()}`}</td>
                                        <td style={{ textTransform: "capitalize", fontSize: 14 }}>{i.last_purchase_date && `${(new Date(i.last_purchase_date).toDateString().split(" ")[0]).toUpperCase()} ${new Date(i.last_purchase_date).toLocaleString()}`}</td>
                                    </tr>
                                )
                                :
                                filteredData.map((i) =>
                                    <tr key={i._id || i.id}>
                                        <td style={{ cursor: "pointer" }} onClick={() => popupFn(i.email)}>{i.email}</td>
                                        <td style={{ textTransform: "capitalize", fontSize: 14 }}>{`${(new Date(i.createdAt).toDateString().split(" ")[0]).toUpperCase()} ${new Date(i.createdAt).toLocaleString()}`}</td>
                                        <td style={{ textTransform: "capitalize", fontSize: 14 }}>{i.last_purchase_date && `${(new Date(i.last_purchase_date).toDateString().split(" ")[0]).toUpperCase()} ${new Date(i.last_purchase_date).toLocaleString()}`}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    : <div style={{ textAlign: "center", fontWeight: "bold" }}>
                        <div className="loader"></div>
                        <div>Loading...</div>
                    </div>
                }
            </div>
        </>
    )
}

const styles = {
    nav: {
        width: "100%",
        height: 26,
        display: "flex",
        justifyContent: "space-betwwen",
        marginTop: 34,
        position: "fixed",
        backgroundColor: "#78759f",
        zIndex: 4
    }
}