import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin:"http://localhost:5173"}));
///////////////////////////////////////////////////////////////////////////////////
const dbSchema = new mongoose.Schema({
    
      
        firstname: {
          type: String,
          required: true,
        },
        lastname: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
  });

const dbModel = mongoose.model("formdata", dbSchema);

//////////////////////////////////////////////////////////////////////////////
app.get("/getData", async (req, res) => {
    const data = await dbModel.find();
    res.json(data);
    console.log(data);
});
//////////////////////////////////////////////////////////////////////////////
app.post("/logedin", async (req, res) => {
    const user = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        const newUser = new dbModel(user);
        await newUser.save();
        console.log(user)
        res.status(200).send("User created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error");
    }
});
////////////////////////////////////////////////////////////////////////////////
app.post("/login", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  try {
      const user = await dbModel.findOne({ email, firstname, lastname });
      if (!user) {
          return res.status(404).send({ message: "User not found" });}
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return res.status(200).send({ message: "Login successful" });
      } else {
        return res.status(401).send({ message: "Invalid credentials" });}
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).send({ error: "Internal server error" });}
});
/////////////////////////////////////////////////////////////////////////////////
app.put("/update/:id", async (req, res) => {
  const idToUpdate = req.params.id;
  try {
    const updatedData = req.body;
    const updatedItem = await dbModel.findByIdAndUpdate(idToUpdate, updatedData, { new: true });
    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: error });}
});
/////////////////////////////////////////////
app.patch("/resetpassword/:id", async (req, res) => {
  const idToUpdate = req.params.id;
  const newPassword = req.body.password;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await dbModel.findByIdAndUpdate(idToUpdate,{ password: hashedPassword });
    res.status(200).send("Password reset successfully");
  } catch (error) {
    res.status(500).send("Error resetting password");}
});
//////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////
mongoose.connect("mongodb://127.0.0.1:27017/resumebuilder");
app.listen(port, () => {
    console.log("Server is running");
});



















