import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { socket, url } from "../utils/https";
import { useAuth } from "../store/useStore";

export default function Login() {
    const navigate = useNavigate()
    const { setAuth } = useAuth()
    const [email, setEmail] = useState("admin1@gmail.com")
    const [password, setPassword] = useState("Admin12345.")
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(false)
    const [hover, setHover] = useState(false)
    const [resText, setResText] = useState('\u00A0')

    const submitForm = async () => {
        try {
            setLoading(true)
            setErr(false)
            const res = await fetch(`${url}/admin/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    remember: checked
                })
            });
            const val = await res.json()
            if (val.success === true) {
                navigate("/", { replace: true })
                setAuth(true)
                socket.connect()
            } else if (val.message !== undefined) {
                setResText(val.message)
            }
        } catch (err) {
            console.error(err)
            setErr(true)
            setResText("an error occured, try again later.")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div style={styles.parent}>
                <div style={styles.logo}>
                    <img src={"src/assets/backdrop.png" || require("../assets/backdrop.png")} alt="Ruteso" width="100%" height="100%" />   {/* first src for electron */}
                </div>
                <div style={styles.login_container}>
                    <div style={styles.login}>
                        <h1 style={{ marginBottom: 48, color: "#fff" }}>Welcome Back!</h1>
                        <label htmlFor="email" style={{ marginBottom: 4 }}>Username</label>
                        <input style={styles.input} type="email" placeholder="email" id="email" defaultValue={email} onChange={(e) => { setEmail(e.target.value) }} onFocus={() => setResText('\u00A0')} />
                        <br />
                        <label htmlFor="password" style={{ marginBottom: 4 }}>Password</label>
                        <div style={{ position: "relative" }}>
                            <input style={styles.input} type={passwordVisible ? "text" : "password"} placeholder="Admin12345." id="password" defaultValue={password} onChange={(e) => { setPassword(e.target.value) }} />
                            {
                                passwordVisible ?
                                    <FaEyeSlash style={{...styles.passwordIcons, color: hover ? "#444" : "#ccc"}} onClick={() => { setPasswordVisible(p => !p) }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} />
                                    :
                                    <FaEye style={{...styles.passwordIcons, color: hover ? "#444" : "#ccc"}} onClick={() => { setPasswordVisible(p => !p) }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} />
                            }
                        </div>
                        <div style={{ marginTop: 56, marginBottom: 32 }}>
                            <input type="checkbox" style={{ accentColor: "rgba(18, 18, 25, 0.2)" }} checked={checked} onChange={() => setChecked(p => !p)} /> <span>Remember me</span>
                        </div>
                        <button style={styles.button} id="form" onClick={submitForm}>SUBMIT</button>
                        <p style={{ marginLeft: "auto", cursor: "pointer", userSelect: "none" }} onClick={() => console.log(98765)}>forgot password?</p>
                        <span id="res" className={loading ? "loading" : "notloading"} style={{ alignSelf: "center", marginTop: 46, color: err ? "#f44" : "" }}>{resText}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = {
    button: {
        color: "#fff",
        backgroundColor: "#00f",
        height: "32px",
        width: "100%",
        borderRadius: 6,
        border: "2px solid rgba(0, 0, 255, 0.1)"
    },
    input: {
        fontWeight: "bold",
        fontSize: 14,
        width: "100%",
        height: "32px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        outlineColor: "#ccc",
        paddingLeft: "6px"
    },
    login: {
        width: "60%",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
    },
    login_container: {
        color: "#ccc",
        backgroundColor: "rgb(18, 18, 25)",
        width: "40%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    },
    logo: {
        backgroundColor: "rgb(18, 18, 25)",
        width: "60%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    parent: {
        width: "100%",
        display: "flex",
        overflow: "hidden",
        whiteSpace: "nowrap",
    },
    passwordIcons: {
        fontSize: 20,
        position: "absolute",
        right: 12,
        bottom: 6,
        cursor: "pointer"
    }
}