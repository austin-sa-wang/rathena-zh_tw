-- This Lua script updates the "防禦" field in the "identifiedDescriptionName" property
-- of the items listed in a JSON file with the corresponding defense value from another JSON file.
-- It then writes the updated items to a new Lua file.
-- The output is in UTF-8. If you want to use it in rAthena, you need to convert it to Windows ANSI in Windows.

-- Load required modules
local json = require("lunajson")
local serpent = require("serpent")

-- Load the iteminfo table
local iteminfo = require("iteminfo-TW_utf8")

-- Set the input and output file paths
local itemDbArmorIdDefPath = "rathena-zh_tw/database/item_db-prerenewal-armor-def-dict.json"
local outputIteminfoPath = "rathena-zh_tw/client/iteminfo-prerenewal-TW_utf8.lua"

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

-- Open the output file for writing
local outFile = io.open(outputIteminfoPath, "w", "utf8")

-- Serialize the updated iteminfo table to Lua code
local table_str = serpent.block(iteminfo, {comment=false})

-- Prepend with "local tbl = "
table_str = "local tbl = " .. table_str

-- Append with "return tbl"
table_str = table_str .. "\n\nreturn tbl\n"

-- Write the updated iteminfo table to the output file
outFile:write(table_str)

-- Close the output file
outFile:close()
