import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

interface User {
    id: number;
    username: string;
    password: string;
}

async function checkDatabaseConnection(): Promise<void> {
    try {
        const connection = await db.getConnection();
        console.log('数据库连接成功');
        connection.release();
    } catch (err) {
        if (err instanceof Error) {
            console.error('数据库连接失败:', err.message);
        } else {
            console.error('数据库连接失败:', err);
        }
        process.exit(1); // 退出进程
    }
}

app.post('/login', async (req, res): Promise<void> => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    try {
        const [rows] = await db.execute<mysql.RowDataPacket[]>(query, [username]);
        if (rows.length > 0) {
            const user = rows[0] as User;
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.send('登录成功');
            } else {
                res.status(401).send('用户名或密码错误');
            }
        } else {
            res.status(401).send('用户名或密码错误');
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`服务器错误: ${err.message}`);
        } else {
            res.status(500).send('服务器错误');
        }
    }
});

app.post('/register', async (req, res): Promise<void> => {
    const { username, password } = req.body;
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    try {
        const [rows] = await db.execute<mysql.RowDataPacket[]>(checkQuery, [username]);
        if (rows.length > 0) {
            res.status(409).send('用户名已存在');
        } else {
            await db.execute(insertQuery, [username, password]);
            res.send('注册成功');
        }
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).send(`服务器错误: ${err.message}`);
        } else {
            res.status(500).send('服务器错误');
        }
    }
});

app.listen(port, async (): Promise<void> => {
    await checkDatabaseConnection();
    console.log(`服务器正在运行在 http://localhost:${port}`);
});