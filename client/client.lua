RegisterCommand('show-nui', function()
  SetNuiFocus(true, true)
  SendNUIMessage({ action = 'open' })
  debug('Show NUI frame')
end)

RegisterNUICallback('hideFrame', function(_, cb)
  SetNuiFocus(false, false)
  SendNUIMessage({ action = 'close' })
  debug('Hide NUI frame')
  cb({})
end)

RegisterNUICallback('getClientData', function(data, cb)
  debug('Data sent by React', json.encode(data))

  local curCoords = GetEntityCoords(PlayerPedId())
  local retData <const> = { x = curCoords.x, y = curCoords.y, z = curCoords.z }

  cb(retData)
end)
