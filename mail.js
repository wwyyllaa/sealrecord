var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var moment = require('moment')

// 开启一个 SMTP 连接池
var transport = nodemailer.createTransport(
  smtpTransport({
    host: 'smtp.126.com', // 主机，各服务商的主机地址不同，比如qq的是smtp.qq.com
    secure: false, // 使用 SSL
    secureConnection: false, // 使用 SSL
    port: 25, // 网易的SMTP端口，各个服务商端口号不同，比如qq的是465
    auth: {
      user: 'lfth6224418@126.com', // 账号
      pass: 'IXTWWNSMFTUUMNBZ', // 如果是网易邮箱，这个并不是登录密码，而是授权码
    },
  })
)
function sendMessage(filename, filePath) {
  // 设置邮件内容
  var mailOptions = {
    from: 'lfth6224418<lfth6224418@126.com>', // 发件人地址
    to: '348464550@qq.com', // 收件人列表,逗号分隔，可以放多个
    subject: '印章登记日报:' + moment().format('YYYY-MM-DD'), // 标题
    html: '<b>附件为今天的用章登记情况：</b> ', // html 内容
    attachments: [
      {
        filename: filename,
        path: filename,
      },
    ],
  }
  // 发送邮件
  transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error)
    } else {
      console.log('Message send ok')
    }
    transport.close() // 如果没用，关闭连接池
  })
}

export default sendMessage
