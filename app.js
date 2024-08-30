require('dotenv').config()
const express = require('express');
const indexRouter = require('./routes/index');
const categoriesRouter = require('./routes/categories');
const itemsRouter = require('./routes/items');
const path = require('path')

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

app.use('/', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/items', itemsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));