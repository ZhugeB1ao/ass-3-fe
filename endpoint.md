1. Bảng Student (Sinh viên)
GET /api/v1/students : Lấy danh sách tất cả sinh viên.

GET /api/v1/students/{id} : Lấy thông tin chi tiết của một sinh viên cụ thể theo ID.

POST /api/v1/students : Tạo mới một bản ghi sinh viên.

PATCH /api/v1/students/{id} : Cập nhật thông tin của sinh viên (có thể cập nhật một hoặc nhiều trường cùng lúc).

DELETE /api/v1/students/{id} : Xóa một sinh viên khỏi hệ thống.

2. Bảng Course (Khóa học / Môn học)
GET /api/v1/courses : Lấy danh sách các khóa học.

GET /api/v1/courses/{id} : Lấy thông tin chi tiết của một khóa học.

POST /api/v1/courses : Tạo mới một khóa học.

PATCH /api/v1/courses/{id} : Cập nhật thông tin khóa học.

DELETE /api/v1/courses/{id} : Xóa khóa học.

3. Bảng Class (Lớp học)
GET /api/v1/classes : Lấy danh sách các lớp học.

GET /api/v1/classes/{id} : Lấy thông tin chi tiết của một lớp học.

POST /api/v1/classes : Tạo mới một lớp học.

PATCH /api/v1/classes/{id} : Cập nhật thông tin lớp học.

DELETE /api/v1/classes/{id} : Xóa lớp học.