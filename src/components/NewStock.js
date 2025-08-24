import React, { useState } from "react"
import { addStock } from "../utils/https"
import { useGeneral, useProduct } from "../store/useStore"
export default function NewStock({ setCurrVal, setDataTitle, newStock, setNewStock }) {
    const { products } = useProduct()
    const { setOverlayVisible } = useGeneral()
    const [item, setItem] = useState("")
    const [stockCount, setStockCount] = useState(0)
    const [price, setPrice] = useState(0)
    const [info, setInfo] = useState("")
    let selectItem = products?.find(i => i.name === item)
    const closeAddItem = (i) => {
        setOverlayVisible(false)
        setNewStock("none")
        setDataTitle(0)
    }
    const reset = () => {
        closeAddItem()
        setItem(""); setStockCount(0); setInfo(""); setDataTitle(0)
    }
    return (
        <>
            <div style={{ ...styles.newStockBox, display: newStock }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <p style={{ fontWeight: "bold", minWidth: "64%" }}>SELECT ITEM</p>
                    <input type="text" list="item" value={item} style={styles.input} required onChange={(e) => { setItem(e.target.value) }} />
                    <datalist id="item">
                        {products?.map(i => <option key={i._id} value={i.name}></option>)}
                    </datalist>
                    <p style={{ minWidth: "64%" }}><span style={{ fontWeight: "bold" }}>STOCK</span>{selectItem?.maxi_unit && ` (${selectItem.maxi_unit}s)`}</p>
                    <input type="number" value={stockCount} style={styles.input} required onChange={(e) => { setStockCount(e.target.value) }} />
                    <p style={{ minWidth: "64%" }}><span style={{ fontWeight: "bold" }}>PRICE</span> (₦)</p>
                    <input type="number" value={price} style={styles.input} required onChange={(e) => { setPrice(e.target.value) }} />
                    <p style={{ minWidth: "64%" }}>Additional Information</p>
                    <textarea style={{ width: "64%", outline: "none" }} cols="45" rows="10" value={info} onChange={(e) => { setInfo(e.target.value) }} ></textarea>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", paddingInlineEnd: 92, marginTop: "14%" }}>
                    <input style={styles.button} type="reset" value="CANCEL" onClick={() => { setCurrVal({}); closeAddItem() }} />
                    <input style={{ ...styles.button, backgroundColor: "green" }} type="submit" value="SAVE" onClick={(e) => { e.preventDefault(); addStock(selectItem, stockCount, price, info, reset) }} />
                </div>
            </div>
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
    input: {
        width: "64%",
        height: "32px",
        padding: 2,
        marginBottom: 32,
        border: "1px solid #eaefef",
        outline: "none",
        backgroundColor: "#fff",
    },
    newStockBox: {
        width: "36%",
        height: "80vh",
        display: "none",
        position: "fixed",
        flexDirection: "column",
        top: 60,
        right: 4,
        padding: 4,
        paddingTop: 22,
        zIndex: 8,
        borderBottomLeftRadius: 12,
        backgroundColor: "#D3D3E3",
    },
}