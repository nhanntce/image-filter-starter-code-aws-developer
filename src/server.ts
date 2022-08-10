import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import path from 'path';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  /**
   * Filter image
   */
  app.get('/filteredimage', async (req: Request, res: Response) => {
    let imageUrl: string;
    //validate image url
    if(req.query.image_url === undefined || req.query.image_url === "") {
      res.status(400).send("The image url is invalid!");
    } 
    imageUrl = req.query.image_url as string;
    
    try {
      var options = {
        root: path.join(__dirname)
      };
      let savePath = await filterImageFromURL(imageUrl);
      res.sendFile(savePath);
      //wait 5 minutes to response then delete filter image
      setTimeout(() => {
        deleteLocalFiles([savePath])
      }, 60000 * 5)
    } catch(error) {
      res.status(500).send("Filter the image fail!");
    }
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();