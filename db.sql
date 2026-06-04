-- Xóa database nếu đã tồn tại
DROP DATABASE IF EXISTS Std;

-- Tạo database mới
CREATE DATABASE Std;

-- Sử dụng database vừa tạo
USE Std;

-- Tạo bảng Std với các trường dữ liệu bổ sung
CREATE TABLE Std (
    Id          CHAR(3) PRIMARY KEY,
    Name        VARCHAR(20) NOT NULL,
    University  VARCHAR(30) NOT NULL,
    Email       VARCHAR(30) NOT NULL,
    Major       VARCHAR(50),        -- Trường mới: Chuyên ngành
    GPA         DECIMAL(3, 2)       -- Trường mới: Điểm trung bình (ví dụ: 3.50)
);

-- Thêm dữ liệu vào bảng Std
INSERT INTO Std (Id, Name, University, Email, Major, GPA) VALUES
('001', 'John Smith', 'NIIT', 'john@gmail.com', 'Computer Science', 3.50),
('002', 'Bill Carrey', 'MIT', 'bill@gmail.com', 'Data Science', 3.80),
('003', 'Nam Nguyen', 'HSU', 'nam@gmail.com', 'Software Engineering', 3.65),
('004', 'Anna Taylor', 'Stanford', 'anna@gmail.com', 'Information Systems', 3.90),
('005', 'David Tran', 'RMIT', 'david@gmail.com', 'Cybersecurity', 3.40),
('006', 'Linda Pham', 'FPT University', 'linda@gmail.com', 'Graphic Design', 3.75),
('007', 'Michael Doe', 'Harvard', 'michael@gmail.com', 'Computer Science', 3.95),
('008', 'Sarah Connor', 'UCLA', 'sarah@gmail.com', 'AI Engineering', 3.85),
('009', 'Hoang Le', 'BKU', 'hoang@gmail.com', 'Computer Engineering', 3.60),
('010', 'Emily Chen', 'NUS', 'emily@gmail.com', 'Data Analytics', 3.88);