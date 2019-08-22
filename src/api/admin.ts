import { DB, ServiceKey } from './types/admin'
import express from 'express'
import fs from 'fs'

const app = express.Router()
const data: DB = {
  serviceKeys: []
}

const writeFile = ()=>{
  const fileData: string = JSON.stringify(data)
  fs.writeFile('./data.db', fileData,  (err)=>{
    if(err) {
      return console.log('error', err)
    }
    console.log('file write success')
  })
}

fs.readFile('./data.db', (err, file)=>{
  if(err){
    return console.log('error', err)
  }
  console.log('file read success')
  const fileData: DB = JSON.parse(file.toString() || '{}')
  data.serviceKeys = fileData.serviceKeys || []
})

app.post('/serviceHostsKeys', (req, res)=>{
  // create service keys
  const serviceHostKeys: ServiceKey = {id: data.serviceKeys.length, ...req.body}
  data.serviceKeys.push(serviceHostKeys)
  writeFile()
  res.json(serviceHostKeys)
})

app.get('/serviceHostsKeys', (req, res)=>{
  // get all servicekeys
  res.json(data.serviceKeys)
})

app.get('/serviceHostsKeys/:id', (req, res)=>{
  // grab one servicekey
  const id: number = Number(req.params.id)
  const selectedKey: ServiceKey = data.serviceKeys[id]
  res.json(selectedKey)
})

app.delete('/serviceHostsKeys/:id', (req, res)=>{
  // delete a servicekey
  const id: number = Number(req.params.id)
  data.serviceKeys.splice(id, 1) 
  writeFile()
  res.json(data.serviceKeys)
})

app.put('/serviceHostsKeys/:id', (req, res)=>{
  // replace servicekey info
  const id: number = Number(req.params.id)
  data.serviceKeys[id] = {...req.body}
  const replacedKey: ServiceKey = data.serviceKeys[id]
  writeFile()
  res.json(replacedKey)
})

app.patch('/serviceHostsKeys/:id', (req, res)=>{
  // edit servicekey info
  const id: number = Number(req.params.id)
      if(req.body.key) data.serviceKeys[id]['key']=req.body.key
      if(req.body.service)data.serviceKeys[id]['service']=req.body.service
      if(req.body.value) data.serviceKeys[id]['value']=req.body.value
      const editedKey: ServiceKey = data.serviceKeys[id]
  writeFile()
  res.json(editedKey)
})

module.exports = app
