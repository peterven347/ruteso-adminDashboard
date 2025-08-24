import React from "react"


export default function connectionErr(){
    return(
        <div style={styles.errNav}>
            <p style={{wordSpacing: 4}}>CONNECT TO INTERNET!</p>
        </div>
    )
}

const styles = {
    errNav: {
        width: "100vw",
        height: 12,
        fontSize: 12,
        position: "fixed",
        display: "flex",
        top: 0,
        color: "#fff",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 8,
        marginBottom: 72
    }
}