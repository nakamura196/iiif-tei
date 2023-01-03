import axios from "axios"

const curation2tei = async (url: string) => {
  let xml_string = ""
  const {data} = await axios.get(url)
  const selections = data.selections

  let index = 0

  for(const selection of selections){

    let selection_string = ""

    const manifest = selection.within["@id"].split("?")[0]

    const members = selection.members

    const zones: any = {}
    const canvases: any = []

    for(const member of members) {
      const member_id = member["@id"]
      const spl = member_id.split("#xywh=")
      const canvas_id = spl[0]

      if(!canvases.includes(canvas_id)){
        canvases.push(canvas_id)
        zones[canvas_id] = []
      }

      const xywh = spl[1].split(",")
      const x = Number(xywh[0])
      const y = Number(xywh[1])
      const w = Number(xywh[2])
      const h = Number(xywh[3])
      const ulx = x
      const uly = y
      const lrx = x + w
      const lry = y + h

      index += 1

      const zone_id = String(index).padStart(8, "0")

      const zone = `<zone xml:id="z-${zone_id}" ulx="${ulx}" uly="${uly}" lrx="${lrx}" lry="${lry}"/>`

      zones[canvas_id].push(zone)
    }

    for(const canvas_id of canvases) {
      selection_string += `<surface source="${canvas_id}">
      ${zones[canvas_id].join('\n')}
      </surface>`
    }

    selection_string = `<facsimile source="${manifest}">
    ${selection_string}
    </facsimile>`
    xml_string += selection_string
  }

  return xml_string
}

export { curation2tei }