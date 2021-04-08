# png-to-ascii
 a tool to turn your .png image into an ascii-art textfile

# How to use

Clone this repository onto your local machine.

To use this tool, you also need a current node version, I tested on version 15. You can get node from [here](https://nodejs.org/en/).

Open a command prompt and navigate into the directory of the index.js file.

Install the dependencies with `npm install`

To use the tool, use the command `node index.js 'path/to/your/image.png' [scale] [inverted] [blur]`

## Options

scale : A Number higher then 1, indicating how much you want the image to be scaled down. I would recommend a value like `20` or `30`.

inverted : either `-i` or `-n`.  When specified to be -i, the colors of your image will be inverted. 

blur : Specifies, if you want to apply a basic blur effect on your image before converting to ascii art. If you wish to use blur, type e.g. `-b20`. 
       The Number can be changed to your needs, it controlls how often the blur operation is performed on your image. Keep in mind that increasing 
       it will have an negative impact on performance, because I didn't really optimize my code yet. 
       
## Example
```
node index.js image.png 30 -n -b10
```
