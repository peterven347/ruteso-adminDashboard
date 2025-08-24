import React, {  } from "react"
import { useGeneral } from "../store/useStore"
import { addItem } from "../utils/https"
export default function AddNewItem({ currVal, setCurrVal, setDataTitle, newItem, setNewItem, categories }) {
    const { setOverlayVisible } = useGeneral()
    const closeAddItem = (i) => {
        setOverlayVisible(false)
        setNewItem("none")
        setDataTitle(0)
    }

    return (
        <>
            <div style={{...styles.addItemBox, display: newItem}}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <p style={{ minWidth: 156 }}>Category: </p>
                    <input type="text" list="category" style={styles.input} value={currVal?.category || ""} autoComplete="true" onChange={(e) => { setCurrVal((prev) => ({ ...prev, category: (e.target.value).toString() })) }} required />
                    <datalist id="category" >
                        {categories?.map((i) =>
                            <option key={i} value={i}>{i}</option>
                        )}
                    </datalist>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <p style={{ minWidth: 156 }}>Name: </p>
                    <input type="text" value={currVal?.name || ""} placeholder="item-name" maxLength="30" style={styles.input} autoComplete="true" onChange={(e) => { setCurrVal((prev) => ({ ...prev, name: (e.target.value).toString() })) }} required />
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <p style={{ minWidth: 156 }}>Mini Price: </p>
                    <input type="text" placeholder="digits" value={currVal?.mini_price || ""} maxLength="30" pattern="^[0-9]+$" title="digits only!" style={styles.input} onChange={(e) => { setCurrVal((prev) => ({ ...prev, mini_price: +(+e.target.value).toFixed(2) })) }} required/>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <p style={{ minWidth: 156 }}>Mini Unit:</p>
                    <input type="text" list="mini_unit" style={styles.input} value={currVal?.mini_unit || ""} autoComplete="true" onChange={(e) => { setCurrVal((prev) => ({ ...prev, mini_unit: (e.target.value).toString() })) }} required/>
                    <datalist id="mini_unit" >
                        <option value="cup" />
                        <option value="carton">Carton</option>
                        <option value="litre">Litre</option>
                    </datalist>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <p style={{ minWidth: 156 }}>Maxi Price: </p>
                    <input type="text" placeholder="digits" value={currVal?.maxi_price || ""} maxLength="30" pattern="^[0-9]+$" title="digits only!" style={styles.input} onChange={(e) => { setCurrVal((prev) => ({ ...prev, maxi_price: +(+e.target.value).toFixed(2) })) }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <p style={{ minWidth: 156 }}>Maxi Unit: </p>
                    <input type="text" list="maxi_unit" value={currVal?.maxi_unit || ""} style={styles.input} onChange={(e) => { setCurrVal((prev) => ({ ...prev, maxi_unit: (e.target.value).toString() })) }} />
                    <datalist id="maxi_unit" >
                        <option value="cup" />
                        <option value="carton">Carton</option>
                        <option value="litre">Litre</option>
                    </datalist>
                </div>
                {currVal.mini_unit && currVal.maxi_unit &&
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                        <p style={{ minWidth: 156 }}>{`${currVal?.mini_unit}s per ${currVal?.maxi_unit}:`}</p>
                        <input id="per" type="text" style={styles.input} onChange={(e) => { setCurrVal((prev) => ({ ...prev, per: e.target.value })) }} required />
                    </div>
                }
                {currVal.maxi_unit &&
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                        <p style={{ minWidth: 156 }}>{`Total ${currVal?.maxi_unit}s:`}</p>
                        <input id="stock" type="text" style={styles.input} onChange={(e) => { setCurrVal((prev) => ({ ...prev, per: e.target.value })) }} required />
                    </div>
                }
                <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <p style={{ minWidth: 156 }}>Expiry Date: </p>
                    <input id="exp_date" type="date" onChange={(e) => { setCurrVal((prev) => ({ ...prev, date: e.target.value })) }} required />
                </div>
                <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
                    <p style={{ minWidth: 156 }}>Food Image:</p>
                    <input id="img" type="file" accept="image/*" required />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", paddingInlineEnd: 18, marginTop: "25%" }}>
                    <input style={styles.button} type="reset" value="CANCEL" onClick={() => { setCurrVal({}); closeAddItem(setDataTitle, closeAddItem) }} />
                    <input style={{ ...styles.button, backgroundColor: "green" }} type="submit" value="SAVE" onClick={(e) => { e.preventDefault(); addItem(currVal, setDataTitle, closeAddItem) }} />
                </div>
            </div>
        </>
    )
}

const styles = {
    addItemBox: {
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
        width: "68%",
        height: "32px",
        padding: 2,
        border: "1px solid #eaefef",
        outline: "none",
        backgroundColor: "white",
    },
}