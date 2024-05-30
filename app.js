const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let windowPrevState = [];

app.get('/numbers/:numbersId', async (req, res) => {
    const number = req.params.numbersId;
    let api;

    if (number === "e") {
        api = 'http://20.244.56.144/test/even';
    } else if (number === "r") {
        api = 'http://20.244.56.144/test/rand';
    } else if (number === "f") {
        api = 'http://20.244.56.144/test/fibo';
    } else if (number === "p") {
        api = 'http://20.244.56.144/test/primes';
    } else {
        return res.status(400).json({ error: "Invalid number type" });
    }

    try {
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MDc0NTAwLCJpYXQiOjE3MTcwNzQyMDAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjE4MDU3ZjE3LTkxODAtNDEyNC04NWYyLTVmY2FhMzU3MzFiNyIsInN1YiI6ImJvZGFzYWlydXNoaWtAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiYWZmb3JkbWVkIiwiY2xpZW50SUQiOiIxODA1N2YxNy05MTgwLTQxMjQtODVmMi01ZmNhYTM1NzMxYjciLCJjbGllbnRTZWNyZXQiOiJVTVFQeU94bVVUWGpUWkVDIiwib3duZXJOYW1lIjoiQm9kYSBTYWkgUnVzaGlrIFJlZGR5Iiwib3duZXJFbWFpbCI6ImJvZGFzYWlydXNoaWtAZ21haWwuY29tIiwicm9sbE5vIjoiMjFCRDFBMTIwOSJ9.JgzktnoRz39Y0b7F2USZU_a0wRNSp6jHlNO1FWHUaCI'
            }
        });

        const data = await response.json();
        const combArray = windowPrevState.concat(data);
        const uniqSet = new Set(combArray);
        const windowCurrState = Array.from(uniqSet);
        const n = windowCurrState.length;

        let newWindowCurrState;
        let sum = 0;
        
        if (n > 10) {
            newWindowCurrState = windowCurrState.slice(n - 10);
        } else {
            newWindowCurrState = windowCurrState;
        }

        for (let i = 0; i < newWindowCurrState.length; i++) {
            sum += newWindowCurrState[i];
        }

        const average = sum / newWindowCurrState.length;
        const answer = {
            numbers: data,
            windowPrevState,
            newWindowCurrState,
            avg: average
        };

        windowPrevState = newWindowCurrState;
        res.status(200).json(answer);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
});
