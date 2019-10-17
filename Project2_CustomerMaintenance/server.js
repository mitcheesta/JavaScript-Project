/*  Author: Michelle Estanol
 *  Date: 2018.12.07
 *  Description: A customer management system with CRUD functionality. Attached to the "Store" SQL Server database.
 */

//create variable holding express object from npm module
let express = require('express');

//create variable holding body-parser object from npm module
let bodyParser = require('body-parser');

//create express application object
let app = express();

//set app to use body-parser and static directories
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));

//create sql config object
var config = {
    user: 'sa',
    password: 'Abc123##',
    server: 'MSI\\SQLEXPRESS',
    database: 'store'

};

//handle GET for index page
app.get('/', (request, response) => response.sendFile(__dirname + "/index.html"));

//handle POST for Add button
app.post('/customer/data', (req, res) => {
    let postBody = req.body;

    let sql = require("mssql");

    sql.connect(config, function (err) {

        if (err) {
            console.log("Error encountered: " + err);
        }

        //create SQL query
        let qry = "INSERT INTO Customers (FirstName, LastName, Address, City, Province, PostalCode) VALUES (@FName, @LName, @Addr, @City, @Prov, @Post);";

        //create Request
        let request = new sql.Request();

        request.input("FName", sql.NVarChar(50), postBody.fName)
            .input("LName", sql.NVarChar(50), postBody.lName)
            .input("Addr", sql.NVarChar(50), postBody.addr)
            .input("City", sql.NVarChar(50), postBody.city)
            .input("Prov", sql.NVarChar(25), postBody.prov)
            .input("Post", sql.NVarChar(10), postBody.post)

            //run query
            .query(qry, function (err, recordset) {
                if (err) {
                    console.log("Error encountered: " + err);
                }

                //display returned records for debugging
                console.log(recordset);

                //get new record's ID
                qry = "SELECT @@IDENTITY AS 'identity';";
                request.query(qry, function (err, returnedID) {
                    if (err) {
                        console.log("Error encountered: " + err);
                    }

                    //save ID to variable
                    let newID = returnedID.recordset[0].identity;
                    console.log(newID);

                    if (newID !== null) {
                        // postBody.msg = "Customer successfully added as customer #" + newID;
                        res.send("Customer successfully added as customer #" + newID);
                    }
                    else {
                        //postBody.msg = "Error encountered while attempting to add customer. Please try again later or contact administrator if issue persists.";
                        res.send("Error encountered while attempting to add customer. Please try again later or contact administrator if issue persists.");
                    }
                    sql.close();
                });
            });
    });

});

//handle POST for Find button
app.post('/customer/id', (req, res) => {
    let postBody = req.body;

    let sql = require("mssql");

    sql.connect(config, function (err) {

        if (err) {
            console.log("Error encountered: " + err);
        }

        //create SQL query
        let qry = "Select FirstName, LastName, Address, City, Province, PostalCode FROM Customers WHERE CusID = @CNum;";

        //create Request
        let request = new sql.Request();

        request.input("CNum", sql.Int, parseInt(postBody.cNum))

            //run query
            .query(qry, function (err, recordset) {
                if (err) {
                    console.log("Error encountered: " + err);
                }

                //display returned records for debugging
                console.log(recordset);

                res.send(recordset);

                sql.close();
            });
    });

});

//handle POST for Delete button
app.post('/customer/delete_id', (req, res) => {
    let postBody = req.body;

    let sql = require("mssql");

    sql.connect(config, function (err) {

        if (err) {
            console.log("Error encountered: " + err);
        }

        //create SQL query
        let qry = "DELETE FROM Customers WHERE CusID = @CNum;";

        //create Request
        let request = new sql.Request();

        request.input("CNum", sql.Int, parseInt(postBody.cNum))

            //run query
            .query(qry, function (err, recordset) {
                if (err) {
                    console.log("Error encountered: " + err);
                }

                //display returned records for debugging
                console.log(recordset);

                if (recordset.rowsAffected[0] === 1) {
                    res.send("Customer #" + postBody.cNum + " was successfully deleted.");
                }
                else {
                    res.send("There was an error encountered while attempting to delete customer #" + postBody.cNum + ". Please try again later or contact an administrator.");
                }

                sql.close();
            });
    });

});

//handle POST for Update button
app.post('/customer/update_data', (req, res) => {
    let postBody = req.body;

    let sql = require("mssql");

    sql.connect(config, function (err) {

        if (err) {
            console.log("Error encountered: " + err);
        }

        //create SQL query
        let qry = "UPDATE Customers SET FirstName = @FName, LastName = @LName, Address = @Addr, City = @City, Province = @Prov, PostalCode = @Post WHERE CusID = @CNum;";

        //create Request
        let request = new sql.Request();

        request.input("CNum", sql.Int, parseInt(postBody.cNum))
            .input("FName", sql.NVarChar(50), postBody.fName)
            .input("LName", sql.NVarChar(50), postBody.lName)
            .input("Addr", sql.NVarChar(50), postBody.addr)
            .input("City", sql.NVarChar(50), postBody.city)
            .input("Prov", sql.NVarChar(25), postBody.prov)
            .input("Post", sql.NVarChar(10), postBody.post)

            //run query
            .query(qry, function (err, recordset) {
                if (err) {
                    console.log("Error encountered: " + err);
                }

                //display returned records for debugging
                console.log(recordset);

                if (recordset.rowsAffected[0] === 1) {
                    res.send("Customer #" + postBody.cNum + " was successfully updated.");
                }
                else {
                    res.send("There was an error encountered while attempting to update customer #" + postBody.cNum + ". Please try again later or contact an administrator.");
                }
                sql.close();
            });
    });

});

//set server to listen on port 3000
app.listen(3000, () => console.info('Customer Management App running on port 3000'));