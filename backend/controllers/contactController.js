import userModel from "../models/userModel.js";
import contactMode from "../models/contactModel.js"

const contact = async (req, res) => {
    const {email} = req.body;    
    try {
            let userInfo = await userModel.findById(req.userId);            
            if (userInfo.email === email) {
                // Create a new Contact model
                const newContact = new contactMode({
                    username: req.body.username,
                    email: req.body.email,
                    subject: req.body.subject,
                    message: req.body.message
                })
                await newContact.save();
                res.json({success:true, message:"The message has been sent."})
            }else{
                res.json({success: false, message:"wrong email"})
            }
    } catch (error) {
        console.log(error);
        res.json({success: false, message:"Failed contacting!!!"})
    }

}

export {contact}

