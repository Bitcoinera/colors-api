const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const colorsArray = require('./data');
const Color = require('./schema');

dotenv.config();
const app = express();
app.use(bodyParser.json());

// GET All. INTRO
app.get('/', (req, res) => {
    const intro = 
        `Welcome, this is a simple colors API, just for learning purposes.
        To use it, add to the URL \'/colors/\' and let the fun begin.
        These are the current avaliable colors.`
    colorsArray.unshift(intro)
    res.json(colorsArray)
})

// Route all colors
app.route('/colors')
    .get( async (req, res, next) => {
        try {
            await Color.find({}, (err, colors) => {
                res.json(colors);
            })
        } catch (error) {
            return next(error);
        }
    })

    .post( async (req, res, next) => {
        try {
            await Color.insertMany(colorsArray);
            res.redirect('/colors');

        } catch (error) {
            return next(error);
        }
    })

    .delete( async (req, res, next) => {
        try {
            await Color.deleteMany();
            res.send('All colors have been erased');
        } catch (error) {
            return next(error);
        }
    })

// Route all the CRUD actions with one color
app.route('/colors/:color')
    // GET One Color
    .get( async (req, res, next) => {

        try {
            let getColor = await Color.findOne({color: req.params.color});
            res.json(getColor);

        } catch (error) {
            return next(error);
        }

    })

    // POST One Color
    .post( async (req, res, next) => {

        try {
            let newColor = new Color({ color: req.body.color, hex: req.body.hex });
            await newColor.save()
            res.redirect('/colors');

        } catch (error) {
            return next(error);
        }
    })

    // DELETE One Color
    .delete( async (req, res, next) => {

        try {
            await Color.findOneAndDelete({ color: req.body.color });
            res.send(`Color ${req.body.color} Deleted!`);
        
        } catch (error) {
            return next(error);
        }

    })

    // Update one color
    .put(async function (req, res, next) {

        let color_to_update = req.params.color;
        let new_color = req.body.color;
        let new_hex = req.body.hex; 
    
        try {
          await Color.findOneAndUpdate({ color: color_to_update }, {color: new_color, hex: new_hex}, function ( error, color ) {
            if (!color) {
              res.send('Cannot update a non-existing color');
            } else {
              res.redirect('/colors/' + color_to_update);
            }
          });
        } catch (error) {
            return next(error);
        }
    })


// Route not found
app.use((req, res, next) => {
    return res.status(404).send('URL Not Found');
});

// Inner error
app.use((error, req, res, next) => {
    console.error(error);
    return res.status(500).send(error || 'There was an error');
})


const PORT = process.env.PORT || 3000;

app.listen( PORT, () => {
    console.log(`Server is listening at localhost:${PORT}`)
})