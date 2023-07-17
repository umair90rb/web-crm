const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const fs = require("fs");

async function run() {
  const file = fs.readFileSync("zain.pdf");
  const doc = await PDFDocument.load(file);
  doc.registerFontkit(fontkit);
  const customFont = await doc.embedFont(
    fs.readFileSync("NotoNastaliqUrdu-VariableFont_wght.ttf")
  );
  const text = ".";
  const textSize = 3;
  const textWidth = customFont.widthOfTextAtSize(text, textSize);
  const textHeight = customFont.heightAtSize(textSize);
  const pages = doc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  firstPage.drawRectangle({
    color: rgb(1, 1, 1),
    borderColor: rgb(0, 0, 0),
    borderWidth: 0,
    height: 6.5,
    width: 45,
    x: 95,
    y: 589,
  });
  // for (let i = 0; i <= height; i += 10) {
  //   for (let j = 0; j <= width; j += 10) {
  //     console.log(i, j);
  //     pages[0].drawText(`${j},${i}`, {
  //       size: textSize,
  //       font: customFont,
  //       x: j,
  //       y: i,
  //       color: rgb(0, 0, 0),
  //     });
  //   }
  // }
  const updatedDoc = await doc.save();
  fs.writeFileSync("template.pdf", updatedDoc);
}

run();

const createPageLinkAnnotation = (pdf, uri, page) => {
  const { width, height } = page.getSize();
  pdf.context.register(
    pdf.context.obj({
      Type: "Annot",
      Subtype: "Link",
      /* Bounds of the link to the whole page */
      Rect: [0, 0, width, height],
      /* Give the link a 2-unit-wide border, with sharp corners */
      Border: [0, 0, 2],
      /* Make the border color blue: rgb(0, 0, 1) */
      C: [0, 0, 1],
      /* Page to be visited when the link is clicked */
      // Dest: [pageRef, 'XYZ', null, null, null],
      // URI Action
      A: { Type: "Action", S: "URI", URI: uri },
      // A: { S: 'URI', URI: uri },
    })
  );
};
