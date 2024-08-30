const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT,
  description TEXT
);

INSERT INTO categories (name, description) 
VALUES
  ('Men''s Clothing', 'Men''s clothing refers to garments designed for men, including shirts');

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT,
  description TEXT,
  price INTEGER,
  number_in_stock INTEGER,
  category_id INTEGER REFERENCES categories(id)
);

INSERT INTO items (name, description, price, number_in_stock, category_id) 
VALUES
  ('Mens Cotton Jacket', 'great outerwear jackets for Spring, Autumn, Winter and suitable for ma.', 59, 11, 1);

`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: "postgresql://efe:efeege34@localhost:5432/clothing_shop",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
