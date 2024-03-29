# Dự án: Đồ án cuối kỳ môn Kiến trúc hướng dịch vụ - Hệ thống Quản lý nội bộ

# API DOCS: https://documenter.getpostman.com/view/18159742/2s8YmUKeb9#783ce71f-a222-4868-ba1e-6db0f1fe1d96

## Mô tả:
1. Tính năng của ứng dụng:
	- Quản lý nhân viên.
	- Quản lý phòng ban.
	- Quản lý nhiệm vụ.
	- Quản lý nghỉ phép.
	
2. Nền tảng phát triển:
	- Kiến trúc hệ thống:
		- Microservice:
			- Service User (Quản lý thông tin nhân viên, tài khoản...)
			- Service Deparment (Quản lý phòng ban)
			- Service Task (Quản lý nhiệm vụ)
			- Service Absence (Quản lý thông tin nghỉ phép, đơn xin nghỉ phép...)
			
	- Backend xây dựng RESTful API xác thực bằng JsonWebToken: 
		- Nền tảng: Node.js
		- Framework: ExpressJS, Flask Python
		
	- Cơ sở dữ liệu: 
		- NoSQL MongoDB
		
	- Frontend: 
		- Flask Jinja2
		
3. Thành viên:
	- 51900712 Trương Tuấn Thịnh
	- 51900718 Tăng Kiến Trung
	- 51900751 Trần Bảo Kha

## Các bước chạy dự án:
### Backend

#### Chạy thủ công:

1. Vào thư mục backend/{service cần chạy} mở cửa sổ Terminal và chạy lệnh

```
npm i 
```

chạy lệnh 
```
pip install -r requirements.txt
``` 
(nếu chạy task-service)

để tiến hành cài đặt các modules cần thiết

2. Sau khi cài đặt thành công các modules thì chạy lệnh

```
npm run start
``` 

chạy lệnh 

```
python index.py
``` 

(nếu chạy task-service)
để chạy service. 

3. Quan sát Terminal nếu hiện kết quả
```
Server is running on http://localhost:{PORT}
Mongoose connection connected
````
Thì ứng dụng đã chạy thành công.

#### Chạy tự động:

1. Đọc file 'readme.txt' để tạo môi trường ảo.

2. Chạy file run.bat để chạy tất cả 4 service. 
(Nếu có lỗi trong quá trình chạy vui lòng xóa dòng số 4 trong file run.bat và chạy thủ công service task).

3. Chạy file stop.bat nếu muốn dừng tất cả 4 service.

### Frontend
1. Vào thư mục frontend mở cửa sổ Terminal và chạy lệnh
```
pip install -r requirements.txt
```
để tiến hành cài đặt các modules cần thiết

2. Sau khi cài đặt thành công các modules thì chạy lệnh
```
python index.py
``` 

để chạy server Frontend ở PORT 5000. 
(Nếu muốn chạy ở PORT khác thì cài đặt biến môi trường PORT = số port muốn chạy)

3. Truy cập http://localhost:5000 để thử các chức năng