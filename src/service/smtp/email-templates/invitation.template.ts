export const invitationTemplate = `<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thư mời</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            border-radius: 20px;
        }
        .header {
            text-align: center;
            background-image: linear-gradient(to bottom right, #273f4b, #a3dadf);
            color: white;
            padding: 10px;
            border-radius: 20px 20px 0 0;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #4CAF50;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
        }
        .button:hover {
            background-color: #45a049;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #555;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thư mời tham gia sự kiện!</h1>
        </div>
        <div class="content">
            <p>Chào bạn,</p>
            <p>Chúng tôi rất hân hạnh được mời bạn tham gia sự kiện <strong>{{eventName}}</strong> của chúng tôi. Sự kiện sẽ diễn ra vào ngày <strong>{{startDate}}</strong> tại <strong>{{address}}</strong>.</p>
            <p>Lịch trình dự kiến của chúng tôi:</p>
            {{{timeline}}}
            <p>Chúng tôi rất mong được đón tiếp bạn tại sự kiện!</p>
            <p>Trân trọng,</p>
            <p>{{customerName}}</p>
        </div>
        <div class="footer">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua số điện thoại {{customerPhoneNumber}}.</p>
        </div>
    </div>
</body>
</html>
`;
