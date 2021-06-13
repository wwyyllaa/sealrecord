import React, { useState } from 'react'
import { Select, Divider, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import path from 'path'
import fs from 'fs'
import { mkBlankFile } from './utils'

const { Option } = Select
const currentPath = path.resolve('./')
const fileName = currentPath + '/config.json'
mkBlankFile(fileName)
const data = fs.readFileSync(fileName)

let index = 0

interface NewSelectProps {
  value?: any
  onChange?: (value: any) => void
  dataName: string
}
interface isState {
  jsonData: string
  name: any
  items: any
}
class NewSelect extends React.Component<NewSelectProps, isState> {
  constructor(props: any) {
    super(props)
    let jsonData = JSON.parse(data.toString() || '{}')
    if (!jsonData[props.dataName]) {
      jsonData[props.dataName] = []
    }
    const list = jsonData[props.dataName]

    this.state = {
      jsonData,
      items: list,
      name: '',
    }
  }

  onNameChange = (event: any) => {
    this.setState({
      name: event.target.value,
    })
  }

  addItem = () => {
    const { items, name, jsonData } = this.state
    if (!name) {
      return
    }
    jsonData[this.props.dataName].push(name)
    mkBlankFile(fileName)
    fs.writeFileSync(fileName, JSON.stringify(jsonData))
    this.setState({
      items: [...jsonData[this.props.dataName]],
      name: '',
    })
  }

  render() {
    const { items, name } = this.state
    return (
      <Select
        style={{ width: 240 }}
        placeholder="请选择"
        onChange={this.props.onChange}
        allowClear
        value={this.props.value}
        dropdownRender={(menu) => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
              <Input style={{ flex: 'auto' }} value={name} onChange={this.onNameChange} />
              <a
                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                onClick={this.addItem}
              >
                <PlusOutlined /> 添加
              </a>
            </div>
          </div>
        )}
      >
        {items.map((item: any) => (
          <Option key={item} value={item}>
            {item}
          </Option>
        ))}
      </Select>
    )
  }
}

export default NewSelect
