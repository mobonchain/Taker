 <h1 align="center">Hi 👋, I'm Mob</h1>
<h3 align="center">Join the Cryptocurrency Market, make money from Airdrop - Retroactive with me</h3>

- <p align="left"> <img src="https://komarev.com/ghpvc/?username=mobonchain&label=Profile%20views&color=0e75b6&style=flat" alt="mobonchain" /> <a href="https://github.com/mobonchain"> <img src="https://img.shields.io/github/followers/mobonchain?label=Follow&style=social" alt="Follow" /> </a> </p>

- [![TopAME | Bullish - Cheerful](https://img.shields.io/badge/TopAME%20|%20Bullish-Cheerful-blue?logo=telegram&style=flat)](https://t.me/xTopAME)

# Taker Mining Tool - Hướng Dẫn Cài Đặt và Sử Dụng

## Yêu cầu :
- Cài đặt **[Node.js](https://nodejs.org/en)** nếu đang dùng **Windows** và đã đăng ký **[Taker](https://earn.taker.xyz/?start=4H29F)** thực hiện **Mining lần đầu** trước khi chạy Tool

---

## Cài Đặt Trên Windows

### Bước 1: Tải và Giải Nén File

1. Nhấn vào nút **"Code"** màu xanh lá cây, sau đó chọn **Download ZIP**.
2. Giải nén file ZIP vào thư mục mà bạn muốn lưu trữ.

### Bước 2: Cấu Hình Proxy

1. Mở file `proxy.txt` trong thư mục vừa giải nén.
2. Thêm thông tin proxy theo định dạng sau vào file `proxy.txt`:

   ```
   https://username:pass@host:port
   ```
- Mỗi **Proxy** tương ứng **1 Ví**
### Bước 3: Cấu Hình Wallet

1. Mở file `wallets.json` trong thư mục vừa giải nén.
2. Thêm thông tin ví của bạn vào file `wallets.json` theo định dạng sau:

   ```json
   [
       {
           "address": "Your_Wallet_Address1",
           "privateKey": "Your_PrivateKey_Wallet1"
       },
       {
           "address": "Your_Wallet_Address2",
           "privateKey": "Your_PrivateKey_Wallet2"
       }
   ]
   ```

   - **Your_Wallet_Address1**: Địa chỉ ví của bạn
   - **Your_PrivateKey_Wallet1**: Khóa riêng (private key) của ví tương ứng
   - Có thể thêm nhiều ví với số lượng **Proxy** tương ứng

### Bước 4: Cài Đặt Các Module

1. Mở **Command Prompt (CMD)** hoặc **PowerShell** trong thư mục chứa các tệp vừa giải nén.
2. Chạy lệnh sau để cài đặt các module yêu cầu:

   ```bash
   npm install
   ```

### Bước 5: Chạy Ứng Dụng

Sau khi cài đặt các module thành công, chạy ứng dụng bằng lệnh:

```bash
node index.js
```

---

## Cài Đặt Trên Linux (VPS)

### Bước 1: Tạo Phiên `screen`

1. Đăng nhập vào VPS của bạn qua SSH.

2. Tạo một phiên `screen` mới để chạy công cụ **Taker** mà không bị gián đoạn khi bạn rời khỏi terminal:

   ```bash
   screen -S taker
   ```

### Bước 2: Git Clone Dự Án

   ```bash
   git clone https://github.com/mobonchain/Taker.git
   cd Taker
   ```

### Bước 3: Cài Đặt Node.js và NPM

1. Kiểm tra xem Node.js và npm đã được cài đặt chưa:

   ```bash
   node -v
   npm -v
   ```

   Nếu chưa cài đặt, bạn có thể cài Node.js và npm bằng các lệnh sau (cho **Ubuntu/Debian**):

   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

   Đối với các hệ điều hành khác, hãy tham khảo tài liệu chính thức của **[Node.js](https://nodejs.org/en/)**.

### Bước 4: Cài Đặt Các Module

1. Sau khi clone về, chạy lệnh sau để cài đặt các module yêu cầu:

   ```bash
   npm install
   ```

### Bước 5: Cấu Hình Proxy

1. Mở file `proxy.txt`:

   ```bash
   nano proxy.txt
   ```
2. Thêm thông tin proxy của bạn theo định dạng sau:
   ```
   https://username:pass@host:port
   ```
3. Lưu và thoát bằnd lệnh **Ctrl + O** & **Ctrl + X**

### Bước 6: Cấu Hình Wallet

1. Mở file `wallets.json`:

   ```bash
   nano wallets.json
   ```
2. Thêm thông tin ví của bạn theo định dạng sau:
   ```json
   [
       {
           "address": "Your_Wallet_Address1",
           "privateKey": "Your_PrivateKey_Wallet1"
       }
   ]
   ```
3. Lưu và thoát bằnd lệnh **Ctrl + O** & **Ctrl + X**

### Bước 7: Chạy Ứng Dụng

1. Sau khi cài đặt xong các module và cấu hình, chạy ứng dụng bằng lệnh:

   ```bash
   node index.js
   ```

### Bước 8: Để Ứng Dụng Chạy Tiếp Tục Sau Khi Đăng Xuất

Khi bạn muốn để ứng dụng chạy trong nền và không bị gián đoạn khi đăng xuất khỏi phiên SSH, bạn có thể tách khỏi phiên `screen` bằng cách nhấn `Ctrl + A` rồi nhấn `D`.

Để quay lại phiên `screen` đã tạo, bạn chỉ cần chạy lệnh:

```bash
screen -r taker
```

Chúc bạn cài đặt thành công **Taker Mining Tool** trên **Windows** và **Linux (VPS)**. Nếu gặp phải bất kỳ vấn đề nào có thể hỏi thêm tại **[TopAME | Chat - Supports](https://t.me/yTopAME)**
