drop database if exists chatgpt_battles;
create database chatgpt_battles;

\connect chatgpt_battles;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS solves;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL,
    auth0_user_key VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL,
    user_id INTEGER NOT NULL,
    name VARCHAR(225) NOT NULL,
    prompt VARCHAR(511) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS solves (
    id SERIAL,
    user_id INTEGER NOT NULL,
    challenge_id INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE ON UPDATE CASCADE
);
