import ImageKit from 'imagekit-javascript';
import { UrlOptions } from 'imagekit-javascript/dist/src/interfaces';
import { Transformation } from 'imagekit-javascript/dist/src/interfaces/Transformation';


const publicKey = process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY
const urlEndpoint = process.env.EXPO_PUBLIC_IMAGEKIT_URL || ''


const imagekit = new ImageKit({
    publicKey,
    urlEndpoint,
});

export const getImagekitUrlFromPath = function (
    imagePath: string,
    transformationArray:  Array<Transformation>,
  ) {
    const ikOptions:UrlOptions = {
      urlEndpoint,
      path: imagePath,
      transformation: transformationArray,
    };
  
    const imageURL = imagekit.url(ikOptions);
  
    return imageURL;
  };
  