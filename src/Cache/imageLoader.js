//  First we need a type of cache to avoid creating resources for images
//  we have already fetched in the past
import createResource from "./cache";
const cache = new Map();

// then we create our loadImage function, this function receives the source
// of the image and returns a resource
function loadImage(source) {
  // here we start getting the resource from the cache
  let resource = cache.get(source);
  // and if it's there we return it immediately
  if (resource) return resource;
  // but if it's not we create a new resource
  resource = createResource(
    () =>
      // in our async function we create a promise
      new Promise((resolve, reject) => {
        // then create a new image element
        const img = new window.Image();
        // set the src to our source
        img.src = source;
        // and start listening for the load event to resolve the promise
        img.addEventListener("load", () => resolve(source));
        // and also the error event to reject the promise
        img.addEventListener("error", () =>
          reject(new Error(`Failed to load image ${source}`))
        );
      })
  );
  // before finishing we save the new resource in the cache
  cache.set(source, resource);
  // and return return it
  return resource;
}

export default loadImage;
