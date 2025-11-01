

function checkUploadedImages(images:File[]) {
    if(!images || images.length > 5){
        return false;
    }

    if(!images[0]){
        return false;
    }

    for(let i = 0; i < images.length; i++){
        if(images[i].size > 1024 * 1024 * 5){
            return false;
        }
    }

    return true;  
}

export default checkUploadedImages