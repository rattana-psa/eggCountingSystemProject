var yearSelect = 0;

var dataSum = 0;

let listData = [];
let listEgg0 = [];
let listEgg1 = [];
let listEgg2 = [];
let listEgg3 = [];

window.onload = function () {

    var today = new Date();
    // var day = String(today.getDate());
    var month = String(today.getMonth() + 1); //.padStart(2, '0');
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
    const time = timeData[1]; //.split('.')[0];

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
    var month = String(today.getMonth() + 1); //.padStart(2, '0'); //January is 0!
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
    var month = String(today.getMonth() + 1); //.padStart(2, '0'); //January is 0!
    var year = today.getFullYear();

    today = '/' + year + '/' + month + '/' + day;
    console.log(today);
}

function addToArray(nameList, obj) {

    nameList.push(obj);
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
    // listEgg0 = [];
    // listEgg1 = [];
    // listEgg2 = [];
    // listEgg3 = [];

    refe = "countEgg/keep/" + yearSelect + '/';
    refData = refe + month;
    var firebaseRef = await firebase.database().ref(refData).get();
    console.log('refData: ', refData);
    let values = firebaseRef.toJSON();

    var sumVal = [];  //change from int to return array

    console.log('getTable/values: ', values);
    
    if (values) {

        if (month == 2) {

            sumVal = creatObj(29, values);

        } else if (month == 4 || month == 6 || month == 9 || month == 11) {

            sumVal = creatObj(30, values);

        } else {

            sumVal = creatObj(31, values);

        }

        sumValShow = { name: 'sum', count: sumVal[0], 'egg no.0': sumVal[1], 'egg no.1': sumVal[2], 'egg no.2': sumVal[3], 'egg no.3': sumVal[4] }
        
        addToArray(listData, sumValShow);
        console.log('list:', listData);
        creatTable();

    }
    else {

        document.getElementById("notiError").innerHTML = ("Don't Have Data in This Month");

    }

}

function creatObj(day, val){ 
    // values = val;
    // console.log('creasObj/val: ', val);
    
    let sumNo0 = 0;
    let sumNo1 = 0;
    let sumNo2 = 0;
    let sumNo3 = 0;   
    let sumCount = 0;

    for (let i = 1; i <= day; i++) {

        const isAdded = false;

        if (!val) {
            obj = { date: i, count: 0, 'egg no.0': 0, 'egg no.1': 0, 'egg no.2': 0, 'egg no.3': 0, }
            addToArray(listData, obj);
            isAdded = true;
        }

        if(isAdded) return;

        if (val[i] == undefined) {

            obj = { date: i, count: 0, 'egg no.0': 0, 'egg no.1': 0, 'egg no.2': 0, 'egg no.3': 0, }
            addToArray(listData, obj);
            
        } else {

            obj = { date: i, count: val[i].sum , 'egg no.0': val[i].no0, 'egg no.1': val[i].no1, 'egg no.2': val[i].no2, 'egg no.3': val[i].no3, } //************************************************ */
            
            sumCount += val[i].sum;

            sumNo0 += val[i].no0;
            sumNo1 += val[i].no1;
            sumNo2 += val[i].no2;
            sumNo3 += val[i].no3;
                        
            addToArray(listData, obj);

        }

    }

    sumAll = [sumCount, sumNo0, sumNo1, sumNo2, sumNo3];
    console.log('array-sumCount: ', sumAll);

    return sumAll;
}

function changeYear(yr){
    yearSelect = yr;
    document.getElementById("table").innerHTML = "";
    listData = [];
    document.getElementById("notiError").innerHTML = "";

    // document.getElementById("nameMonth").innerHTML = "Please Select Month";
    document.getElementById("nameMonth").innerHTML = `Now ${yearSelect}, Please Select Month`;
}