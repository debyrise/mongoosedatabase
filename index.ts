import express, {Application, Request, Response } from "express"
import mongoose   from "mongoose"

const port:number = 5000

const url:string = "mongodb://0.0.0.0:27017/klass"

const app: Application = express()




//how to use schema in mogoose to collect to database
interface client{
    name: string,
    email:string,
    isActive: boolean,
    age:number
}

interface iclient extends client,mongoose.Document { }

const SchemaClient = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    isActive: {
        type: Boolean
    },
    age: {
        type: Number
    },
})
const datamodel = mongoose.model< iclient> ("client", SchemaClient)
//database connection done.

 //to create data using crud in mogoose
app.use(express.json())
app.post ("/api/v1/post-client", async  (req:Request, res:Response) => {
    try 
    {
        const {name, email,isActive,age} = req.body
        if(!name || !email || !isActive || !age)
        {
            return res.status(404).json({
                message: 'all filed is important'
            })
        }

        const data = await  datamodel.create ({
            name,
            email,
            isActive,
            age
        })

        return res.status(201).json({
            message: " created successfully",
            result: data
        })


    } catch(error){

        return res.status (404).json({
            message: "error message"
        })

    }
})

app.get("/api/v1/get-All", async(req:Request,res:Response) => {
    try
  { 
       const dataAll = await datamodel.find()

       return res.status (200).json({
        message: "all data",
        result:dataAll
     })

  }catch(error:any)
    {
     return res.status(404).json({
        mesage: error.message
     })
   }

})

app.put("/api/v1/updateall/:id", async (req:Request, res:Response) => {
      try
      {
        const dateid = [req.params.id]
        const updatedata = await datamodel.findByIdAndUpdate(dateid,req.body)
        if (!updatedata)
        {
              return res.status(404).json({
                 status: "failed to update",
                  message: "no data with the id: " + dateid + "was found to update"
                })
      }


         return res.status(200).json({
            status: "success",
            message: "updated succesfully",
            result:updatedata
        })
        
      }catch(error:any)
      {
         return res.status(500).json({
            message: error.message
         })
      }

})



app.delete("/api/v1/delete-one/:id", async(req:Request, res:Response)=>{
    try{
        const dataId = req.params.id
        const deletedData = await datamodel.findByIdAndDelete(dataId)
        

        if (!deletedData){
            return res.status(404).json({
                status: "failed to update",
                message: "no data with the id: " + dataId + "was found to delete"
            })
        }
        return res.status(200).json({
            status: "success",
            message: "data deleted successfully",
            result: deletedData
        })
    }catch(error:any)
    {
        return res.status(500).json({
            status: "failed",
            message: error.message
           })
 

       }
})





  
  


  
  









mongoose.connect(url).then(() => {
    console.log("database connected successfully")
}).catch((error:any)=> {
    console.log("an error occured", error)
})





const server = app.listen(port, () => {console.log("liestening on port", port)})
process.on ("uncaughtException", (error:Error) =>{ 
   console.log("stop here: uncaughtException  ")
   console.log(error)
   process.exit(1)

});


process.on("unhandledRejection", (reason: any) => {

     console.log("stop here: unhandledrejection")
    console.log(reason)


    server.close(()=>{
        process.exit
    })

})





