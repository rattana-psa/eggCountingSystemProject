var yearSelect = 0;

window.onload = function () {

    var today = new Date();
    // var day = String(today.getDate());
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();

    yearSelect = year;

    setInterval(async function () {
        realtimeData().then(snapshot => {
            // document.getElementById("showDataRealtime").innerHTML = ` ${snapshot.sum} <br> date: ${snapshot.date} time: ${snapshot.time} `;
            document.getElementById("showDataRealtime").innerHTML = snapshot.sum;
            document.getElementById("showTime").innerHTML = `Date : ${snapshot.date} Time : ${snapshot.time}`;
            document.getElementById("showEgg_0").innerHTML = `NO.0 : ${snapshot.egg_0}`;
            document.getElementById("showEgg_1").innerHTML = `NO.1 : ${snapshot.egg_1}`;
            document.getElementById("showEgg_2").innerHTML = `NO.2 : ${snapshot.egg_2}`;
            document.getElementById("showEgg_3").innerHTML = `NO.3 : ${snapshot.egg_3}`;

            console.log(yearSelect);
            
        });
    }, 3500);

    // showData();
    showName('Current Month');
    getTable(month);

}

var dataSum = 0;

function saveOnClick() {
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var address = document.getElementById('address');
    insertData(email.value, password.value, address.value);
}


async function realtimeData() {
    var firebaseRef = await firebase.database().ref("countEgg/realtime").get();
    let values = firebaseRef.toJSON();

    const sum = values.sum;
    
    const timeData = values.time.split('T');
    const date = timeData[0];
    const time = timeData[1].split('.')[0];

    const egg_0 = values.no0;
    const egg_1 = values.no1;
    const egg_2 = values.no2;
    const egg_3 = values.no3;

    let dataVal = { sum, date, time, egg_0, egg_1, egg_2, egg_3 };

    dataSum = sum;
    dataEgg0 = egg_0;
    dataEgg1 = egg_1;
    dataEgg2 = egg_2;
    dataEgg3 = egg_3;
    return dataVal;
}

// if password correct will 'saveData' to firebase
function saveData() {
    var today = new Date();
    var day = String(today.getDate());  //.padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var year = today.getFullYear();

    today = '/' + year + '/' + month + '/' + day;
    // console.log(today);

    var dataRef = "/countEgg/keep" + today;
    console.log('save to: ', dataRef);

    var firebaseRef = firebase.database().ref(dataRef);
    firebaseRef.update({
        sum: dataSum,
        no0: dataEgg0,
        no1: dataEgg1,
        no2: dataEgg2,
        no3: dataEgg3,
    });
    console.log("saveData Success");

}

// after send data to firebase will reset realtime today data value+  
function setZeroToday() {
    var firebaseRef = firebase.database().ref("countEgg/realtime/");
    firebaseRef.update({
        sum: 0,
        time: "dd-mm-yyyyT00:00:00.0",
        no0: 0,
        no1: 0,
        no2: 0,
        no3: 0,
    });
    console.log("--- reset Sum & Time ---");
}

// click button 'SAVE' must sign in if pass u can save data
async function signIn() {
    var password = document.getElementById("pwd").value;
    var email = "eggfarm.project@gmail.com";
    console.log(password);
    try {
        const res = await firebase.auth().signInWithEmailAndPassword(email, password);
        saveData();
        $('#myModal').modal('hide');
        setZeroToday();
        alert('SAVE COMPLETE ! !');
        clearText('wrongPassword');
    }
    catch (error) {
        // alert(error.code);
        document.getElementById("wrongPassword").innerHTML = 'password wrong!!';
    }

}

// click 'forgotPassword' button
async function checkEmail() {
    var inputEmail = document.getElementById("inputMail").value;
    var email = "eggfarm.project@gmail.com";
    console.log(inputEmail);

    if (inputEmail == email) {
        forgotPassword();
        $('#modalForgotPassword').modal('hide');
        console.log('to func.forgotPassword');
    } else {
        document.getElementById("wrongEmail").innerHTML = 'email wrong!!';
    }

}

async function forgotPassword() {
    var emailAddress = "eggfarm.project@gmail.com";

    try {
        const res = await firebase.auth().sendPasswordResetEmail(emailAddress);
        console.log('send email for reset password');
        alert('Please check E-mail for reset password');
    }
    catch (error) {
        document.getElementById("wrongEmail").innerHTML = 'email wrong!!';
        // document.getElementById("showDataRealtime").innerHTML = snapshot.sum;
    }
    finally {
        clearField('inputMail');
        clearText('wrongEmail');
    }

}

function clearField(target) {
    console.log('clear field');
    document.getElementById(target).value = '';
}

function clearText(target) {
    console.log('clear text');
    document.getElementById(target).innerHTML = '';
}

function dropdown_click() {
    var myVar = document.getElementById('dropdownMenu').value;
    document.getElementById("touch").style.backgroundColor = myVar;
}

function time() {
    var today = new Date();
    var day = String(today.getDate());
    var month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var year = today.getFullYear();

    today = '/' + year + '/' + month + '/' + day;
    console.log(today);
}

let listData = [];

function addToArray(obj) {

    listData.push(obj);
    // console.log('after:', listData);
}

function creatTable() {
    let table = document.querySelector("table");
    let data = Object.keys(listData[0]);
    let number_0 = 0;
    let number_1 = 0;
    let number_2 = 0;
    let number_3 = 0;
    generateTableHead(table, data);
    generateTable(table, listData);
}

// creat head from key of listData[0]
function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

// creat table from obj.
function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

function showName(name){
    name = name + ' ' + yearSelect;
    document.getElementById("nameMonth").innerHTML = name;
}

async function getTable(month) {
    // deleteTable(); notiError
    document.getElementById("table").innerHTML = "";
    document.getElementById("notiError").innerHTML = "";
    listData = [];

    refe = "countEgg/keep/" + yearSelect + '/';
    refData = refe + month;
    var firebaseRef = await firebase.database().ref(refData).get();
    console.log('refData: ', refData);
    let values = firebaseRef.toJSON();
    var sumCount = 0;
    console.log(month);
    if (values) {

        if (month == 2) {

            sumCount = creatObj(29, values, sumCount);

        } else if (month == 4 || month == 6 || month == 9 || month == 11) {

            sumCount = creatObj(30, values, sumCount);

        } else {

            sumCount = creatObj(31, values, sumCount);

        }

        sumCountShow = { name: 'sum', count: sumCount }
        sumNo_0 = { name: 'sum', count: sumCount }
        
        addToArray(sumCountShow);
        console.log('list:', listData);
        creatTable();

    }
    else {

        document.getElementById("notiError").innerHTML = ("Don't Have Data in This Month");

        // if (month == 2) {

        //     sumCount = creatObj(29, [], 0);

        // } else if (month == 4 || month == 6 || month == 9 || month == 11) {

        //     sumCount = creatObj(30, [], 0);

        // } else {

        //     sumCount = creatObj(31, [], 0);

        // }
        // sumCountShow = { name: 'sum', count: 0 }
        // addToArray(sumCountShow);
        // creatTable();
    }

}

function creatObj(day, val, sumCount) {
    values = val;
    for (let i = 1; i <= day; i++) {
        const isAdded = false;
        if (!values) {
            obj = { date: i, count: 0 }
            addToArray(obj);
            isAdded = true;
        }
        if(isAdded) return;
        if (values[i] == undefined) {
            obj = { date: i, count: 0 }
            addToArray(obj);
        } else {
            obj = { date: i, count: values[i].sum }
            sumCount += values[i].sum;
            addToArray(obj);
        }
    }
    return sumCount;
}

function changeYear(yr){
    yearSelect = yr;
    document.getElementById("table").innerHTML = "";
    listData = [];
    document.getElementById("notiError").innerHTML = "";

    // document.getElementById("nameMonth").innerHTML = "Please Select Month";
    document.getElementById("nameMonth").innerHTML = `Now ${yearSelect}, Please Select Month`;
}