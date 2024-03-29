const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const _ = require('lodash');
const bodyParser = require('body-parser');
dotenv.config(); 

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());


app.get('/', (req,res)=>{
    res.send("welcome to Dealer page")
})

app.get('/customers', async (req, res) => {
        try {
            const url = process.env.TIGERSHEET_API_URL;
            const headers = {
                'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            };
            const sheetId = process.env.TIGERSHEET_CUSTOMERS_SHEET_ID;
            // Get criteria from request query parameters
            const criteria = req.query.criteria || '';
            const customersRecords = await getCustomersRecords(url, headers, sheetId, criteria);
            res.send({ data: customersRecords });
    
        } catch (err) {
            console.error('Error in fetching data:', err.message);
            res.status(500).send('Internal Server Error');
        }
    });
    
    async function getCustomersRecords(url, headers, sheetId, criteria) {
        const payload = {
            'sheet_id': sheetId,
            'criteria': criteria,
        };
    
        const response = await axios.post(url, payload, { headers });
        console.log('All Records from Tigersheet Backend for Customers', response.data);
    
        return response.data.data;
    }
app.get('/dealers', async (req, res) => {
    try {
        const url = process.env.TIGERSHEET_API_URL;
        const headers = {
            'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        const sheetId = process.env.TIGERSHEET_DEALERS_SHEET_ID;
        // Get criteria from request query parameters
        const criteria = req.query.criteria || '';
        const customersRecords = await getCustomersRecords(url, headers, sheetId, criteria);
        res.send({ data: customersRecords });

    } catch (err) {
        console.error('Error in fetching data:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

async function getCustomersRecords(url, headers, sheetId, criteria) {
    const payload = {
        'sheet_id': sheetId,
        'criteria': criteria,
    };

    const response = await axios.post(url, payload, { headers });
    console.log('All Records from Tigersheet Backend for Customers', response.data);

    return response.data.data;
}
app.post("/create", async (req, res) => {
    try {
      const url = process.env.TIGERSHEET_API_CREATE_URL;
      const headers = {
        'Authorization': process.env.TIGERSHEET_AUTHORIZATION_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };
      const sheetId = 59283844;
  
      
      const { numberOfTires, selectedBrand, loanAmount, name, pan, mobilenumber, alternatemobile, martialstatus, numofchildren, housetype, trucknumber, date,numberoftrucks , source} = req.body;
      const sourceValue = source ? source : 'null';
      const sourceJsonValue = JSON.stringify({
        "reference_column_id": 236,
        "value": sourceValue
    });
  
       const data = JSON.stringify({
        "806": { "value": numberOfTires },
        "855": { "value": selectedBrand },
        "805": { "value": loanAmount },
        "791": { "value": name },
        "792": { "value": pan },
        "793": { "value": mobilenumber },
        "794": { "value": alternatemobile },
        "800": { "value": martialstatus },
        "801": { "value": numofchildren },
        "802": { "value": housetype },
        "803": { "value": trucknumber },
        "790": { "value": date },
        "810": {"value": pan},
        "795": {"value": numberoftrucks},
        "807":{"value":sourceJsonValue},
      });
      
      
  
      const tyreData = await getTyreData(url, headers, sheetId, data);
      console.log('TyreData:', tyreData);
  
      res.send({ data: tyreData });
  
    } catch (err) {
      console.error('Error in fetching data:', err.message);
      res.status(500).send('Internal Server Error');
    }
  });
  async function getTyreData(url, headers, sheetId, data) {
    const payload = {
      'sheet_id': sheetId,
      'data': data
    }
    const response = await axios.post(url, payload, { headers });
    console.log('All Records from Tigersheet Backend', response.data);
  
    return response.data;
  }
    
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  