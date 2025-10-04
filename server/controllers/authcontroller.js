import User from "../models/user.js"
export const register = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(409).json({ message: "username or email already exists" })
    }

    const user = new User({ fullname, username, email, password })
    await user.save()

    res.status(201).json({ message: "user created successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "server error" })
  }
}

export const login = async (req, res) => {
  try {
    // stub login — we can add JWT later
    res.status(200).json({ message: "login endpoint works" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "server error" })
  }
}
