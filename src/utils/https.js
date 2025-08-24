import { io } from 'socket.io-client';
import { useAuth, useCustomer, useDashboard, useGeneral, useProduct, useTodayOrder } from "../store/useStore"
import { showSnackbar } from "./showSnackBar"
const { setAuth } = useAuth.getState()
const { setProducts } = useProduct.getState()
const { setCounts, setMonthData, setPercentData } = useDashboard.getState()
const { setCustomers } = useCustomer.getState()
const { setTodayOrder } = useTodayOrder.getState()
const { setOverlayVisible } = useGeneral.getState()

const showLoader = () => {
    document.getElementsByClassName("loadercontainer")[0].style.display = "block";
}

const hideLoader = () => {
    setTimeout( () => {document.getElementsByClassName("loadercontainer")[0].style.display = "none"}
    , 200)
}

export const url = "https://localhost:3030"
export const socket = io(url, {
    withCredentials: true
})

//COMPONENTS
//NewStock
export const addStock = async (selectItem, stockCount, price, info, reset) => {
    try {
        const res = await fetch(`${url}/admin/add-stock`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                itemId: selectItem._id,
                stockCount: stockCount,
                price: price,
                info: info
            })
        })
        const val = await res.json();
        if (val.success === true) {
            setProducts((prev) =>
                prev.map((i) => {
                    if (i._id === selectItem._id) {
                        return {
                            ...i, total_stock: Number(selectItem.total_stock) + Number(stockCount)
                        };
                    }
                    return i
                })
            );
            showSnackbar(`${selectItem.name} updated &#10004;`, "success")
            reset()
        } else {
            throw new Error("An error occured while saving")
        }

    } catch (err) { showSnackbar(err.message + " &#10006;", "error"); console.log(err) }
}

//AddNewItem.js
export const addItem = async (currVal, setDataTitle, closeAddItem) => {
    const img = document.getElementById('img').files[0];
    const formData = new FormData()
    for (const i in currVal) {
        formData.append(i, currVal[i])
    }
    if (img) {
        formData.set("img", img)
    }
    try {
        const res = await fetch(`${url}/admin/add-item`, {
            method: "PUT",
            body: formData
        })
        const val = await res.json();
        if (val.success === true) {
            showSnackbar(`${currVal.name} saved successfully &#10004;`, "success")
            closeAddItem()
        } else {
            throw new Error("An error occured while saving")
        }
        setDataTitle(0)
    } catch (err) { showSnackbar(err.message + " &#10006;", "error"); }
}

//PAGES
//App.js
export const getData = async (year, month) => {
    const temp_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
    try {
        let today = year === new Date().getFullYear() && month === new Date().toLocaleString("default", { month: "short" })
        const res = await fetch(`${url}/admin/history`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                year: year,
                month: temp_months.indexOf(month),
                today: today
            })
        })
        const val = await res.json()
        if (val.success === true) {
            setMonthData(val.data)
            if (today) setTodayOrder(val.todayOrder)
        }
    } catch (err) {
        showSnackbar("an error occured" + " &#10006;", "error")
    }
}

export const fetchData = async () => {
    showLoader()
    try {
        const res = await fetch(`${url}/admin/food`, {
            method: "GET",
            credentials: "include"
        })
        const jsonresult = await res.json()
        setProducts(jsonresult)
    } catch (err) { showSnackbar(err.message + " &#10006;", "error") }
    finally {
        hideLoader()
    }
}

export const loadCounts = async () => {
    try {
        const res = await fetch(`${url}/admin/count`, {
            credentials: "include"
        })
        const val = await res.json()
        setCounts(val)
    } catch (err) {
        console.log(err)
        alert("cant load counts")
    }
}

export const getPercentage = async () => {
    try {
        const res = await fetch(`${url}/admin/percent`, {
            credentials: "include"
        })
        const val = await res.json()
        if (val.success === true) {
            console.log(val.data)
            setPercentData(val.data)
        }
    } catch (err) {
        console.log(err)
    }
}

export const getUsers = async () => {
    showLoader()
    try {
        const res = await fetch(`${url}/admin/customers`, {
            method: "GET",
            credentials: "include"
        })
        const jsonresult = await res.json()
        setCustomers(jsonresult)
    } catch (err) { showSnackbar(err.message + " &#10006;", "error") }
    finally {
        hideLoader()
    }
}

//Stock.js
export const delData = async (currVal, setUnavailable, setOvelayDiv) => {
    showLoader()
    try {
        const removal = await fetch(`${url}/admin/${currVal._id}`, { method: "DELETE" })
        const res = await removal.json()
        if (res.success === true) {
            setProducts((prev) => prev.filter(i => i._id !== currVal._id))
            setUnavailable((prev) => [...prev, currVal])
            showSnackbar(`${currVal.name} deleted`, "success")
        }
        else {
            showSnackbar(`Error deleting ${currVal.name} &#10006;`, "error")
        }
    } catch (err) { showSnackbar(`an error occured &#10006;`, "error") }
    finally {
        hideLoader()
        setOvelayDiv(false)
        setOverlayVisible(false)
    }
}

export const fetchUnavailable = async (setUnavailable) => {
    try {
        const res = await fetch(`${url}/admin/unavailable`, {
            method: "GET",
            credentials: "include"
        })
        const jsonresult = await res.json()
        setUnavailable(jsonresult)
    } catch (err) { showSnackbar(err.message + " &#10006;", "error") }
    finally {
    }
}

export const restoreData = async (currVal, setUnavailable, setOvelayDiv) => {
    showLoader()
    try {
        const restore = await fetch(`${url}/admin/${currVal._id}`, { method: "PUT" })
        const res = await restore.json()
        if (res.success === true) {
            setUnavailable((prev) => prev.filter(i => i._id !== currVal._id))
            setProducts((prev) => [...prev, currVal])
            showSnackbar(`${currVal.name} restored`, "success")
        }
        else {
            showSnackbar(`Error restoring ${currVal.name} &#10006;`, "error")
        }
    } catch (err) { showSnackbar(`an error occured &#10006;`, "error") }
    finally {
        hideLoader()
        setOvelayDiv(false)
        setOverlayVisible(false)
    }
}

//Customers.js
export const getSingleUser = async (foundCustomerId, setSelectedCustomer) => {
    showLoader()
    try {
        const res = await fetch(`${url}/admin/single-customer/${foundCustomerId}`, {
            method: "GET",
            credentials: "include"
        })
        const jsonresult = await res.json()
        setSelectedCustomer(jsonresult)
    } catch (err) { showSnackbar(err.message + " &#10006;", "error") }
    finally {
        hideLoader()
    }
}

//Sidebar.js
export const logout = async () => {
    showLoader()
    try {
        const res = await fetch(`${url}/admin/logout`, {
            credentials: "include"
        })
        const val = await res.json()
        if (val.success === true) {
            setAuth(!val.success)
            showSnackbar("logged out" + " &#10004;", "success")
            hideLoader()
            socket.disconnect()
        }
        else {
            showSnackbar("an error occured" + " &#10006;", "error")
        }
    } catch (err) { showSnackbar("an error occured" + " &#10006;", "error") }
}

//Login.js
// const submitForm = async () => {
//     try {
//         setLoading(true)
//         setErr(false)
//         const res = await fetch(`${url}/admin/login`, {
//             method: "POST",
//             credentials: "include",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 email: email,
//                 password: password,
//                 remember: checked
//             })
//         });
//         const val = await res.json()
//         if (val.success === true) {
//             navigate("/", { replace: true })
//             setAuth(true)
//             socket.connect()
//         } else if (val.message !== undefined) {
//             setResText(val.message)
//         }
//     } catch (err) {
//         console.error(err)
//         setErr(true)
//         setResText("an error occured, try again later.")
//     }
//     finally {
//         setLoading(false)
//     }
// }