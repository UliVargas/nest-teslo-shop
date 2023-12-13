import { v4 as uuid } from 'uuid'
import * as crypto from 'crypto'
import * as path from 'path';

export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {
    if ( !file ) return callback( new Error('File is empty'), false );

    const ext = path.extname(file.originalname);

    // const fileExtension = file.originalname.split('.')[1];

    const fileName = `${crypto.randomBytes(6).toString('hex')}${ext}`;

    callback(null, fileName );

}
