import { v2 as cloudinary } from 'cloudinary';
async function cloud(file){
    const result=await new Promise((resolve,reject)=>{
        const uploadStream=cloudinary.uploader.upload_stream((err,res)=>{
            if(err) reject(err)
                else resolve(res)
        })
        uploadStream.end(file)

    })
    return result
}
export default cloud;