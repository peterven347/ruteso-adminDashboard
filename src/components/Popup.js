export default function Popup({ data, closePopup }) {
    return (
        <>
            {
                data.length >= 1 ?
                    <div style={styles.popContainer}>
                        <div style={styles.popup}>
                            <div style={styles.closeSideBar} onClick={closePopup}>&#215;</div>
                            <div>
                                <h4 style={{ textAlign: "center" }}>SADIQ PETER</h4>
                                <h5>ORDER HISTORY</h5>
                                <p>Total Purchases: {data.length}</p>
                            </div>
                            <div style={styles.body}>
                                <br />
                                {data.map((order, index) => (
                                    <details key={index}>
                                        <summary style={{ cursor: "pointer" }}>
                                            {new Date(order.createdAt).toDateString()}
                                        </summary>
                                        <div style={{ marginLeft: 16 }}>
                                            {data.find(i => i.createdAt === order.createdAt).orders.map((item, index) => (
                                                <div key={index}>
                                                    {item.maxi_quantity !== 0 && <p>{item.maxi_quantity} {item.maxi_unit} of {item.name} at {item.maxi_price} = {item.maxi_quantity * item.maxi_price}</p>}
                                                    {item.mini_quantity !== 0 && <p>{item.mini_quantity} {item.mini_unit} of {item.name} at {item.mini_price} = {item.mini_quantity * item.mini_price}</p>}
                                                </div >
                                            ))}
                                            <div style={{ margin: "2px 0 10px 0" }}>
                                                <p style={{ fontSize: 14, fontWeight: 600 }}>Total Cost: {order.total_cost}</p>
                                                <p style={{ fontSize: 14, fontWeight: 600 }}>Payment ID: {order.payment_id}</p>
                                                <p style={{ fontSize: 14, fontWeight: 600 }}>Timestamp: {new Date(order.createdAt).toLocaleString()}</p>
                                                {/* <hr style={{ border: "1px dotted #000", marginRight: 16 }} /> */}
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                    : <div style={styles.popup}>
                        <div style={styles.closeSideBar} onClick={closePopup}>&#215;</div>
                        <div style={styles.norecord}>No record found</div>
                    </div>
            }
        </>

    )
}



const styles = {
    body: {
        height: "54vh",
        overflowY: "auto",
    },
    closeSideBar: {
        fontSize: 32,
        position: "absolute",
        top: 8,
        right: 14,
        cursor: "pointer",
    },
    norecord: {
        height: "82%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    popup: {
        width: "40%",
        height: "74vh",
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        padding: 16,
        paddingTop: 50,
        borderRadius: 4,
        backgroundColor: "#fafef9",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
    },
    popContainer: {
        width: "100%",
        height: "100%",
        zIndex: 1,
        position: "absolute",
        backdropFilter: "blur(3px)",
    },
}