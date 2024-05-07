import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin:"http://localhost:5173"}));

  const dbSchema = new mongoose.Schema({
    myDetails: [
      {
        image: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
        experience: {
          type: Number,
          required: true,
        },
      },
    ],
    aboutMe: [
      {
        about: {
          type: String,
        },
        pointer: {
          type: String,
        },
      },
    ],
    skillsAndProfeciences: [
      {
        skills: {
          type: String,
        },
      },
    ],
    workExperience: {
      clientDescription:{
          type: String,
      },
      country:{
          type: String,
      },
      projectName:{
          type: String,
      },
      experienceRole:{
          type: String,
      },
      duration:{
          type: Date,
      },
      businessSolution:{
          type: String,
      },
      technologyStack:{
          type: String,
      },
      projectResponsibility:{
          type: String,
      }
    },
  });

const dbModel = mongoose.model("enquiries", dbSchema);

app.get("/getData", async (req, res) => {
    const data = await dbModel.find();
    res.json(data)
    res.send(data);
});
////////////////
app.post("/send", async(req, res)=>
  {
    const dataToSave = new dbModel(req.body);
  try {
    await dataToSave.save();
    res.send("data mil gaya");
     
  } catch (error) {
      console.log(error);
      return res.send(error);
  }
  });



// //////////////////////////
// app.post("/send", async (req, res) => {
//     const dataToSave = new dbModel(req.body);
//     await dataToSave.save();
//     res.send("data mil gaya");

// } )


app.put("/update/:id", async (req, res) => {
  const idToUpdate = req.params.id;
  try {
    const updatedData = req.body;
    console.log(updatedData , "update")
    const updatedItem = await dbModel.findByIdAndUpdate(idToUpdate, updatedData, { new: true });
    console.log(updatedItem , "99")
    await updatedItem.save();
    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: error });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await dbModel.findByIdAndDelete(id);
    res.status(200).send("Successfully deleted.");
  } 
  catch (error)
  {
    res.status(400).json({ message: error.message });
  }
});




mongoose.connect("mongodb://127.0.0.1:27017/resumebuilder")

app.listen(port, () => {
    console.log("Server Is Running");
})