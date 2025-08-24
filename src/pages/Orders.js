import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTodayOrder } from "../store/useStore";

export default function Orders() {
    const navigate = useNavigate()
    const { todayOrder } = useTodayOrder()
    const [curr, setCurr] = useState(0)
    const [hovered, setHovered] = useState(false)
    const userids = Object.keys(todayOrder)
    let currUserId = userids[curr]
    let timeoutId;

    const startTimer = () => {
        timeoutId = setTimeout(() => {
            setHovered(false)
        }, 300)
    }

    const arrowMove = (e) => {
        switch (e) {
            case "ArrowUp":
                setCurr(p => p <= 0 ? Object.keys(todayOrder).length - 1 : p - 1)
                break;
            case "ArrowDown":
                setCurr(p => p === Object.keys(todayOrder).length - 1 ? 0 : p + 1)
                break;
        }
    }

    return (
        <>
            <div style={{ width: "100%" }}>
                <nav style={styles.nav}>
                    <h3>Orders</h3>
                </nav>
                <div style={styles.orderContainer}>
                    <div style={styles.visibleDiv} tabIndex={0} onKeyDown={(e) => arrowMove(e.key)}>
                        {userids.map((i, index) =>
                            <div key={i} style={{ ...styles.triggerDiv, color: index === curr ? "#fff" : "", backgroundColor: index === curr ? "#242432dd" : "" }}
                                onMouseLeave={() => { startTimer() }}
                                onMouseEnter={() => { setCurr(index); clearTimeout(timeoutId); setHovered(true) }}
                                onDoubleClick={() => { navigate("/customers", {state: {userId: i}}) }}>
                                {i}
                                <div style={{...styles.triggerDivBall, backgroundColor: todayOrder[i]
                                .some( j => Object.values(j).includes("cancelled") || Object.values(j).includes("failed")) ? "#f00" : "#0d0"}}/>
                            </div>
                        )}
                    </div>
                    <div style={{ ...styles.popupDiv, display: hovered ? "block" : "none" }}
                        onMouseLeave={() => { startTimer() }}
                        onMouseEnter={() => { clearTimeout(timeoutId); console.log(JSON.stringify(todayOrder, null, 2)) }}
                    >
                        <div>
                            {todayOrder[currUserId]?.map((order) =>
                                <div key={order._id}>
                                    <div style={styles.contentRow} key={order._id}>
                                        <div style={{ width: "35%", fontWeight: 500 }}>
                                            {order.orders?.map((item, index) =>
                                                <div key={order._id + index}>
                                                    <p>
                                                        {/* why not together */}
                                                        {/* {`${item.maxi_quantity} ${item.maxi_unit} and `}
                                                        {`${item.mini_quantity} ${item.mini_unit}`} of {item.name} at
                                                        {` ${item.maxi_price * item.maxi_quantity}`} + {`${item.mini_price * item.mini_quantity} = `}
                                                        {item.maxi_price * item.maxi_quantity + item.mini_price * item.mini_quantity} */}
                                                        {`${item.maxi_quantity} ${item.maxi_unit} and ${item.mini_quantity} ${item.mini_unit} of ${item.name} at`}
                                                        {` ${item.maxi_price * item.maxi_quantity}`} + {`${item.mini_price * item.mini_quantity} = `}
                                                        {item.maxi_price * item.maxi_quantity + item.mini_price * item.mini_quantity}
                                                    </p>
                                                </div>
                                            )}
                                            <p style={{ marginTop: 4 }}>Total Cost: {order.total_cost}</p>
                                        </div>
                                        <div><p>Mr Sam</p></div>
                                        <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
                                            {/* <div style={{...styles.triggerDivBall, backgroundColor: "red"}}/> */}
                                            <p style={{ color: order.status === "cancelled" || order.status === "failed"? "#f00" : "#080" }}>{order.status}</p>
                                        </div>
                                        <p style={{ fontSize: 12, fontWeight: "normal" }}>{new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                    <p style={{ width: "100%", overflow: "clip", marginBottom: 4, color: "#ccc", whiteSpace: "nowrap" }}>{"_ ".repeat(140)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                : <div style={{ textAlign: "center", fontWeight: "bold" }}>
                    <div className="loader"></div>
                    <div>Loading...</div>
                </div>
            </div>
        </>
    )
}

const styles = {
    contentRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingInlineEnd: 42,
        borderBottomWidth: 10,
        borderColor: "#1860d3",
    },
    nav: {
        width: "100%",
        height: 26,
        display: "flex",
        justifyContent: "space-betwwen",
        marginTop: 34,
        position: "fixed",
        backgroundColor: "#78759f",
        zIndex: 4
    },
    orderContainer: {
        marginTop: 58,
        height: "100vh"
    },
    popupDiv: {
        width: "80%",
        height: "100vh",
        backgroundColor: "#fff",
        position: "absolute",
        top: 60,
        left: "20%",
        paddingLeft: 4,
        paddingBottom: "8%",
        overflowY: "auto"
    },
    triggerDiv: {
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        cursor: "pointer",
        transition: "background-color 0.3s"
    },
    triggerDivBall: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 3
    },
    visibleDiv: {
        width: "20%",
        height: "100%",
        paddingBottom: 90,
        overflowY: "auto",
        outline: "none"
    }
}