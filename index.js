const express = require('express');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('assaingment 11')
})

app.listen(port)

// assaignment_11
//RUflDmGfdGioO1aJ