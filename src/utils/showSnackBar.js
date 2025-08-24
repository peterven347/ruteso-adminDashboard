export const showSnackbar = (message, status) => {
    var newDiv = document.createElement("p")
    newDiv.innerHTML = message
    newDiv.className = `snackbar ${status}`
    const snackContainer = document.getElementById("snackbar")
    snackContainer.insertBefore(newDiv, snackContainer.firstChild)
    setTimeout(function () {
        newDiv.className = ""
        snackContainer.removeChild(newDiv)
        // document.getElementById("overlay").style.display = "none"
        // document.getElementsByClassName("loadercontainer")[0].style.display = "none";
    }, 2500);
}