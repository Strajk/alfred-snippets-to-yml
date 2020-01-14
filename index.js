const fs = require("fs")

const globby = require("globby")
const YAML = require("yaml")
const plist = require("plist")

const OUTPUT = {}
const COLLECTIONS = {}
globby.sync("src/**/*.json").forEach(path => {
  const file = require("./" + path)

  const collection = path.split("/")[1] // src/Personal/xyz.json => Personal
  const { snippet, name, keyword } = file.alfredsnippet

  if (!COLLECTIONS[collection]) {
    try {
      const _file = plist.parse(fs.readFileSync(`src/${collection}/info.plist`, "utf8"))
      COLLECTIONS[collection] = {
        prefix: _file.snippetkeywordprefix,
        suffix: _file.snippetkeywordsuffix,
      }
    } catch (e) { // info.plist doesn't exist, use default values
      COLLECTIONS[collection] = {
        prefix: "",
        suffix: "",
      }
    }
  }

  const collectionKey = `${collection}{${COLLECTIONS[collection].prefix}}{${COLLECTIONS[collection].suffix}}`
  const key = `${name}{${keyword}}`

  if (!OUTPUT[collectionKey]) OUTPUT[collectionKey] = {}

  OUTPUT[collectionKey][key] = snippet
})

const result = YAML.stringify(OUTPUT)

console.log(result)
fs.writeFileSync("result.yml", result)
