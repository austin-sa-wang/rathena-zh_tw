-- This Lua script updates the "防禦" field in the "identifiedDescriptionName" property
-- of the items listed in a JSON file with the corresponding defense value from another JSON file.
-- It then writes the updated items to a new Lua file.
-- The output is in UTF-8. If you want to use it in rAthena, you need to convert it to Windows ANSI in Windows.

-- Load required modules
local json = require("lunajson")

-- Load the iteminfo table
local iteminfo = require("iteminfo-unescaped")

function prettyPrint(tbl, indent)
  if not indent then indent = 0 end

  for k, v in pairs(tbl) do
      formatting = string.rep("  ", indent) .. k .. ": "

      if type(v) == "table" then
          print(formatting)
          prettyPrint(v, indent + 1)
      else
          print(formatting .. tostring(v))
      end
  end
end

prettyPrint(iteminfo)

-- Set the input and output file paths
local itemDbArmorIdDefPath = "../database/item_db-prerenewal-armor-def-dict.json"
local outputIteminfoPath = "../output/iteminfo-prerenewal-TW_utf8.lua"

-- Open the armor ID and defense value JSON file for reading
local armorIdDefDictionaryFile = io.open(itemDbArmorIdDefPath, "r")
if not armorIdDefDictionaryFile then
  error("Failed to open file")
end

-- Read the contents of the file into a string
local armorIdDefDictionaryFileContent = armorIdDefDictionaryFile:read("*all")

-- Close the file
armorIdDefDictionaryFile:close()

-- Decode the JSON data
local armorIdDefDictionary = json.decode(armorIdDefDictionaryFileContent)

-- Initialize tables to hold missing and updated IDs
local missing_ids = {}
local updated_ids = {}

-- Update the items table with the defense values from the armor ID and defense value JSON file
for _, armor in ipairs(armorIdDefDictionary) do
  local id = armor["id"]
  local def = armor["def"]
  print(id, def)
  local item = iteminfo[id]

  -- Update the "防禦" field in the identified description name
  -- Skip the update if the item is not found
  if item ~= nil then
    local desc_name = item.identifiedDescriptionName

    -- Update the "防禦" field in the identified description name
    for i, str in ipairs(desc_name) do
      if string.find(str, "防禦:") then
        local new_str = string.format("防禦: ^777777%d^000000", def)
        print('new_str', new_str)
        desc_name[i] = new_str
        break
      end
    end
    table.insert(updated_ids, id)
  else -- Add the ID to the missing IDs table
    table.insert(missing_ids, id)
  end
end

-- Print the IDs of the updated and missing items
print('Updated IDs:', json.encode(updated_ids))
print("Missing IDs:", json.encode(missing_ids))

local itemsFormatted = "{\n"
for id, item in pairs(iteminfo) do
  local unidentifiedDesc = ""
  for _, line in ipairs(item.unidentifiedDescriptionName) do
    unidentifiedDesc = unidentifiedDesc .. "\n      " .. "[=[" .. line .. "]=]" .. ","
  end
  local identifiedDesc = ""
  for _, line in ipairs(item.identifiedDescriptionName) do
    identifiedDesc = identifiedDesc .. "\n      " .. "[=[" .. line .. "]=]" .. ","
  end

  local itemDefinition = string.format(
    "  [%d] = {\n    unidentifiedDisplayName = [=[%s]=],\n    unidentifiedResourceName = [=[%s]=],\n    unidentifiedDescriptionName = {%s\n    },\n    identifiedDisplayName = [=[%s]=],\n    identifiedResourceName = [=[%s]=],\n    identifiedDescriptionName = {%s\n    },\n    slotCount = %d,\n    ClassNum = %d,\n  },\n",
    id,
    item.unidentifiedDisplayName,
    item.unidentifiedResourceName,
    unidentifiedDesc,
    item.identifiedDisplayName,
    item.identifiedResourceName,
    identifiedDesc,
    item.slotCount,
    item.ClassNum
  )
  itemsFormatted = itemsFormatted .. itemDefinition
end
itemsFormatted = itemsFormatted .. "\n}"

-- Prepend with "local tbl = "
table_str = "local tbl = " .. itemsFormatted

-- Append with "return tbl"
table_str = table_str .. "\n\nreturn tbl\n"

-- Open the output file for writing
local outFile = io.open(outputIteminfoPath, "w", "utf8")
-- Write the updated iteminfo table to the output file
outFile:write(table_str)

-- Close the output file
outFile:close()
