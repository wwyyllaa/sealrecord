import React from 'react'
import fs from 'fs'
import {Modal} from 'antd'

export function info(message:any, ok: any, title?: any) {
    Modal.info({
      title: title || '文件未关闭',
      content: (
        <div>
          <p>{message}</p>、
        </div>
      ),
      onOk() {ok()},
    });
  }
  
export const mkBlankFile = (path: any) => {
    let file = 0;
    try{
      file = fs.openSync(path, 'a')
    }catch(e){
      info('请关闭: ' + path, ()=>mkBlankFile(path))
    }finally{
      fs.closeSync(file)
    }
  }
  