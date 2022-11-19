-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 18, 2022 lúc 06:41 PM
-- Phiên bản máy phục vụ: 10.4.22-MariaDB
-- Phiên bản PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `company_management`
--
CREATE DATABASE IF NOT EXISTS `company_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `company_management`;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `absence`
--

CREATE TABLE IF NOT EXISTS `absence` (
  `UserID` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `MaxAbsenceDay` int(11) NOT NULL,
  `DayAbsence` int(11) DEFAULT 0,
  `LastRequest` datetime DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `absence`
--

INSERT INTO `absence` (`UserID`, `MaxAbsenceDay`, `DayAbsence`, `LastRequest`) VALUES
('US002', 12, 0, '2022-01-15 21:00:31'),
('US003', 15, 0, '2022-01-15 20:44:51'),
('US004', 12, 0, NULL),
('US005', 15, 0, '2022-01-15 21:24:07'),
('US006', 12, 0, NULL),
('US007', 12, 0, NULL),
('US008', 15, 0, '2022-01-15 21:25:03'),
('US009', 15, 0, NULL),
('US010', 12, 0, NULL),
('US011', 12, 0, NULL),
('US012', 12, 0, NULL),
('US013', 12, 0, NULL),
('US014', 15, 0, NULL),
('US015', 15, 0, '2022-01-15 21:25:31'),
('US016', 12, 0, NULL),
('US017', 12, 0, NULL),
('US018', 12, 0, NULL),
('US019', 12, 0, NULL),
('US020', 12, 0, NULL),
('US021', 12, 0, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `absence_request`
--

CREATE TABLE IF NOT EXISTS `absence_request` (
  `RequestID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `DateBegin` date NOT NULL,
  `DateEnd` date NOT NULL,
  `Reason` longtext COLLATE utf8_unicode_ci NOT NULL,
  `Status` varchar(30) COLLATE utf8_unicode_ci DEFAULT 'Waiting',
  `RequestTime` datetime NOT NULL DEFAULT current_timestamp(),
  `ResponseMessage` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `ResponseTime` datetime DEFAULT NULL,
  PRIMARY KEY (`RequestID`),
  KEY `FK_Absence_Request_User` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `absence_request`
--

INSERT INTO `absence_request` (`RequestID`, `UserID`, `DateBegin`, `DateEnd`, `Reason`, `Status`, `RequestTime`, `ResponseMessage`, `ResponseTime`) VALUES
(1, 'US003', '2022-04-20', '2022-04-27', 'Tại hạ cáo từ vài bữa, Hẹn ngày tái ngộ.', 'Waiting', '2022-04-16 20:44:51', NULL, NULL),
(2, 'US002', '2022-04-19', '2022-04-20', 'Anh Quá cho em đi bar 1 bữa', 'Waiting', '2022-04-19 21:00:31', NULL, NULL),
(3, 'US005', '2022-01-23', '2022-01-31', 'Bị ốm có nguy cơ nhiễm Cô Vít Mười Chín', 'Approved', '2022-01-15 21:24:07', 'Chúc em mau chóng hồi phục và trở lại công ty sớm. Giữ sức khỏe nha.', '2022-01-15 21:27:08'),
(4, 'US008', '2022-01-16', '2022-01-17', 'Nghỉ đi nhậu', 'Approved', '2022-01-15 21:25:02', 'Tan ca đi nhậu chung.', '2022-01-15 21:26:30'),
(5, 'US015', '2022-01-22', '2022-01-25', 'Thích thì xin nghỉ. Tái bút.', 'Refused', '2022-01-15 21:25:31', 'Lí do không hợp lý.', '2022-01-15 21:25:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

CREATE TABLE IF NOT EXISTS `account` (
  `UserID` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `Activated` bit(1) DEFAULT b'0',
  `Username` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `RequestResetPassword` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`Username`),
  KEY `FK_Account_User` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`UserID`, `Activated`, `Username`, `Password`, `RequestResetPassword`) VALUES
('US002', b'0', 'cothico', '$2y$10$aKawGTVwgdgOlAJI7.X4feJJAHbKnDG/mStt3nyntm3HrQdKAjZWm', b'0'),
('US017', b'0', 'docamchi', '$2y$10$MR9z7ZYX5TSgEsHjJ9eYsOwgI6pGcag6yGGXcfiCNf4PMaKeTMoMa', b'0'),
('US001', b'0', 'doccocaubai', '$2y$10$ckLh6wJPmf2XfxbWZzyZFebwG5gqgUoJ9EqXJrnGUHnq2M6RlGVsq', b'0'),
('US003', b'0', 'duongquaxa', '$2y$10$GnbjR7XToolR5C7KW0.ltu4CCcKoTDP8iJWDxHL8JZm8TwOWsZFF6', b'0'),
('US019', b'0', 'honhathong', '$2y$10$.JIF0T6G40pAnuKUjJNgLOgYWE9h10vyn1oPsGuCM8mH/yQqDuH/.', b'0'),
('US011', b'0', 'hotrucmai', '$2y$10$.Lkuuh0nvxfTiuUthG9kJuS5H1KJVOob8zEuOt6iduTxEcHR9UopS', b'0'),
('US018', b'0', 'lediemanh', '$2y$10$k47BIAdyjdoCxXiQ.Y47Cetrc/kdiqHRGTXRA.4OQlbcb0oIv87w2', b'0'),
('US021', b'0', 'lethibuoi', '$2y$10$QcQ5b.NcK/zqYk65pak9/uSH7Kv0Y9BA8Uc0T436Sd9IlvxHayF/.', b'0'),
('US015', b'0', 'lyducthanh', '$2y$10$I1AHdX8vGfQ/tJkXXI4gc.zbiqkAqvJ27ibhK.OPQ74u0IBWR7NZO', b'0'),
('US004', b'0', 'lymacsau', '$2y$10$ZP2vZv5C6Yp/1fX9abdoLOHlNWOUzIYcKlNguG59cGTzpOjcoeXgi', b'0'),
('US013', b'0', 'ngogiahuy', '$2y$10$m1cpZs72yEiS2dTHC8HQ.e4pWasm4aEc7/O.3C99zC71U8E/rbNPi', b'0'),
('US014', b'0', 'ngotuyetbang', '$2y$10$vIe5s8qSYt2T0R4XT11i8eXzRVHLFPrGxBmAJJ8QhB2DF40oqZl9K', b'0'),
('US016', b'0', 'nguyendieulinh', '$2y$10$GdgGXgBGf/D.0sd9QHrvb.hZ1ScgxnbVo1z0DIBHeiyf07x5cpzsS', b'0'),
('US005', b'0', 'nguyenphuonglinh', '$2y$10$iTM02bCQWTkvdgqcoFwexOKI1OK/r.t7mOJKRhjFdB3kRG5Z4dnKa', b'0'),
('US007', b'0', 'nguyenthanhhieu', '$2y$10$OPwtJlUxE4.f5IHQJ0TmJe.3qjJliyo/VQdoclU5y8arHky7/K/yG', b'0'),
('US006', b'0', 'nguyenthanhvy', '$2y$10$a53pYKHNdlX.tVOS3SpPxejSEahsJe61.zlNITvYVIu3wU6J.VkEi', b'0'),
('US010', b'0', 'phamhuucanh', '$2y$10$PLhZX86g7QIOUk6bM16Va.REYnkyJQ22e4XdikY5tY3reScvVMH0u', b'0'),
('US009', b'0', 'phanquynhmai', '$2y$10$GoFqdey2.ZxCzXfyhGihq.PwRGpTAcR7meiimYXlNBRfoQZ5cmA4q', b'0'),
('US008', b'0', 'trandinhdieu', '$2y$10$JOB/uxYG0ae.vvdrVt9t3.NSkSf69saNCuYBxjbBE3cjxHZ2wpekC', b'0'),
('US012', b'0', 'trandinhhuong', '$2y$10$v3W6RrMHAtrCWQsd8a35uedt2pjr7n3KMougIFl.SB0t2FZyOoDKa', b'0'),
('US020', b'0', 'vothuanthanh', '$2y$10$DRgQFI8ICPG.cMsjaCe7C.lj8ZgXbPBYUTRPSC0.vEoeXyipz.4Wa', b'0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `department`
--

CREATE TABLE IF NOT EXISTS `department` (
  `DepartmentID` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `DepartmentName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `DepartmentRoomID` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `LeaderID` char(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `DepartmentDescription` longtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`DepartmentID`),
  UNIQUE KEY `LeaderID` (`LeaderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `department`
--

INSERT INTO `department` (`DepartmentID`, `DepartmentName`, `DepartmentRoomID`, `LeaderID`, `DepartmentDescription`) VALUES
('CSKH001', 'Phòng chăm sóc khách hàng', 'P004', 'US005', 'Lập kế hoạch và triển khai công tác tuyển dụng nhằm đáp ứng nhu cầu hoạt động của doanh nghiệp.\nTiếp cận các kênh truyền thông để đưa thông tin tuyển dụng đến gần hơn với ứng viên tiềm năng.\nTạo mối liên kết với các nguồn cung ứng nhân lực: Trường Đại học, Cao đẳng, đơn vị đào tạo nghề…\nTrực tiếp đề xuất với cấp trên các ý tưởng nhằm nâng cao chất lượng công việc của nhân viên.\nTính toán tiền lương và các chế độ chính sách phúc lợi cho nhân viên.'),
('HC001', 'Phòng hành chính', 'P002', 'US008', 'Tiếp nhận và xử lý các công việc nội bộ trong doanh nghiệp.\r\nTiếp khách, xử lý các công văn mà khách hàng gửi tới\r\nTổ chức sắp xếp hội thảo, hội nghị cho công ty\r\nLưu trữ, phát hành văn bản, con dấu và chịu trách nhiệm trước ban giám đốc và pháp luật về tính pháp lý.\r\nĐảm bảo an toàn lao động, vệ sinh trong công ty, lên kế hoạch tập huấn về bảo hộ lao động\r\nTổ chức kiểm tra sức khỏe thường xuyên cho người lao động'),
('IT001', 'Phòng công nghệ thông tin', 'P003', 'US003', 'Xây dựng chiến lược và kế hoạch phát triển CNTT trong từng giai đoạn phát triển của doanh nghiệp. \r\nThực hiện báo cáo về tình trạng hoạt động CNTT và đề ra hướng giải quyết sự cố liên quan đến hệ thống CNTT.\r\nChịu trách nhiệm điều hành và quản lý hoạt động CNTT.\r\nQuản lý, đảm bảo cơ sở hạ tầng về kỹ thuật công nghệ thông tin cho các hoạt động trong doanh nghiệp.\r\nTư vấn triển khai giải pháp phần mềm quản lý, đào tạo cho doanh nghiệp; '),
('KD001', 'Phòng kinh doanh', 'P001', 'US014', 'Nghiên cứu và thực hiện các công việc tiếp cận thị trường\r\nĐưa ra các chiến lược giới thiệu sản phẩm và việc mở rộng phát triển thị trường\r\nLên kế hoạch tổ chức và thực hiện các hoạt động kinh doanh cũng như tính toán báo cáo về giá thành để tạo hợp đồng với khách.\r\nThực hiện việc theo dõi, đôn đốc tiến độ thực hiện các chiến lược kinh doanh của các phòng ban trong công ty, để đảm bảo được thực hiện đúng quy trình và tiến độ sản xuất sản phẩm với các hợp đồng của khách hàng.'),
('KT001', 'Phòng kế toán', 'P009', 'US009', 'Thực hiện công việc về nghiệp vụ chuyên môn tài chính kế toán theo quy định của Nhà nước.'),
('MKT001', 'Phòng marketing', 'P006', 'US015', 'Xây dựng và quản lý hệ thống chăm sóc khách hàng tốt nhất.\nThiết kế chương trình khuyến mãi và bảo hành sản phẩm cho khách hàng\nTham gia tài trợ các hoạt động xã hội để quảng bá hình ảnh thương hiệu.\nXây dựng hệ thống thu thập, tổng hợp thông tin về giá cả, sản phẩm của đối thủ cạnh tranh.\nPhân tích, đánh giá thông tin thu thập được, từ đó đưa ra quyết định cải tiến hoặc phát triển sản phẩm mới.'),
('NS001', 'Phòng nhân sự', 'P007', NULL, 'Lập kế hoạch và triển khai công tác tuyển dụng nhằm đáp ứng nhu cầu hoạt động của doanh nghiệp.\nTiếp cận các kênh truyền thông để đưa thông tin tuyển dụng đến gần hơn với ứng viên tiềm năng.\nTạo mối liên kết với các nguồn cung ứng nhân lực: Trường Đại học, Cao đẳng, đơn vị đào tạo nghề…\nTrực tiếp đề xuất với cấp trên các ý tưởng nhằm nâng cao chất lượng công việc của nhân viên.\nTính toán tiền lương và các chế độ chính sách phúc lợi cho nhân viên.\nTính toán, quyết toán mức thuế thu nhập cá nhân cho nhân viên theo quy định pháp luật.'),
('QHQT001', 'Phòng quan hệ quốc tế', 'P008', NULL, 'Tổ chức đàm phán, ký kết các văn bản hợp tác với các đối tác quốc tế. \r\nChuẩn bị nội dung, chương trình, tài liệu và các điều kiện khác để làm việc với các đối tác nước ngoài.\r\nThực hiện đúng hồ sơ, thủ tục để ký kết các văn bản hợp tác với những tổ chức ngoài nước.\r\nBáo cáo thống kê, tổng hợp định kỳ và đột xuất kết quả hoạt động hợp tác quốc tế.\r\nXây dựng chiến lược hợp tác quốc tế trung và dài hạn.');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `TaskID` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `ManagerID` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `OfficerID` char(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `TaskTitle` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `TaskDescription` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `Status` varchar(20) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'New',
  `DateCreate` timestamp NOT NULL DEFAULT current_timestamp(),
  `Deadline` timestamp NOT NULL DEFAULT current_timestamp(),
  `TaskRate` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`TaskID`),
  KEY `FK_Task_User_Manager` (`ManagerID`),
  KEY `FK_Task_User_Officer` (`OfficerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `task_conversation`
--

CREATE TABLE IF NOT EXISTS `task_conversation` (
  `TaskConversationID` int(11) NOT NULL,
  `TaskID` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `UserID` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `ConversationDetail` varchar(300) COLLATE utf8_unicode_ci NOT NULL,
  `Time_Stamp` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`TaskConversationID`,`TaskID`) USING BTREE,
  KEY `FK_TaskConversation_Task` (`TaskID`),
  KEY `FK_TaskConversation_User` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `UserID` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `FullName` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Gender` varchar(10) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Khác',
  `Role` varchar(20) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'Nhân viên',
  `Salary` int(11) NOT NULL,
  `Email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `DOB` date NOT NULL,
  `PhoneNumber` char(15) COLLATE utf8_unicode_ci NOT NULL,
  `Avatar` char(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `DepartmentID` char(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  KEY `DepartmentID` (`DepartmentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`UserID`, `FullName`, `Gender`, `Role`, `Salary`, `Email`, `DOB`, `PhoneNumber`, `Avatar`, `DepartmentID`) VALUES
('US001', 'Độc Cô Cầu Siêu', 'Nam', 'Giám đốc', 0, 'tabatbai@gmail.com', '1996-07-19', '0862972345', NULL, NULL),
('US002', 'Cô Cô', 'Nữ', 'Nhân viên', 13500000, 'tieulongnu@gmail.com', '1991-11-01', '0442071791', NULL, 'IT001'),
('US003', 'Dương Quá', 'Nam', 'Trưởng phòng', 22000000, '1tay_trumthienha@gmail.com', '1993-01-06', '0428697730', NULL, 'IT001'),
('US004', 'Lý Mạc Sầu Tím Thiệp Hồng', 'Nữ', 'Nhân viên', 13000000, '999lan_thattinh@gmail.com', '1993-03-16', '0526420342', NULL, 'IT001'),
('US005', 'Nguyễn Phương Linh', 'Nữ', 'Trưởng phòng', 14200000, 'nguyenphuonglinh@gmail.com', '1985-11-11', '0311702191', NULL, 'CSKH001'),
('US006', 'Nguyễn Thanh Vy', 'Nữ', 'Nhân viên', 9000000, 'nguyenthanhvy@gmail.com', '1994-10-24', '0604250505', NULL, 'CSKH001'),
('US007', 'Nguyễn Thanh Hiếu', 'Nam', 'Nhân viên', 11000000, 'nguyenthanhhieu@gmail.com', '2003-05-01', '0139177643', NULL, 'HC001'),
('US008', 'Trần Ðình Diệu', 'Nam', 'Trưởng phòng', 12000000, 'trandinhdieu@gmail.com', '1984-02-09', '0500070052', NULL, 'HC001'),
('US009', 'Phan Quỳnh Mai', 'Nữ', 'Trưởng phòng', 11500000, 'phanquynhmai@gmail.com', '1996-11-03', '0669078009', NULL, 'KT001'),
('US010', 'Phạm Hữu Canh', 'Nam', 'Nhân viên', 10000000, 'phamhuucanh@gmail.com', '2002-01-14', '0908836250', NULL, 'CSKH001'),
('US011', 'Hồ Trúc Mai', 'Nữ', 'Nhân viên', 9000000, 'hotrucmai@gmail.com', '1981-02-13', '0213442861', NULL, 'KT001'),
('US012', 'Trần Đinh Hương', 'Nữ', 'Nhân viên', 9560000, 'trandinhhuong@gmail.com', '2001-02-15', '0341915411', NULL, 'KD001'),
('US013', 'Ngô Gia Huy', 'Nam', 'Nhân viên', 16500000, 'ngogiahuy@gmail.com', '2002-01-17', '0270056940', NULL, 'KD001'),
('US014', 'Ngô Tuyết Băng', 'Nữ', 'Trưởng phòng', 14000000, 'ngotuyetbang@gmail.com,', '2000-01-13', '0996684871', NULL, 'KD001'),
('US015', 'Lý Ðức Thành', 'Nam', 'Trưởng phòng', 13500000, 'lyducthanh@gmail.com', '1998-01-15', '0479999827', NULL, 'MKT001'),
('US016', 'Nguyễn Diệu Linh', 'Nữ', 'Nhân viên', 18500000, 'nguyendieulinh@gmail.com', '2002-05-02', '0203613761', NULL, 'MKT001'),
('US017', 'Đỗ Cẩm Chi', 'Nữ', 'Nhân viên', 13500000, 'docamchi@gmail.com', '2003-05-08', '0321565506', NULL, 'NS001'),
('US018', 'Lê Diễm Anh', 'Nữ', 'Nhân viên', 12000000, 'lediemanh@gmail.com', '1987-12-12', '0491027609', NULL, 'NS001'),
('US019', 'Hồ Nhật Hồng', 'Nam', 'Nhân viên', 13500000, 'honhathong@gmail.com', '1993-01-26', '0837182337', NULL, 'QHQT001'),
('US020', 'Võ Thuận Thành', 'Nam', 'Nhân viên', 14500000, 'vothuanthanh@gmail.com', '1995-06-18', '0110776553', NULL, 'QHQT001'),
('US021', 'Lê Thị Bưởi', 'Nữ', 'Nhân viên', 12300000, 'lethibuoi@gmail.com', '1999-11-19', '0925188492', NULL, 'IT001');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `absence`
--
ALTER TABLE `absence`
  ADD CONSTRAINT `FK_Abcence_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `absence_request`
--
ALTER TABLE `absence_request`
  ADD CONSTRAINT `FK_Absence_Request_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `FK_Account_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `FK_Department_User` FOREIGN KEY (`LeaderID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `FK_Task_User_Manager` FOREIGN KEY (`ManagerID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Task_User_Officer` FOREIGN KEY (`OfficerID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `task_conversation`
--
ALTER TABLE `task_conversation`
  ADD CONSTRAINT `FK_TaskConversation_Task` FOREIGN KEY (`TaskID`) REFERENCES `task` (`TaskID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_TaskConversation_User` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_User_Department` FOREIGN KEY (`DepartmentID`) REFERENCES `department` (`DepartmentID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
