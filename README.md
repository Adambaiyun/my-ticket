1. Make sure nodejs is installed.
2. Make sure there is Postgre server ready to use.
3. Clone code to your local.

```
git clone https://github.com/Adambaiyun/my-ticket.git
```

4. 

```
cd my-ticket
npm install
```

5. Add .env file under my-ticket, this is Database connection string, below is a sample, make sure it links to ur local Postgre server.
if no Database there, please create a new Database, and set it in .env


```
DB_HOST=localhost
DB_PORT=5432
DB_USER=test
DB_PASSWORD=123456
DB_NAME=adam_ticket
```
6. Build events table schema
   
```
ts-node .\src\sql\run.ts
```

7. Build front end

```
cd client
npm install
npm run build
```

8. Run node server

```
cd ../
npm run dev
```

9. now u can use the ticket booking system through browser by http://localhost:3000/


Enjoy your journey~


ps:

This is a basic version, something can be done in future:

1. Input validation, currently has potential risk for SQL injection.
2. UI layout can be improved
3. Currently controller and logic handler are in one file, can be split
4. No UT yet

How overselling is prevented:

The query i use is a update ... where ..., it will lock the row on database level. 
