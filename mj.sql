/*
Navicat MySQL Data Transfer

Source Server         : local
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : mj

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2017-06-09 17:56:56
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roomid` int(11) DEFAULT NULL,
  `hoster` varchar(255) DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `type` char(255) DEFAULT NULL,
  `rule` char(255) DEFAULT NULL,
  `time` char(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of room
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) DEFAULT NULL,
  `openid` char(255) DEFAULT NULL,
  `ico` char(255) DEFAULT NULL,
  `card` int(255) DEFAULT NULL,
  `tuijian` char(255) DEFAULT NULL,
  `history` char(255) DEFAULT NULL,
  `time` char(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('100', '传', '123456', 'img/123.jpg', '2', '001', '1,2,3,4', null);
INSERT INTO `user` VALUES ('109', '张三', '12345', 'img/head.jpg', '12', '888', null, '1496306800578');
INSERT INTO `user` VALUES ('110', '张三', 'vi0z5n', 'img/head.jpg', '2', '888', null, '1496652665394');
