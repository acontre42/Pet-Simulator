import express from 'express';
const app = express();
const port = 3000;

import {fileURLToPath} from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});