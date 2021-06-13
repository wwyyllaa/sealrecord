import React, { useState } from 'react'
import { shell } from 'electron'
import './about.less'
import {
  Form,
  Input,
  Button,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Row,
  Col,
  Card,
  Divider,
  Modal,
} from 'antd'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import xlsx from 'xlsx'
import NewSelect from './select'
import { info, mkBlankFile } from './utils'
import sendMessage from './mail'

type SizeType = Parameters<typeof Form>[0]['size']
const currentPath = path.resolve('./')
const AllWorkDataPath = currentPath + '/登记总表.xlsx'
let DATE_FORMAT: string = 'YYYY-MM-DD'
let isMailOn = false

fs.exists(currentPath + '/logs', function (exists) {
  if (!exists) {
    fs.mkdirSync(currentPath + '/logs')
  }
})
mkBlankFile(AllWorkDataPath)
let workbook = xlsx.readFile(AllWorkDataPath)
let sheetNames = workbook.SheetNames //获取表明

let sheet = workbook.Sheets[sheetNames[0]] //通过表明得到表对象
let allData = xlsx.utils.sheet_to_json(sheet) //总表

//往指定xlsx追加数据
const addToAllXlsx = (primaryData: any, row: any, filename: string) => {
  const workbook = xlsx.utils.book_new()
  primaryData.push(row)
  const sheet = xlsx.utils.json_to_sheet(primaryData)
  xlsx.utils.book_append_sheet(workbook, sheet, 'sheet')
  mkBlankFile(filename)
  xlsx.writeFile(workbook, filename)
}
//xlsx日志按天
const xlsxDataLog = (values: any) => {
  const xlsxFilePath = currentPath + '/logs/日报表' + moment().format('YYYY-MM-DD') + '.xlsx'

  mkBlankFile(xlsxFilePath)
  let workbook = xlsx.readFile(xlsxFilePath)
  let sheetNames = workbook.SheetNames //获取表明

  let sheet = workbook.Sheets[sheetNames[0]] //通过表明得到表对象
  let data = xlsx.utils.sheet_to_json(sheet)
  addToAllXlsx(data, values, xlsxFilePath)
}
//json日志按天
const jsonDataLog = (values: any) => {
  const jsonFilePath = currentPath + '/logs/jsonData' + moment().format('YYYY-MM-DD') + '.json'

  mkBlankFile(jsonFilePath)
  const data = fs.readFileSync(jsonFilePath)

  let jsonData = JSON.parse(data.toString() || '[]')
  if (!jsonData) jsonData = []
  jsonData.push(values)

  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData))
}
const dateList: string[] = []
setInterval(() => {
  //每天23点推送报表
  const fileName = '今日用章报表.xlsx'
  const filePath = currentPath + '/logs/日报表' + moment().format('YYYY-MM-DD') + '.xlsx'
  if (moment().hour() == 23 && isMailOn) {
    const currentDate: string = moment().format(DATE_FORMAT)
    if (dateList.indexOf(currentDate) === -1 && fs.existsSync(filePath)) {
      dateList.push(currentDate)
      sendMessage(fileName, filePath)
    }
  }
}, 600000)

const FormSizeDemo = () => {
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  }
  const formItemSpan = { labelCol: { span: 6 }, wrapperCol: { span: 18 } }
  const onFinish = () => {
    // const fileName = '今日用章报表.xlsx'
    // const filePath = currentPath + '/logs/日报表' + moment().format('YYYY-MM-DD') + '.xlsx'
    // sendMessage(fileName, filePath)
    const values = form.getFieldsValue()
    values['审批时间'] = values['审批时间'].format('YYYY-MM-DD')
    values['用印时间'] = values['用印时间'].format('YYYY-MM-DD')
    jsonDataLog(values)
    xlsxDataLog(values)
    addToAllXlsx(allData, values, AllWorkDataPath)
    info(
      '',
      () => {
        null
      },
      '添加成功'
    )
    form.resetFields()
  }
  const [form] = Form.useForm()
  return (
    <>
      <Form
        form={form}
        name="seal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{ 审批时间: moment(), 用印时间: moment() }}
        onValuesChange={onFormLayoutChange}
        size={'large'}
        style={{ marginTop: 40 }}
        onFinish={onFinish}
      >
        <Form.Item label="用印类别" name="用印类别">
          <NewSelect dataName={'用印类别'} />
        </Form.Item>
        <Form.Item label="项目名称" name="项目名称">
          <Input />
        </Form.Item>
        <Form.Item label="备注" name="备注">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="申请人" name="申请人">
          <Input />
        </Form.Item>
        <Form.Item label="审批人" name="审批人">
          <NewSelect dataName={'审批人'} />
        </Form.Item>
        <Divider />
        <Form.Item label="行政印章" name="行政印章">
          <Input addonAfter="个" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="党组织印章" name="党组织印章">
          <Input addonAfter="个" style={{ width: 200 }} />
        </Form.Item>
        <Row>
          <Col span={4}></Col>
          <Col span={8} style={{ display: 'flex' }}>
            <Form.Item {...formItemSpan} label="" name="签名章名称">
              <NewSelect dataName={'签名章名称'} />
            </Form.Item>
            <Form.Item {...formItemSpan}>
              <span style={{ width: 80, textAlign: 'center', fontSize: 15 }}>签名章</span>
            </Form.Item>
            <Form.Item {...formItemSpan} label="" name="签名章个数">
              <Input addonAfter="个" style={{ width: 100 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={4}></Col>
          <Col span={8} style={{ display: 'flex' }}>
            <Form.Item {...formItemSpan} label="" name="业务专用章名称">
              <Input addonAfter="业务专用章" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item {...formItemSpan} label="" name="业务专用章个数">
              <Input addonAfter="个" style={{ width: 100 }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={4}></Col>
          <Col span={8} style={{ display: 'flex' }}>
            <Form.Item {...formItemSpan} label="" name="其他印章名称">
              <Input addonBefore="其他" addonAfter="印章" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item {...formItemSpan} label="" name="其他印章个数">
              <Input addonAfter="个" style={{ width: 100 }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        <Form.Item label="审批时间" name="审批时间">
          <DatePicker format={'YYYY-MM-DD'} />
        </Form.Item>
        <Form.Item label="用印时间" name="用印时间">
          <DatePicker format={'YYYY-MM-DD'} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={onFinish}>
            提交登记
          </Button>
          <Divider type="vertical" style={{ marginRight: 50 }} />
          <Switch
            onChange={(flag) => {
              isMailOn = flag
            }}
            checkedChildren="每日邮报功能开启"
            unCheckedChildren="每日邮报功能关闭"
          />
        </Form.Item>
      </Form>
    </>
  )
}
export default class About extends React.Component<PageProps> {
  render(): JSX.Element {
    return (
      <div style={{}}>
        <FormSizeDemo></FormSizeDemo>
      </div>
    )
  }
} // class About end
