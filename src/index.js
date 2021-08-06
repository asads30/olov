process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const validatePhoneNumber = require("validate-phone-number-node-js");
const config = require("./config");
const helpers = require("./helpers");
const mysql = require("mysql");
const bot = new TelegramBot(config.TOKEN, {
    polling: true,
});

/* DB */
var db_config = {
    host: "45.147.178.11",
    user: "olov",
    password: "Asadbek3015130!@#",
    database: "olov",
};
var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config);
    connection.connect(function(err) {
        if (err) {
            console.log("error when connecting to db:", err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on("error", function(err) {
        console.log("db error", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

/* Global */

const admin = 386567097;

bot.onText(/\/start/, (msg) => {
    let regName = msg.from.first_name;
    let regUsername = msg.from.username;
    const text = `Здравствуйте, ${msg.from.first_name}\n\n👥 Выбор языка/Tilni tanlash:`;
    connection.query(
        "SELECT * FROM users WHERE userid = ?", [helpers.getUserId(msg)],
        (error, results) => {
            if (error) {
                console.log("Ошибка при поиске в users", error);
            } else {
                if (results.length === 0) {
                    const user = [regName, helpers.getUserId(msg), regUsername, 1];
                    const sql =
                        "INSERT INTO users(name, userid, username, step) VALUES(?, ?, ?, ?)";
                    connection.query(sql, user, function(err, results) {
                        if (err) console.log(err);
                        else console.log("Юзер зареган");
                    });
                    bot.sendMessage(helpers.getChatId(msg), text, {
                        reply_markup: {
                            resize_keyboard: true,
                            inline_keyboard: [
                                [{
                                        text: "🇷🇺 Русский",
                                        callback_data: "ru",
                                    },
                                    {
                                        text: "🇺🇿 O'zbek tili",
                                        callback_data: "uz",
                                    },
                                ],
                            ],
                        },
                    });
                } else if (results[0].step === "1") {
                    bot.sendMessage(helpers.getChatId(msg), text, {
                        reply_markup: {
                            resize_keyboard: true,
                            inline_keyboard: [
                                [{
                                        text: "🇷🇺 Русский",
                                        callback_data: "ru",
                                    },
                                    {
                                        text: "🇺🇿 O'zbek tili",
                                        callback_data: "uz",
                                    },
                                ],
                            ],
                        },
                    });
                } else if (results[0].step === "3") {
                    bot.sendMessage(msg.chat.id, "Откуда Вы узнали про приложение", {
                        reply_markup: {
                            resize_keyboard: true,
                            inline_keyboard: [
                                [{
                                    text: "Страница OLOVE в Инстаграм",
                                    callback_data: "var1-1",
                                }, ],
                                [{
                                    text: "Страница других пользователей в Инстаграм",
                                    callback_data: "var1-2",
                                }, ],
                                [{
                                    text: "Знакомых",
                                    callback_data: "var1-3",
                                }, ],
                                [{
                                    text: "Другое",
                                    callback_data: "var1-4",
                                }, ],
                            ],
                        },
                    });
                } else if (results[0].step === "4") {
                    bot.sendMessage(
                        msg.chat.id,
                        "Насколько удобно было пройти регистрацию в приложении? от 1 до 5. Где 1-неудобно, 5-очень удобно.", {
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{
                                        text: "1️⃣",
                                        callback_data: "var2-1",
                                    }, ],
                                    [{
                                        text: "2️⃣",
                                        callback_data: "var2-2",
                                    }, ],
                                    [{
                                        text: "3️⃣",
                                        callback_data: "var2-3",
                                    }, ],
                                    [{
                                        text: "4️⃣",
                                        callback_data: "var2-4",
                                    }, ],
                                    [{
                                        text: "5️⃣",
                                        callback_data: "var2-5",
                                    }, ],
                                ],
                            },
                        }
                    );
                } else if (results[0].step === "5") {
                    bot.sendMessage(
                        msg.chat.id,
                        "Будете ли Вы использовать приложение?", {
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{
                                            text: "Да",
                                            callback_data: "var3-1",
                                        },
                                        {
                                            text: "Нет",
                                            callback_data: "var3-2",
                                        },
                                    ],
                                ],
                            },
                        }
                    );
                } else if (results[0].step === "6") {
                    let var1 = (results[0].step1 === 1) ? 'Страница OLOVE в Инстаграм' : (results[0].step1 === 2) ? 'Страница других пользователей в Инстаграм' : (results[0].step1 === 3) ? 'Знакомых' : results[0].step1
                    let var2 = results[0].step2
                    let var3 = (results[0].step3 === '1') ? 'Да' : 'Нет'
                    bot.sendMessage(
                        msg.chat.id,
                        `Спасибо за уделенное время. Мы только запустили наше приложение, и Ваше мнение очень ценно для нас. 1 сентября мы объявим победителей нашего конкурса и вручим ценные призы. Оставайтесь с нами, впереди вас ждет много интересного.
Ваши ответы:
1) Откуда Вы узнали про приложение - ${var1}
2) Насколько удобно было пройти регистрацию в приложении - ${var2}
3) Будете ли Вы использовать приложение - ${var3}`
                    );
                } else if (results[0].step === "3-1") {
                    bot.sendMessage(
                        msg.chat.id,
                        "OLOVE ilovasi to'g'risida qaerdan eshitdingiz?", {
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{
                                        text: "Instagram-dagi OLOVE sahifasi",
                                        callback_data: "var1-5",
                                    }, ],
                                    [{
                                        text: "Instagram-dagi boshqa foydalanuvchilarning sahifasi",
                                        callback_data: "var1-6",
                                    }, ],
                                    [{
                                        text: "Tanishlar orqali",
                                        callback_data: "var1-7",
                                    }, ],
                                    [{
                                        text: "Boshqa",
                                        callback_data: "var1-8",
                                    }, ],
                                ],
                            },
                        }
                    );
                } else if (results[0].step === "4-1") {
                    bot.sendMessage(
                        msg.chat.id,
                        "Ilovada ro'yxatdan o'tish qanchalik qulay bo'ldi? 1 - juda noqulay , 5 - juda qulay.", {
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{
                                        text: "1️⃣",
                                        callback_data: "var2-6",
                                    }, ],
                                    [{
                                        text: "2️⃣",
                                        callback_data: "var2-7",
                                    }, ],
                                    [{
                                        text: "3️⃣",
                                        callback_data: "var2-8",
                                    }, ],
                                    [{
                                        text: "4️⃣",
                                        callback_data: "var2-9",
                                    }, ],
                                    [{
                                        text: "5️⃣",
                                        callback_data: "var2-10",
                                    }, ],
                                ],
                            },
                        }
                    );
                } else if (results[0].step === "5-1") {
                    bot.sendMessage(
                        msg.chat.id,
                        "Ilovadan kelajakda foydalanasizmi?", {
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{
                                            text: "Ha",
                                            callback_data: "var3-3",
                                        },
                                        {
                                            text: "Yo'q",
                                            callback_data: "var3-3",
                                        },
                                    ],
                                ],
                            },
                        }
                    );
                } else if (results[0].step === "6-1") {
                    let var1 = (results[0].step1 === 1) ? 'Instagram-dagi OLOVE sahifasi' : (results[0].step1 === 2) ? 'Instagram-dagi boshqa foydalanuvchilarning sahifasi' : (results[0].step1 === 3) ? 'Tanishlar orqali' : results[0].step1
                    let var2 = results[0].step2
                    let var3 = (results[0].step3 === '1') ? 'Ha' : "Yo'q"
                    bot.sendMessage(
                        msg.chat.id,
                        `Vaqtingiz uchun katta rahmat. Biz hozirda o'z dasturimizni ishga tushirdik va sizning fikr-mulohazalaringiz biz uchun juda qadrlidir. 1 sentyabr kuni biz tanlovimiz g'oliblarini e'lon qilamiz va qimmatbaho sovg'alarni topshiramiz. Bizni kuzatib turing, sizni oldinda ko'plab qiziqarli narsalar kutmoqda.
Sizning javoblaringiz:
1) OLOVE ilovasi to'g'risida qaerdan eshitdingiz - ${var1}
2) Ilovada ro'yxatdan o'tish qanchalik qulay bo'ldi - ${var2}
3) Ilovadan kelajakda foydalanasizmi - ${var3}`
                    );
                }
            }
        }
    );
});

bot.onText(/\/stats/, (msg) => {
    let admin = 41444920
    let admin2 = 386567097
    let regName = msg.from.first_name;
    let regUsername = msg.from.username;
    connection.query(
        "SELECT * FROM users WHERE userid = ?", [helpers.getUserId(msg)],
        (error, results) => {
            if (error) {
                console.log("Ошибка при поиске в users", error);
            } else {
                if (results.length === 0) {
                    const user = [regName, helpers.getUserId(msg), regUsername, 1];
                    const sql =
                        "INSERT INTO users(name, userid, username, step) VALUES(?, ?, ?, ?)";
                    connection.query(sql, user, function(err, results) {
                        if (err) console.log(err);
                        else console.log("Юзер зареган");
                    });
                    bot.sendMessage(helpers.getChatId(msg), text, {
                        reply_markup: {
                            resize_keyboard: true,
                            inline_keyboard: [
                                [{
                                        text: "🇷🇺 Русский",
                                        callback_data: "ru",
                                    },
                                    {
                                        text: "🇺🇿 O'zbek tili",
                                        callback_data: "uz",
                                    },
                                ],
                            ],
                        },
                    });
                } else if (results[0].userid == admin) {
                    let allUser = results.length;
                    bot.sendMessage(helpers.getChatId(msg), `Здравствуйте админ!
                    
Статистика: 

Кол-во пользователей: ${allUser}
`);
                } else if (results[0].userid == admin2) {
                    let allUser = results.length;
                    bot.sendMessage(helpers.getChatId(msg), `Здравствуйте админ!
                    
Статистика: 

Кол-во пользователей: ${allUser}
`);
                }
            }
        }
    );
});

bot.on("message", (msg) => {
    let userId = msg.from.id;
    connection.query(
        "SELECT * FROM users WHERE userid = ?", [helpers.getUserId(msg)],
        (error, results) => {
            if (error) {
                console.log("Ошибка при поиске в users", error);
            } else {
                if (results.length === 0) {
                    console.log("2");
                } else if (results[0].step == 2) {
                    let userPhone = msg.text;
                    const result = validatePhoneNumber.validate(userPhone);
                    if (result) {
                        bot.sendMessage(userId, "Откуда Вы узнали про приложение", {
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{
                                        text: "Страница OLOVE в Инстаграм",
                                        callback_data: "var1-1",
                                    }, ],
                                    [{
                                        text: "Страница других пользователей в Инстаграм",
                                        callback_data: "var1-2",
                                    }, ],
                                    [{
                                        text: "Знакомых",
                                        callback_data: "var1-3",
                                    }, ],
                                    [{
                                        text: "Другое",
                                        callback_data: "var1-4",
                                    }, ],
                                ],
                            },
                        });
                        var sql =
                            "UPDATE users SET phone = ?, step = ? WHERE userid = ?";
                        connection.query(
                            sql, [userPhone, 3, userId],
                            function(err, result) {
                                if (err) throw err;
                                console.log(result.affectedRows + " record(s) updated");
                            }
                        );
                        console.log(result);
                    } else {
                        bot.sendMessage(
                            userId,
                            "Введите правильный номер телефона. Пример: +998 XX XXX XX XX"
                        );
                    }
                } else if (results[0].step == "2-1") {
                    let userPhone = msg.text;
                    const result = validatePhoneNumber.validate(userPhone);
                    if (result) {
                        bot.sendMessage(
                            userId,
                            "OLOVE ilovasi to'g'risida qaerdan eshitdingiz?", {
                                reply_markup: {
                                    resize_keyboard: true,
                                    inline_keyboard: [
                                        [{
                                            text: "Instagram-dagi OLOVE sahifasi",
                                            callback_data: "var1-5",
                                        }, ],
                                        [{
                                            text: "Instagram-dagi boshqa foydalanuvchilarning sahifasi",
                                            callback_data: "var1-6",
                                        }, ],
                                        [{
                                            text: "Tanishlar orqali",
                                            callback_data: "var1-7",
                                        }, ],
                                        [{
                                            text: "Boshqa",
                                            callback_data: "var1-8",
                                        }, ],
                                    ],
                                },
                            }
                        );
                        var sql =
                            "UPDATE users SET phone = ?, step = ? WHERE userid = ?";
                        connection.query(
                            sql, [userPhone, "3-1", userId],
                            function(err, result) {
                                if (err) throw err;
                                console.log(result.affectedRows + " record(s) updated");
                            }
                        );
                        console.log(result);
                    } else {
                        bot.sendMessage(
                            userId,
                            "To'g'ri raqam kiriting. Misol: +998 XX XXX XX XX"
                        );
                    }
                } else if (results[0].step1 == 4) {
                    let userAnswer = msg.text;
                    bot.sendMessage(
                        msg.chat.id,
                        "Насколько удобно было пройти регистрацию в приложении? от 1 до 5. Где 1-неудобно, 5-очень удобно.", {
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{
                                        text: "1️⃣",
                                        callback_data: "var2-1",
                                    }, ],
                                    [{
                                        text: "2️⃣",
                                        callback_data: "var2-2",
                                    }, ],
                                    [{
                                        text: "3️⃣",
                                        callback_data: "var2-3",
                                    }, ],
                                    [{
                                        text: "4️⃣",
                                        callback_data: "var2-4",
                                    }, ],
                                    [{
                                        text: "5️⃣",
                                        callback_data: "var2-5",
                                    }, ],
                                ],
                            },
                        }
                    );
                    connection.query(
                        "SELECT * FROM users WHERE userid = ?", [userId],
                        (error, results) => {
                            if (error) {
                                console.log(error, "1");
                            } else {
                                if (results.length === 0) {
                                    console.log("2");
                                } else {
                                    const sql =
                                        "UPDATE users SET step = '4' , step1 = ? WHERE userid = ?";
                                    connection.query(
                                        sql, [userAnswer, userId],
                                        function(err, results) {
                                            if (err) console.log(err, "3");
                                            else console.log("4");
                                        }
                                    );
                                }
                            }
                        }
                    );
                } else if (results[0].step1 == "4-1") {
                    let userAnswer = msg.text;
                    bot.sendMessage(
                        msg.chat.id,
                        "Ilovada ro'yxatdan o'tish qanchalik qulay bo'ldi? 1 - juda noqulay , 5 - juda qulay.", {
                            reply_markup: {
                                resize_keyboard: true,
                                inline_keyboard: [
                                    [{
                                        text: "1️⃣",
                                        callback_data: "var2-6",
                                    }, ],
                                    [{
                                        text: "2️⃣",
                                        callback_data: "var2-7",
                                    }, ],
                                    [{
                                        text: "3️⃣",
                                        callback_data: "var2-8",
                                    }, ],
                                    [{
                                        text: "4️⃣",
                                        callback_data: "var2-9",
                                    }, ],
                                    [{
                                        text: "5️⃣",
                                        callback_data: "var2-10",
                                    }, ],
                                ],
                            },
                        }
                    );
                    connection.query(
                        "SELECT * FROM users WHERE userid = ?", [userId],
                        (error, results) => {
                            if (error) {
                                console.log(error, "1");
                            } else {
                                if (results.length === 0) {
                                    console.log("2");
                                } else {
                                    const sql =
                                        "UPDATE users SET step = '4-1' , step1 = ? WHERE userid = ?";
                                    connection.query(
                                        sql, [userAnswer, userId],
                                        function(err, results) {
                                            if (err) console.log(err, "3");
                                            else console.log("4");
                                        }
                                    );
                                }
                            }
                        }
                    );
                }
            }
        }
    );
});

bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const userId = callbackQuery.from.id;
    const msgId = callbackQuery.data;
    if (msgId === "ru") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "Чтобы зарегистрироваться отправьте свой номер телефона. Например, +998xx xxx xx xx"
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql = "UPDATE users SET step = '2' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "uz") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "Ro'yxatdan o'tish uchun telefon raqamingizni kiriting. Misol uchun, +998xx xxx xx xx"
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql = "UPDATE users SET step = '2-1' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var1-1") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "Насколько удобно было пройти регистрацию в приложении? от 1 до 5. Где 1-неудобно, 5-очень удобно.", {
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: [
                            [{
                                text: "1️⃣",
                                callback_data: "var2-1",
                            }, ],
                            [{
                                text: "2️⃣",
                                callback_data: "var2-2",
                            }, ],
                            [{
                                text: "3️⃣",
                                callback_data: "var2-3",
                            }, ],
                            [{
                                text: "4️⃣",
                                callback_data: "var2-4",
                            }, ],
                            [{
                                text: "5️⃣",
                                callback_data: "var2-5",
                            }, ],
                        ],
                    },
                }
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '4' , step1 = '1' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var1-2") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "Насколько удобно было пройти регистрацию в приложении? от 1 до 5. Где 1-неудобно, 5-очень удобно.", {
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: [
                            [{
                                text: "1️⃣",
                                callback_data: "var2-1",
                            }, ],
                            [{
                                text: "2️⃣",
                                callback_data: "var2-2",
                            }, ],
                            [{
                                text: "3️⃣",
                                callback_data: "var2-3",
                            }, ],
                            [{
                                text: "4️⃣",
                                callback_data: "var2-4",
                            }, ],
                            [{
                                text: "5️⃣",
                                callback_data: "var2-5",
                            }, ],
                        ],
                    },
                }
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '4' , step1 = '2' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var1-3") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "Насколько удобно было пройти регистрацию в приложении? от 1 до 5. Где 1-неудобно, 5-очень удобно.", {
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: [
                            [{
                                text: "1️⃣",
                                callback_data: "var2-1",
                            }, ],
                            [{
                                text: "2️⃣",
                                callback_data: "var2-2",
                            }, ],
                            [{
                                text: "3️⃣",
                                callback_data: "var2-3",
                            }, ],
                            [{
                                text: "4️⃣",
                                callback_data: "var2-4",
                            }, ],
                            [{
                                text: "5️⃣",
                                callback_data: "var2-5",
                            }, ],
                        ],
                    },
                }
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '4' , step1 = '3' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var1-4") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "Напишите откуда Вы узнали про приложение 'OLOVE'"
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql = "UPDATE users SET step1 = '4' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var1-5") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "Ilovada ro'yxatdan o'tish qanchalik qulay bo'ldi? 1 - juda noqulay , 5 - juda qulay.", {
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: [
                            [{
                                text: "1️⃣",
                                callback_data: "var2-6",
                            }, ],
                            [{
                                text: "2️⃣",
                                callback_data: "var2-7",
                            }, ],
                            [{
                                text: "3️⃣",
                                callback_data: "var2-8",
                            }, ],
                            [{
                                text: "4️⃣",
                                callback_data: "var2-9",
                            }, ],
                            [{
                                text: "5️⃣",
                                callback_data: "var2-10",
                            }, ],
                        ],
                    },
                }
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '4-1' , step1 = '1' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var1-6") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "Ilovada ro'yxatdan o'tish qanchalik qulay bo'ldi? 1 - juda noqulay , 5 - juda qulay.", {
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: [
                            [{
                                text: "1️⃣",
                                callback_data: "var2-6",
                            }, ],
                            [{
                                text: "2️⃣",
                                callback_data: "var2-7",
                            }, ],
                            [{
                                text: "3️⃣",
                                callback_data: "var2-8",
                            }, ],
                            [{
                                text: "4️⃣",
                                callback_data: "var2-9",
                            }, ],
                            [{
                                text: "5️⃣",
                                callback_data: "var2-10",
                            }, ],
                        ],
                    },
                }
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '4-1' , step1 = '2' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var1-7") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "Ilovada ro'yxatdan o'tish qanchalik qulay bo'ldi? 1 - juda noqulay , 5 - juda qulay.", {
                    reply_markup: {
                        resize_keyboard: true,
                        inline_keyboard: [
                            [{
                                text: "1️⃣",
                                callback_data: "var2-6",
                            }, ],
                            [{
                                text: "2️⃣",
                                callback_data: "var2-7",
                            }, ],
                            [{
                                text: "3️⃣",
                                callback_data: "var2-8",
                            }, ],
                            [{
                                text: "4️⃣",
                                callback_data: "var2-9",
                            }, ],
                            [{
                                text: "5️⃣",
                                callback_data: "var2-10",
                            }, ],
                        ],
                    },
                }
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '4-1' , step1 = '3' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var1-8") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(
                msg.chat.id,
                "'OLOVE' ilovasi to'g'risida qaerdan eshitganingizni yozing"
            )
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql = "UPDATE users SET step1 = '4-1' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-1") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Будете ли Вы использовать приложение?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Да",
                                callback_data: "var3-1",
                            },
                            {
                                text: "Нет",
                                callback_data: "var3-2",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5' , step2 = '1' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-2") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Будете ли Вы использовать приложение?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Да",
                                callback_data: "var3-1",
                            },
                            {
                                text: "Нет",
                                callback_data: "var3-2",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5' , step2 = '2' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-3") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Будете ли Вы использовать приложение?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Да",
                                callback_data: "var3-1",
                            },
                            {
                                text: "Нет",
                                callback_data: "var3-2",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5' , step2 = '3' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-4") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Будете ли Вы использовать приложение?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Да",
                                callback_data: "var3-1",
                            },
                            {
                                text: "Нет",
                                callback_data: "var3-2",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5' , step2 = '4' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-5") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Будете ли Вы использовать приложение?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Да",
                                callback_data: "var3-1",
                            },
                            {
                                text: "Нет",
                                callback_data: "var3-2",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5' , step2 = '5' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-6") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Ilovadan kelajakda foydalanasizmi?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Ha",
                                callback_data: "var3-3",
                            },
                            {
                                text: "Yo'q",
                                callback_data: "var3-3",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5-1' , step2 = '1' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-7") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Ilovadan kelajakda foydalanasizmi?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Ha",
                                callback_data: "var3-3",
                            },
                            {
                                text: "Yo'q",
                                callback_data: "var3-3",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5-1' , step2 = '2' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-8") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Ilovadan kelajakda foydalanasizmi?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Ha",
                                callback_data: "var3-3",
                            },
                            {
                                text: "Yo'q",
                                callback_data: "var3-3",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5-1' , step2 = '3' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-9") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Ilovadan kelajakda foydalanasizmi?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Ha",
                                callback_data: "var3-3",
                            },
                            {
                                text: "Yo'q",
                                callback_data: "var3-3",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5-1' , step2 = '4' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var2-10") {
        bot.answerCallbackQuery(callbackQuery.id).then(() =>
            bot.sendMessage(msg.chat.id, "Ilovadan kelajakda foydalanasizmi?", {
                reply_markup: {
                    resize_keyboard: true,
                    inline_keyboard: [
                        [{
                                text: "Ha",
                                callback_data: "var3-3",
                            },
                            {
                                text: "Yo'q",
                                callback_data: "var3-3",
                            },
                        ],
                    ],
                },
            })
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        const sql =
                            "UPDATE users SET step = '5-1' , step2 = '5' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
    } else if (msgId === "var3-1") {
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        let var1 = (results[0].step1 === 1) ? 'Страница OLOVE в Инстаграм' : (results[0].step1 === 2) ? 'Страница других пользователей в Инстаграм' : (results[0].step1 === 3) ? 'Знакомых' : results[0].step1
                        let var2 = results[0].step2
                        let var3 = (results[0].step3 === '1') ? 'Да' : 'Нет'
                        bot.answerCallbackQuery(callbackQuery.id).then(() =>
                            bot.sendMessage(
                                msg.chat.id,
                                `Спасибо за уделенное время. Мы только запустили наше приложение, и Ваше мнение очень ценно для нас. 1 сентября мы объявим победителей нашего конкурса и вручим ценные призы. Оставайтесь с нами, впереди вас ждет много интересного.

                                Ваши ответы:
1) Откуда Вы узнали про приложение - ${var1}
2) Насколько удобно было пройти регистрацию в приложении - ${var2}
3) Будете ли Вы использовать приложение - ${var3}`
                            )
                        );
                        const sql =
                            "UPDATE users SET step = '6' , step3 = '1' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
    } else if (msgId === "var3-2") {
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        let var1 = (results[0].step1 === 1) ? 'Страница OLOVE в Инстаграм' : (results[0].step1 === 2) ? 'Страница других пользователей в Инстаграм' : (results[0].step1 === 3) ? 'Знакомых' : results[0].step1
                        let var2 = results[0].step2
                        let var3 = (results[0].step3 === '1') ? 'Да' : 'Нет'
                        bot.answerCallbackQuery(callbackQuery.id).then(() =>
                            bot.sendMessage(
                                msg.chat.id,
                                `Спасибо за уделенное время. Мы только запустили наше приложение, и Ваше мнение очень ценно для нас. 1 сентября мы объявим победителей нашего конкурса и вручим ценные призы. Оставайтесь с нами, впереди вас ждет много интересного.

                                Ваши ответы:
1) Откуда Вы узнали про приложение - ${var1}
2) Насколько удобно было пройти регистрацию в приложении - ${var2}
3) Будете ли Вы использовать приложение - ${var3}`
                            )
                        );
                        const sql =
                            "UPDATE users SET step = '6' , step3 = '2' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
    } else if (msgId === "var3-3") {
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        let var1 = (results[0].step1 === 1) ? 'Instagram-dagi OLOVE sahifasi' : (results[0].step1 === 2) ? 'Instagram-dagi boshqa foydalanuvchilarning sahifasi' : (results[0].step1 === 3) ? 'Tanishlar orqali' : results[0].step1
                        let var2 = results[0].step2
                        let var3 = (results[0].step3 === '1') ? 'Ha' : "Yo'q"
                        bot.answerCallbackQuery(callbackQuery.id).then(() =>
                            bot.sendMessage(
                                msg.chat.id,
                                `Vaqtingiz uchun katta rahmat. Biz hozirda o'z dasturimizni ishga tushirdik va sizning fikr-mulohazalaringiz biz uchun juda qadrlidir. 1 sentyabr kuni biz tanlovimiz g'oliblarini e'lon qilamiz va qimmatbaho sovg'alarni topshiramiz. Bizni kuzatib turing, sizni oldinda ko'plab qiziqarli narsalar kutmoqda.
Sizning javoblaringiz:
1) OLOVE ilovasi to'g'risida qaerdan eshitdingiz - ${var1}
2) Ilovada ro'yxatdan o'tish qanchalik qulay bo'ldi - ${var2}
3) Ilovadan kelajakda foydalanasizmi - ${var3}`
                            )
                        );
                        const sql =
                            "UPDATE users SET step = '6-1' , step3 = '1' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
    } else if (msgId === "var3-4") {
        connection.query(
            "SELECT * FROM users WHERE userid = ?", [userId],
            (error, results) => {
                if (error) {
                    console.log(error, "1");
                } else {
                    if (results.length === 0) {
                        console.log("2");
                    } else {
                        let var1 = (results[0].step1 === 1) ? 'Instagram-dagi OLOVE sahifasi' : (results[0].step1 === 2) ? 'Instagram-dagi boshqa foydalanuvchilarning sahifasi' : (results[0].step1 === 3) ? 'Tanishlar orqali' : results[0].step1
                        let var2 = results[0].step2
                        let var3 = (results[0].step3 === '1') ? 'Ha' : "Yo'q"
                        bot.answerCallbackQuery(callbackQuery.id).then(() =>
                            bot.sendMessage(
                                msg.chat.id,
                                `Vaqtingiz uchun katta rahmat. Biz hozirda o'z dasturimizni ishga tushirdik va sizning fikr-mulohazalaringiz biz uchun juda qadrlidir. 1 sentyabr kuni biz tanlovimiz g'oliblarini e'lon qilamiz va qimmatbaho sovg'alarni topshiramiz. Bizni kuzatib turing, sizni oldinda ko'plab qiziqarli narsalar kutmoqda.
Sizning javoblaringiz:
1) OLOVE ilovasi to'g'risida qaerdan eshitdingiz - ${var1}
2) Ilovada ro'yxatdan o'tish qanchalik qulay bo'ldi - ${var2}
3) Ilovadan kelajakda foydalanasizmi - ${var3}`
                            )
                        );
                        const sql =
                            "UPDATE users SET step = '6-1' , step3 = '2' WHERE userid = ?";
                        connection.query(sql, userId, function(err, results) {
                            if (err) console.log(err, "3");
                            else console.log("4");
                        });
                    }
                }
            }
        );
        bot.deleteMessage(msg.chat.id, msg.message_id);
    }
});