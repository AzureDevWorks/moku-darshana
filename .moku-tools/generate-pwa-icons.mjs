import sharp from "sharp";
import fs from "fs";
import path from "path";

const project = process.cwd();

const source = path.join(
    project,
    "public",
    "favicon.svg"
);

const outputDir = path.join(
    project,
    "public",
    "icons"
);

fs.mkdirSync(outputDir, { recursive: true });

if (!fs.existsSync(source)) {
    throw new Error(`Source SVG not found: ${source}`);
}

async function generate() {

    const icon192 = path.join(
        outputDir,
        "icon-192.png"
    );

    const icon512 = path.join(
        outputDir,
        "icon-512.png"
    );

    const icon512Maskable = path.join(
        outputDir,
        "icon-512-maskable.png"
    );

    /*
     * The original artwork is 48x46 rather than perfectly square.
     *
     * Sharp renders it into a square transparent canvas.
     * The maskable version receives additional transparent
     * breathing room so Android/Chrome adaptive masking does
     * not crop the artwork.
     */

    await sharp(source)
        .resize(192, 192, {
            fit: "contain",
            background: {
                r: 0,
                g: 0,
                b: 0,
                alpha: 0
            }
        })
        .png()
        .toFile(icon192);

    await sharp(source)
        .resize(512, 512, {
            fit: "contain",
            background: {
                r: 0,
                g: 0,
                b: 0,
                alpha: 0
            }
        })
        .png()
        .toFile(icon512);

    /*
     * Maskable icon:
     * keep the artwork inside the central safe area.
     */
    await sharp(source)
        .resize(384, 384, {
            fit: "contain",
            background: {
                r: 0,
                g: 0,
                b: 0,
                alpha: 0
            }
        })
        .extend({
            top: 64,
            bottom: 64,
            left: 64,
            right: 64,
            background: {
                r: 0,
                g: 0,
                b: 0,
                alpha: 0
            }
        })
        .png()
        .toFile(icon512Maskable);

    console.log(`Created: ${icon192}`);
    console.log(`Created: ${icon512}`);
    console.log(`Created: ${icon512Maskable}`);
}

await generate();
