import React, { Suspense, useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import AddNewItem from "../components/AddNewItem";
import NewStock from "../components/NewStock";
import { useGeneral, useProduct, UseTextInput } from "../store/useStore";
import { delData, fetchUnavailable, restoreData, url } from "../utils/https";

export default function Stock() {
    const { products } = useProduct()
    const { setOverlayVisible } = useGeneral()
    const { textInput } = UseTextInput()
    const [cate_gory, setCategory] = useState("all")
    const [overlayDiv, setOvelayDiv] = useState("")
    const [dataTitle, setDataTitle] = useState(0)
    const [unavailable, setUnavailable] = useState([])
    const [dataX, setDataX] = useState(products)
    const [currVal, setCurrVal] = useState({})
    const [newItem, setNewItem] = useState("none")
    const [newStock, setNewStock] = useState("none")
    const outOfStock = products.filter(i => i.total_stock < 1)
    let displayData;
    let matchCheck = textInput.toUpperCase()

    const getCategory = (event) => {
        setCategory(event.target.value)
        return (event.target.value)
    }
    const categories = [...new Set(dataX?.map?.(item => item.category))];
    categories?.map(i => {
        switch (cate_gory) {
            case "all":
                displayData = dataX
                break;
            case i:
                displayData = dataX.filter(item => {
                    return i === item.category
                })
                break;
            default:
                break;
        }
    })

    const filteredData = displayData?.filter(item => {
        return matchCheck === item.name.toUpperCase().substr(item.name.toUpperCase().indexOf(matchCheck), textInput.length)
    })

    useEffect(() => {
        fetchUnavailable(setUnavailable)
    }, [])

    useEffect(() => {
        setDataX(products)
    }, [products])

    function DelModal() {
        return (
            <>
                {overlayDiv &&
                    <div style={styles.ovelayForDel}>
                        <p style={{ margin: 20 }}>
                            {overlayDiv === "remove" && "Mark unavailable?"}
                            {overlayDiv === "restore" && "Restore?"}
                            <br />
                            <span style={{ color: "green", fontSize: "26px", }}>{currVal.name}</span>
                        </p>
                        <div style={styles.confirmDiv}>
                            <input style={styles.button} type="button" value="CANCEL" onClick={() => { setOverlayVisible(false); setOvelayDiv(false) }} />
                            <input style={{ ...styles.button, backgroundColor: overlayDiv === "remove" ? "#f00" : "#0f0" }} type="button" value="CONFIRM" onClick={() => { overlayDiv === "remove" ? delData(currVal, setUnavailable, setOvelayDiv) : restoreData(currVal, setUnavailable, setOvelayDiv) }} />
                        </div>
                    </div >
                }
            </>
        )
    }

    function Edit({ i }) {
        return (
            <>
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", cursor: "pointer" }}>
                    {
                        dataTitle === 0 ?
                            <>
                                <AiOutlineEdit color="rgb(0, 98, 128)" onClick={() => {
                                    setCurrVal(dataX.find(j => j._id == i._id));
                                    setNewItem("block")
                                }} />
                                <div style={styles.editItem} onClick={() => { setOverlayVisible(true); setCurrVal(i); setOvelayDiv("remove") }}>&#215;</div>
                            </>
                            : dataTitle === 1 ?
                                <div style={{ ...styles.editItem, color: "#0f5" }} onClick={() => { setOverlayVisible(true); setCurrVal(i); setOvelayDiv("restore") }}>&#10003;</div>
                                : null
                    }
                </div>
            </>
        )
    }

    return (
        <>
            <div className="tt" style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <nav style={styles.nav}>
                    <h3>Stock</h3>
                    <div>
                        <select id="cate_gory" name="cate_gory" value={cate_gory} style={styles.selector} onChange={getCategory}>
                            <option value="all">All Items</option>
                            {categories?.map((i) =>
                                <option key={i} value={i}>{i}</option>
                            )}
                        </select>
                    </div>
                    <div style={{ display: "flex", marginLeft: "auto" }}>
                        <div className="navlist" style={{ ...styles.navlist, color: dataTitle === 0 && "#fff", backgroundColor: dataTitle === 0 && "#121219" }} onClick={() => { setDataTitle(0); setDataX(products) }}>
                            Available Items
                        </div>
                        <div className="navlist" style={{ ...styles.navlist, color: dataTitle === 1 && "#fff", backgroundColor: dataTitle === 1 && "#121219" }} onClick={() => { setDataTitle(1); setDataX(unavailable) }}>
                            Unavailable Items
                        </div>
                        <div className="navlist" style={{ ...styles.navlist, color: dataTitle === 2 && "#fff", backgroundColor: dataTitle === 2 && "#121219" }} onClick={() => { setDataTitle(2); setDataX(outOfStock) }}>
                            Out of Stock
                        </div>
                        <div className="navlist" style={{ ...styles.navlist, color: dataTitle === 3 && "#fff", backgroundColor: dataTitle === 3 && "#121219" }} onClick={() => { setDataTitle(3); setOverlayVisible(true); setNewStock("block") }}>
                            New Stock
                        </div>
                        <div className="navlist" style={{ ...styles.navlist, color: dataTitle === 4 && "#fff", backgroundColor: dataTitle === 4 && "#121219" }} onClick={() => { setDataTitle(4); setOverlayVisible(true); setNewItem("block") }}>
                            New Item
                        </div>
                    </div>
                </nav>
                <table style={{ paddingTop: 58, overflowY: "scroll" }}>
                    <thead style={{ position: "sticky", top: 60, backgroundColor: "#f8f9fa" }}>
                        <tr>
                            <th>image</th>
                            <th>name</th>
                            <th>quantity</th>
                            <th>mini price</th>
                            <th>mini unit</th>
                            <th>maxi price</th>
                            <th>maxi unit</th>
                            <th>Total Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Suspense fallback={<div className="loader"></div>}>
                            {matchCheck === "" ?
                                displayData?.map((i) =>
                                    <tr key={i._id}>
                                        <td><img src={`${url}/${i.img}`} alt={'\u00A0'} width="120" height="75" /></td>
                                        <td>{i.name}</td>
                                        <td>{i?.per} {i.mini_unit}s per {i.maxi_unit}</td>
                                        <td>{i.mini_price}</td>
                                        <td>{i.mini_unit}</td>
                                        <td>{i.maxi_price}</td>
                                        <td>{i.maxi_unit}</td>
                                        <td>{i.total_stock}</td>
                                        <td><Edit i={i} /></td>
                                    </tr>
                                )
                                :
                                filteredData?.map((i) =>
                                    <tr key={i._id}>
                                        <td><img src={`${url}/${i.img}`} alt={'\u00A0'} width="120" height="75" /></td>
                                        <td>{i.name}</td>
                                        <td>{i?.per} {i.mini_unit}s per {i.maxi_unit}</td>
                                        <td>{i.mini_price}</td>
                                        <td>{i.mini_unit}</td>
                                        <td>{i.maxi_price}</td>
                                        <td>{i.maxi_unit}</td>
                                        <td>{i.total_stock}</td>
                                        <td><Edit i={i} /></td>
                                    </tr>
                                )
                            }
                        </Suspense>
                    </tbody>
                </table>
                <AddNewItem currVal={currVal} setCurrVal={setCurrVal} setDataTitle={setDataTitle} newItem={newItem} setNewItem={setNewItem} categories={categories} />
                <NewStock currVal={currVal} setCurrVal={setCurrVal} setDataTitle={setDataTitle} newStock={newStock} setNewStock={setNewStock}/>
            </div>
            <DelModal />
        </>

    )
}

const styles = {
    button: {
        width: 66,
        height: 28,
        marginInline: 8,
        outline: "none",
        border: "1px solid grey",
        borderRadius: 4,
        color: "white",
        backgroundColor: "grey"
    },
    confirmDiv: {
        position: "absolute",
        left: "50%",
        bottom: 0,
        transform: "translate(-50%,-50%)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    editItem: {
        fontSize: 24,
        marginBottom: 6,
        marginLeft: 10,
        fontWeight: "bold",
        color: "#f00",
        userSelect: "none"
    },
    nav: {
        width: "100%",
        height: 26,
        marginTop: 34,
        display: "flex",
        // justifyContent: "space-betwwen",
        // alignItems: "center",
        position: "fixed",
        backgroundColor: "#78759f",
        zIndex: 4
    },
    navlist: {
        paddingInline: 4,
        paddingTop: 3,
        marginInline: 20,
        fontSize: 14,
        fontWeight: 700
    },
    ovelayForDel: {
        position: "fixed",
        top: "50%",
        left: "50%",
        width: "400px",
        minHeight: "180px",
        borderRadius: "16px",
        textAlign: "center",
        fontSize: "30px",
        zIndex: 8,
        backgroundColor: "white",
        textWrap: "wrap",
        transform: "translate(-50%,-50%)",
    },
    selector: {
        backgroundColor: "lightgrey",
        fontSize: 14,
        fontWeight: 700,
        // height: "100%",
        marginLeft: 20,
        outline: "none",
        border: "none",
        cursor: "grab"
    }
}

