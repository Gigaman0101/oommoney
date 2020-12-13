require('dotenv').config();
require('./middleware/passport')

const db = require('./models');
const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/user');
const addressRoutes = require('./routes/address');
const transferRoutes = require('./routes/transfer');
const bagRoutes = require('./routes/bag');
const conditionRoutes = require('./routes/condition');
const hasRoutes = require('./routes/has');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRoutes);
app.use("/address", addressRoutes);
app.use("/transfer", transferRoutes);
app.use("/bags", bagRoutes);
app.use("/conditions", conditionRoutes);
app.use("/has", hasRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: err.message });
});

const portBack = process.env.PORT || 8000;

app.listen(portBack, () => {
    console.log(`Server is starting at port ${portBack} `)
})

db.sequelize.sync({ force: false }).then(() => {
    console.log("Database connected")
}).catch(err => {
    console.log(err);
})