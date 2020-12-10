require('dotenv').config();
require('./middleware/passport')

const db = require('./models');
const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/user');
const addressRoutes = require('./routes/address');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRoutes);
app.use("/address", addressRoutes);

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is starting at port ${port} `)
})

db.sequelize.sync({ force: true }).then(() => {
    console.log("Database connected")
}).catch(err => {
    console.log(err);
})