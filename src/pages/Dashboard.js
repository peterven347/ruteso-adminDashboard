import React, { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import { FaCoins, FaMedal } from 'react-icons/fa';
import { PiUsersThreeFill } from "react-icons/pi"
import { RiShoppingCartFill } from "react-icons/ri"
import { useNavigate } from 'react-router-dom';
import { getData } from "../utils/https";
import { useAuth, useDashboard, useProduct } from "../store/useStore";

const START_YEAR = 2020

export default function Dashboard({ setToggle }) {
    const navigate = useNavigate()
    const { counts, monthData, percentData } = useDashboard()
    const { auth } = useAuth()
    const { products } = useProduct()
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().toLocaleString("default", { month: "short" }))
    const temp_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
    const months = year == new Date().getFullYear() ? temp_months.slice(0, temp_months.indexOf(new Date().toLocaleString("default", { month: "short" })) + 1) : temp_months
    let noOfDays = year == new Date().getFullYear() && month == new Date().toLocaleString("default", { month: "short" }) ?
        new Date().getDate() : new Date(+year, months.indexOf(month) + 1, 0).getDate()

    const getYear = (event) => {
        setYear(event.target.value)
        if (event.target.value == new Date().getFullYear() && months.indexOf(month) > months.indexOf(new Date().toLocaleString("default", { month: "short" }))) {
            setMonth(new Date().toLocaleString("default", { month: "short" }))
        }
        getData(event.target.value, month)
    }
    const getMonth = (event) => {
        setMonth(event.target.value)
        getData(year, event.target.value)
    }

    useEffect(() => {
        setToggle(true)
        if (!auth) {
            setTimeout(() => (
                navigate("/login")
            ), 300)
            return
        }
    }, [auth]);

    useEffect(() => {
        var chart
        (async function () {
            chart = new Chart(
                document.getElementById('ctx'),
                {
                    data: {
                        datasets: [
                            {
                                type: 'bar',
                                label: 'Customers',
                                data: Array.from({ length: noOfDays }, (_, i) => monthData[i + 1]?.totalCustomers || 0),
                            },
                            {
                                type: 'line',
                                label: 'Orders',
                                data: Array.from({ length: 31 }, (_, i) => monthData[i + 1]?.totalOrders || 0),
                            }
                        ],
                        labels: Array.from({ length: noOfDays }, (_, i) => i + 1)
                    }
                }
            )
        })();
        return () => { chart.destroy() }
    }, [monthData])

    function Card(props) {
        return (
            <div style={{ ...styles.card, backgroundColor: props.bg }}>
                <div>
                    <h2>{props.cardtextval}</h2>
                    <h6>{props.cardtext}</h6>
                </div>
                <div>{props.icon}</div>
            </div>
        )
    }

    function PlateCard(props) {
        return (
            <div style={{ ...styles.plateCard, ...props.styles }}>
                <p style={styles.plateCard_title}>{props.title}</p>
                <hr />
                <div style={styles.plateCardScroll}>
                    <ul style={{ listStyleType: "square", marginLeft: 22 }}>
                        {props.children?.map((i, index) => (
                            <li key={index} style={{ fontWeight: 600 }}>{i}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <>
            <div style={{ marginLeft: 234, marginRight: 6, marginTop: 40, overflow: "hidden" }}>
                <div style={{ display: "flex", userSelect: "none" }}>
                    <div style={styles.cardscontainer}>
                        <div style={{ width: "100%", display: "flex", paddingInline: 10, justifyContent: "space-between" }}>
                            <p style={{ fontWeight: "bold", color: "rgb(18, 18, 25)" }}>Total Customers: {counts.noOfCustomers}</p>
                            {/* <p style={{ color: "rgb(18, 18, 25)" }}>failed delivery: <span style={{ color: true ? "#000" : "#f00" }}>{0}</span></p> */}
                        </div>
                        <p style={{ marginLeft: 10 }}>{'\u00A0'}</p>
                        <div style={{ display: "flex" }}>
                            <Card cardtext="Active Customers" cardtextval={counts.noOfActiveCustomers} icon={<PiUsersThreeFill size={46} />} bg="orange" />
                            <Card cardtext="Items" cardtextval={counts.noOfFoodItems} icon={<RiShoppingCartFill size={46} />} bg="blue" />
                        </div>
                        <div style={{ display: "flex" }}>
                            <Card cardtext="Revenue" cardtextval={`₦${counts.revenue}`} icon={<FaCoins size={46} />} bg="lime" />
                            <Card cardtext="Month Score" cardtextval="15%" icon={<FaMedal size={46} />} bg="coral" />
                        </div>
                        <p style={{ marginLeft: 10 }}>{'\u00A0'}</p>
                    </div>
                    <hr />
                    <div style={{ backgroundColor: "#fefefe", color: "rgb(18, 18, 25)" }}>
                        <select id="month" value={month} onChange={getMonth} style={{ outline: "none", boxShadow: "none" }}>
                            <option value={month}>{month}</option>
                            {months?.filter(i => i !== month).map((i) =>
                                <option key={i} value={i}>{i}</option>
                            )}
                        </select>
                        <select id="year" value={year} onChange={getYear} style={{ outline: "none" }}>
                            {Array.from({ length: new Date().getFullYear() + 1 - START_YEAR }, (_, i) => i - (new Date().getFullYear() - START_YEAR)).map((i) =>
                                <option key={i} value={(new Date().getFullYear() + i).toString()}>{(new Date().getFullYear() + i).toString()}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <div style={styles.graph}>
                            <canvas id="ctx"></canvas>
                        </div>
                    </div>
                </div>
                <div style={{ width: "100%", marginTop: 8, backgroundColor: "#fff" }}>
                    <p>{'\u00A0'}</p>
                    <div style={{ height: "auto", display: "flex", justifyContent: "space-evenly" }}>
                        <PlateCard title="Top Earners" children={percentData.map(i => i.percent > 75 && `${i.name} ${i.percent}%`).filter(Boolean)} />
                        <PlateCard title="SLOB" children={percentData.map(i => i.percent < 45 && `${i.name} ${i.percent}%`).filter(Boolean)} />
                        <PlateCard title="About to Expire" children={products
                            .filter(i => new Date(i.exp_date).getTime() < new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)))
                            .map(i => `${i.name} (${Math.round((new Date(i.exp_date).getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days)`)} styles={{ width: 338 }} />
                        <PlateCard title="Customers' Feedback" children={["User 1", "User 2", "User 3"]} styles={{ width: 384 }} />
                    </div>
                </div>
            </div>
        </>
    )
}


const styles = {
    card: {
        width: 228,
        height: 100,
        borderRadius: 6,
        margin: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        color: "#fff",
    },
    cardscontainer: {
        width: "50%",
        whiteSpace: "wrap",
        padding: 8,
        display: "flex",
        flexWrap: "wrap",
        backgroundColor: "#fff",
        alignItems: " flex-start",
    },
    graph: {
        width: 708,
        color: "rgb(18, 18, 25)",
        backgroundColor: "#fff",
    },
    plateCard: {
        minWidth: 228,
        height: 294,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 8,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        backgroundColor: "rgba(35, 35, 45, 1)",
    },
    plateCardScroll: {
        color: "rgb(230, 230, 230)",
        marginTop: 8,
        height: "80%",
        overflowY: "auto"
    },
    plateCard_title: {
        margin: 8,
        color: "rgb(240, 240, 240)",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
}