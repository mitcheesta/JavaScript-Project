//Button event handlers
$(document).ready(function () {
    //Add customer functionality
    $('#btnAdd').click(function () {
        $.post('/customer/data', {
            fName: $('#txtFName').val(),
            lName: $('#txtLName').val(),
            addr: $('#txtAddr').val(),
            city: $('#txtCity').val(),
            prov: $('#txtProv').val(),
            post: $('#txtPost').val()
        },

            function (data, status) {  //callback
                //displays message that add either worked or failed
                document.getElementById('pMsg').innerText = data;
                document.getElementById('divMsg').style.display = 'block';
                clearBoxes();
            });
    });

    //New customer functionality
        //clears text boxes and messages
    $('#btnNew').click(function () {
        clearBoxes();
        document.getElementById('divMsg').style.display = 'none';
    });

    //Find customer functionality
        //requires number in #txtCNum to work properly
    $('#btnFind').click(function () {
        $.post('/customer/id', {
            cNum: $('#txtCNum').val()
        },
            function (data, status) { //callback
                //displays message that find failed
                if (data.recordset.length !== 1) {
                    document.getElementById('pMsg').innerText = "Could not find customer #" + document.getElementById('txtCNum').value;
                    document.getElementById('divMsg').style.display = 'block';
                }
                //displays the found data
                else {
                    document.getElementById('txtFName').value = data.recordset[0]['FirstName'];
                    document.getElementById('txtLName').value = data.recordset[0]['LastName'];
                    document.getElementById('txtAddr').value = data.recordset[0]['Address'];
                    document.getElementById('txtCity').value = data.recordset[0]['City'];
                    document.getElementById('txtProv').value = data.recordset[0]['Province'];
                    document.getElementById('txtPost').value = data.recordset[0]['PostalCode'];
                    document.getElementById('divMsg').style.display = 'none';
                }
            });
    });

    //Delete customer functionality
        //requires number in #txtCNum to work properly
    $('#btnDelete').click(function () {
        $.post('/customer/delete_id', {
            cNum: $('#txtCNum').val()
        },
            function (data, status) { //callback
                //displays message that delete either worked or failed
                document.getElementById('pMsg').innerText = data;
                document.getElementById('divMsg').style.display = 'block';
                clearBoxes();
            });
    });

    //Update customer functionality
        //requires number in #txtCNum to work properly
    $('#btnUpdate').click(function () {
        $.post('/customer/update_data', {
            cNum: $('#txtCNum').val(),
            fName: $('#txtFName').val(),
            lName: $('#txtLName').val(),
            addr: $('#txtAddr').val(),
            city: $('#txtCity').val(),
            prov: $('#txtProv').val(),
            post: $('#txtPost').val()
        },
            function (data, status) { //callback
                //displays message that update either worked or failed
                document.getElementById('pMsg').innerText = data;
                document.getElementById('divMsg').style.display = 'block';
                clearBoxes();
            });
    });
});

//Purpose: empties the contents of the form's input[type="text"]
function clearBoxes() {
    document.getElementById('txtCNum').value = '';
    document.getElementById('txtFName').value = '';
    document.getElementById('txtLName').value = '';
    document.getElementById('txtAddr').value = '';
    document.getElementById('txtCity').value = '';
    document.getElementById('txtProv').value = '';
    document.getElementById('txtPost').value = '';
}
