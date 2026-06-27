local resource = GetCurrentResourceName()
local debugEnabled = GetConvarInt('ntx:debug', 0) == 1

---@param ... any
function debug(...)
  if not debugEnabled then return end

  local parts = {}
  for i = 1, select('#', ...) do
    parts[i] = tostring(select(i, ...))
  end

  print(('^3[ntx]^7 ^5[%s]^7 %s'):format(resource, table.concat(parts, ' ')))
end
