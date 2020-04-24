import fs from 'fs';
import Jimp from 'jimp';
import { URL, parse as parseUrl } from 'url';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        // improvement: maybe use a uuid?
        const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        /**
         * @var fqImgPath The fully qualified path to the image.
         */
        const fqImgPath = __dirname + outpath;
        await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(fqImgPath, img => {
                resolve(fqImgPath);
            });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

/**
 * @return true if:
 *   - the given string is a valid http(s) url
 *   - the path ends in png|jpg|jpeg|bmp|tiff|gif
 */
export function isValidImgUrl(str: string): boolean {
    if (!str) {
        return false;
    }
    try {
        // following line should throw an error if str is invalid
        new URL(str);
        const parsed = parseUrl(str);
        if(!['http:', 'https:'].includes(parsed.protocol)) {
            return false;
        }
        return parsed.pathname.match(/\.(png|jpg|jpeg|bmp|tiff|gif)$/i) !== null;
    } catch (err) {
        return false;
    }
}