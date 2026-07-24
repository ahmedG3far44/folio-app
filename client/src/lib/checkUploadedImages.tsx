

function checkUploadedImages(images: {size?: number}[]) {
    if(!images || images.length > 5){
        return false;
    }

    if(!images[0]){
        return false;
    }

    for(let i = 0; i < images.length; i++){
        const img = images[i];
        if(img && img.size && img.size > 1024 * 1024 * 5){
            return false;
        }
    }

    return true;  
}

export default checkUploadedImages