CREATE DATABASE `BronzeSword` CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE USER 'BronzeSword'@'%' IDENTIFIED BY '12345678';
GRANT ALL PRIVILEGES ON BronzeSword.* TO 'BronzeSword'@'%';
FLUSH PRIVILEGES;
