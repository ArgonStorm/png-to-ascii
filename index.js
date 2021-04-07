import * as fs from "fs"
import { PNG } from "pngjs"

let args = process.argv

let filename = args[2]

let scale = Number(args[3])

let invert = args[4]
let blur = args[5]

if(filename) {
    fs.createReadStream(filename)
        .pipe(new PNG())
        .on("parsed", function() {

            console.log("Loaded the Image")

            if(invert == "-i") {
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                      var idx = (this.width * y + x) << 2;
              
                      this.data[idx] = 255 - this.data[idx];
                      this.data[idx + 1] = 255 - this.data[idx + 1];
                      this.data[idx + 2] = 255 - this.data[idx + 2];
              
                    }
                }
            }

            let data = greyscale(this.data, this.width, this.height)

            if(blur != undefined) {
                let b = blur.split("-b")

                let b_passes = Number(b[1])

                data = blur_img(data, this.width, this.height, b_passes)
            }
            let text = to_ascii_art(data, this.width, this.height, 1 / scale)
            
            fs.writeFileSync("text_out.txt", text)
            console.log(text)
        })
}

function to_ascii_art(data, width, height, res) {

    let n_w = Math.floor(width * res)
    let n_h = Math.floor(height * res)

    let text = ""

    const s_levl = [
        "  ",
        " .",
        " ,",
        " -",
        " :",
        " +",
        " /",
        " o",
        " 0",
        " 8",
    ]

    console.log("starting to create ascii")

    

    for(let y = 0; y < n_h; y++) {
        for(let x = 0; x < n_w; x++) {

            let px = Math.floor(x / res)
            let py = Math.floor(y / res)

            let id = (width * py + px) // << 2

            //let grey = Math.floor(( data[id] + data[id + 1] + data[id + 2] ) / 3)
           
            let ascii_char = Math.floor( map(data[id], 0, 255, 0, s_levl.length) )
            //console.log("char: " + ascii_char + " grey: " + grey)
            ascii_char == (s_levl.length) ? ascii_char = s_levl.length - 1 : ascii_char = ascii_char
            text += s_levl[ascii_char]
        }
        text += "\n"
    }

    return text

}

function map(n, u1, u2, v1, v2) {
    return ( ( (n - u1) * (v2 - v1) ) / (u2 - u1) ) + v1
}

function blur_img(da, width, height, passes = 1) {
    let d = da
    let data = []
    for(let i = 0; i < passes; i++) {
        data = []
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
              var idx = (width * y + x);
    
              if( x > 0 && y > 0 && x + 1 < width && y + 1 < height ) {
    
                let sum =   d[ (width * (y + 1) + (x - 1)) ] + 
                            d[ (width * (y + 1) + (x)) ] +
                            d[ (width * (y + 1) + (x + 1)) ] +
    
                            d[ (width * (y) + (x - 1)) ] +
                            d[ (width * (y) + (x)) ] +
                            d[ (width * (y) + (x + 1)) ] +
    
                            d[ (width * (y - 1) + (x - 1)) ] +
                            d[ (width * (y - 1) + (x)) ] +
                            d[ (width * (y - 1) + (x + 1)) ]
    
                data[(width * (y) + (x))] = ( Math.floor(sum / 9) )
              } else {
                data[idx] = d[idx]
              }
            }
        }
        d = data
    }
    return data
}

function greyscale(data, width, height) {
    let d = []
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {

            let id = (width * y + x) << 2

            let grey = Math.floor(( data[id] + data[id + 1] + data[id + 2] ) / 3)
            d.push(grey)
        }
    }

    return d
}