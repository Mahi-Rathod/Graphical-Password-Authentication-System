//   Password Authentication Code

var otp = "";
let pass = "";
let imgArray = [];
function myFunction(el) {
    //   console.log(el);
    var x = document.getElementById(el).alt;
    imgArray.push(el);
    pass = pass.concat("", x);
    document.getElementById(el).style.border = "1px solid #ff006a";
    document.getElementById(el).style.boxShadow = "1px 1px 3px #ff006a";
    document.getElementById("pass").value = pass;
}

function refreshpass() {
    document.getElementById("pass").value = "";
    pass = "";
    for (let i = 0; i < imgArray.length; i++) {
        el = imgArray[i];
        document.getElementById(el).style.border = "1px solid rgb(3, 78, 145)";
        document.getElementById(el).style.boxShadow = "1px 1px 3px #00dfc4";
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Shuffle the images within the image-container div
document.addEventListener("DOMContentLoaded", function () {
    const imageContainer = document.querySelector(".image-container");
    const images = Array.from(imageContainer.children);
    shuffleArray(images);

    // Clear the container and append shuffled images
    imageContainer.innerHTML = "";
    images.forEach(function (image) {
        imageContainer.appendChild(image);
    });
});

function nextfield() {
    var x = document.getElementById("uname").value;
    var y = document.getElementById("fname").value;
    var z = document.getElementById("lname").value;
    var v = document.getElementById("email").value;
    var w = document.getElementById("mobile").value;
    if (x == "") {
        customAlert.alert("Please Enter Username");
    } else if (y == "") {
        customAlert.alert("Please Enter FirstName");
    } else if (z == "") {
        customAlert.alert("Please Enter LastName");
    } else if (v == "") {
        customAlert.alert("Please Enter Email");
    } else if (w == "") {
        customAlert.alert("Please Enter Mobile Number");
    } else {
        let validMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (validMail.test(v) == false) {
            customAlert.alert("Enter Valid Email");
        } else {
            document.getElementById("f-field").style.display = "none";
            document.getElementById("i-container").style.display = "flex";
            document.getElementById("s-btn").style.display = "none";
            document.getElementById("next-btn").style.display = "none";
            document.querySelector(".next1").style.display = "block";
            document.getElementById("back-btn").style.display = "block";
            document.getElementById("ref-btn").style.display = "block";
            document.querySelector(".otp-field").style.display = "none";
            document.querySelector(".verify").style.display = "none";
        }
    }
}

function prevfield() {
    document.getElementById("f-field").style.display = "block";
    document.getElementById("i-container").style.display = "none";
    document.getElementById("s-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "block";
    document.getElementById("back-btn").style.display = "none";
    document.querySelector(".back1").style.display = "none";
    document.getElementById("ref-btn").style.display = "none";
    document.querySelector(".next1").style.display = "none";
    document.querySelector(".otp-field").style.display = "none";
    document.querySelector(".verify").style.display = "none";
}

function nextinfield() {
    var x = document.getElementById("uname").value;
    var v = document.getElementById("email").value;
    var w = document.getElementById("mobile").value;
    if (x == "") {
        customAlert2.alert("Please Enter Username");
    } else if (v == "") {
        customAlert2.alert("Please Enter Email");
    } else if (w == "") {
        customAlert2.alert("Please Enter Mobile Number");
    } else {
        let validMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (validMail.test(v) == false) {
            customAlert2.alert("Enter Valid Email");
        } else {
            fetch(`/user_exist/${x}/${v}/`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    data2 = data
                    console.log("User Existence:", data.user_exist);
                    // Process the user existence status as needed
                    if (data.user_exist == 'False') {
                        customAlert2.alert('User does not exist!');
                    }
                    else {
                        new_function();
                    }

                })
                .catch((error) => {
                    console.error("Fetch Error:", error);
                });
        }
    }
}

function prevfield1() {
    nextfield();
    document.querySelector(".back1").style.display = "none";
    document.querySelector(".otp-field").style.display = "none";
}

function prevfield_login() {
    nextinfield();
    document.querySelector(".back1").style.display = "none";
    document.querySelector(".otp-field").style.display = "none";
    document.querySelector(".verify").style.display = "none";
}

// code for otp  generation

function otp_generation(email, uname) {
    var email = email;
    var uname = uname;
    var url = `/ajax-view/${email}/${uname}/`;
    var csrftoken = getCookie("csrftoken");

    fetch(url, {
        method: "POST",
        body: JSON.stringify({ email: email, uname: uname }),
        headers: {
            "Content-Type": "application.json",
            "X-CSRFToken": csrftoken,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            otp = data.otp;
            // console.log("Recieved OTP: ",otp);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//OTP verification

function otp_verification() {
    var gen_otp = otp;
    console.log(gen_otp);
    var ent_otp = document.querySelector("#otp").value;

    if (gen_otp == ent_otp) {
        document.getElementById("s-btn").style.display = "block";
        document.querySelector(".verify").style.display = "none";
    } else {
        customAlert.alert("OTP Doesnot match");
    }
}

// Alert Window

function CustomAlert() {
    this.alert = function (message, title) {
        // Store the current input values
        var x = document.getElementById("uname").value;
        var y = document.getElementById("fname").value;
        var z = document.getElementById("lname").value;
        var v = document.getElementById("email").value;
        var w = document.getElementById("mobile").value;

        // Create container div
        var container = document.createElement("div");
        container.innerHTML =
            '<div id="dialogoverlay"></div><div id="dialogbox" class="slit-in-vertical"><div><div id="dialogboxhead"></div><div id="dialogboxbody"></div><div id="dialogboxfoot"></div></div></div>';

        // Append container to body
        document.body.appendChild(container);

        var dialogoverlay = document.getElementById("dialogoverlay");
        var dialogbox = document.getElementById("dialogbox");

        var winH = window.innerHeight;
        dialogoverlay.style.height = winH + "px";

        dialogbox.style.top = "100px";

        dialogoverlay.style.display = "block";
        dialogbox.style.display = "block";

        document.getElementById("dialogboxhead").style.display = "block";

        if (typeof title === "undefined") {
            document.getElementById("dialogboxhead").style.display = "none";
        } else {
            document.getElementById("dialogboxhead").innerHTML =
                '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + title;
        }
        document.getElementById("dialogboxbody").innerHTML = message;
        document.getElementById("dialogboxfoot").innerHTML =
            '<button class="pure-material-button-contained active" onclick="customAlert.ok(\'' +
            x +
            "', '" +
            y +
            "', '" +
            z +
            "', '" +
            v +
            "', '" +
            w +
            "')\">OK</button>";
    };

    this.ok = function (x, y, z, v, w) {
        // Restore the input values
        document.getElementById("uname").value = x;
        document.getElementById("fname").value = y;
        document.getElementById("lname").value = z;
        document.getElementById("email").value = v;
        document.getElementById("mobile").value = w;

        // Remove the container
        document.body.removeChild(document.body.lastChild);
    };
}

var customAlert = new CustomAlert();

//field use for otp generation
function otpfield() {
    if (imgArray.length < 4) {
        customAlert.alert("Choose Atlist Four Images");
    } else {
        document.getElementById("f-field").style.display = "none";
        document.getElementById("i-container").style.display = "none";
        document.getElementById("s-btn").style.display = "none";
        document.querySelector(".next1").style.display = "none";
        document.getElementById("next-btn").style.display = "none";
        document.getElementById("back-btn").style.display = "none";
        document.getElementById("ref-btn").style.display = "none";
        document.querySelector(".back1").style.display = "block";
        document.querySelector(".otp-field").style.display = "block";
        document.querySelector(".verify").style.display = "block";
        var email = document.getElementById("email").value;
        var FirstName = document.getElementById("uname").value;
        var mobile = document.getElementById("mobile");
        otp_generation(email, FirstName);
        // otp_on_mobile(mobile, FirstName);
    }
}

function otp_on_mobile(mobile, FirstName) {
    const accountSid = "AC1066f107c8ffe31655789fbca13fa8bd";
    const authToken = "8b97da2e361632eaa6316463802153c4";
    const twilioPhoneNumber = "+918010013313";

    const client = require("twilio")(accountSid, authToken);

    const recipientPhoneNumber = "+91" + mobile; // Replace with the recipient's phone number
    const messageBody = "Hello, this is a test message from Twilio!";

    client.messages
        .create({
            body: messageBody,
            from: twilioPhoneNumber,
            to: recipientPhoneNumber,
        })
        .then((message) => console.log(`Message sent. SID: ${message.sid}`))
        .catch((error) => console.error(`Error sending message: ${error.message}`));
}






//

function CustomAlert2() {
    this.alert = function (message, title) {
        // Store the current input values
        var x = document.getElementById("uname").value;
        var v = document.getElementById("email").value;
        var w = document.getElementById("mobile").value;

        // Create container div
        var container = document.createElement("div");
        container.innerHTML =
            '<div id="dialogoverlay"></div><div id="dialogbox" class="slit-in-vertical"><div><div id="dialogboxhead"></div><div id="dialogboxbody"></div><div id="dialogboxfoot"></div></div></div>';

        // Append container to body
        document.body.appendChild(container);

        var dialogoverlay = document.getElementById("dialogoverlay");
        var dialogbox = document.getElementById("dialogbox");

        var winH = window.innerHeight;
        dialogoverlay.style.height = winH + "px";

        dialogbox.style.top = "100px";

        dialogoverlay.style.display = "block";
        dialogbox.style.display = "block";

        document.getElementById("dialogboxhead").style.display = "block";

        if (typeof title === "undefined") {
            document.getElementById("dialogboxhead").style.display = "none";
        } else {
            document.getElementById("dialogboxhead").innerHTML =
                '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> ' + title;
        }
        document.getElementById("dialogboxbody").innerHTML = message;
        document.getElementById("dialogboxfoot").innerHTML =
            '<button class="pure-material-button-contained active" onclick="customAlert2.ok(\'' +
            x +
            "', '" +
            v +
            "', '" +
            w +
            "')\">OK</button>";
    };

    this.ok = function (x, v, w) {
        // Restore the input values
        document.getElementById("uname").value = x;
        document.getElementById("email").value = v;
        document.getElementById("mobile").value = w;

        // Remove the container
        document.body.removeChild(document.body.lastChild);
    };
}

var customAlert2 = new CustomAlert2();





function new_function() {
    document.getElementById("f-field").style.display = "none";
    document.getElementById("i-container").style.display = "flex";
    document.getElementById("s-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";

    document.querySelector(".next1").style.display = "block";

    document.getElementById("back-btn").style.display = "block";
    document.getElementById("ref-btn").style.display = "block";
    document.querySelector(".otp-field").style.display = "none";
    document.querySelector(".verify").style.display = "none";
}