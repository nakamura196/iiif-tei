import axios from "axios";

const parseMember = (memberId: string, index: number) => {
  const [canvasId, xywhString] = memberId.split("#xywh=");
  const [x, y, w, h] = xywhString.split(",").map(Number);
  const ulx = x;
  const uly = y;
  const lrx = x + w;
  const lry = y + h;
  const zoneId = String(index).padStart(8, "0");
  const zone = `<zone xml:id="z-${zoneId}" ulx="${ulx}" uly="${uly}" lrx="${lrx}" lry="${lry}"/>`;

  return { canvasId, zone };
};

const generateSurface = (canvasId: string, zones: string[]) => `
  <surface source="${canvasId}">
    ${zones.join("\n")}
  </surface>
`;

const generateFacsimile = (manifest: string, surfaces: string[]) => `
  <facsimile source="${manifest}">
    ${surfaces.join("\n")}
  </facsimile>
`;

const curation2tei = async (url: string) => {
  const { data } = await axios.get(url);
  const selections = data.selections;

  let index = 0;
  let xmlString = "";

  for (const selection of selections) {
    const manifest = selection.within["@id"].split("?")[0];
    const members = selection.members;

    const zones: { [key: string]: string[] } = {};
    const canvases: string[] = [];

    for (const member of members) {
      index += 1;
      const { canvasId, zone } = parseMember(member["@id"], index);

      if (!canvases.includes(canvasId)) {
        canvases.push(canvasId);
        zones[canvasId] = [];
      }

      zones[canvasId].push(zone);
    }

    const surfaces = canvases.map((canvasId) =>
      generateSurface(canvasId, zones[canvasId])
    );
    xmlString += generateFacsimile(manifest, surfaces);
  }

  return xmlString;
};

export { curation2tei };
