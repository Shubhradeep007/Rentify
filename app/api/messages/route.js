import connectDb from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

// to prevent issues when deploying
export const dynamic = "force-dynamic";

// GET /api/messages
export const GET = async () => {
  try {
    await connectDb();

    // get the id from the user session
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(JSON.stringify("User Id is required"), {
        status: 401,
      });
    }

    // Get userId from session
    const { userId } = sessionUser;

    // get user messages and name of the sender and the type of property
    const readMessages = await Message.find({ recipient: userId, read: true })
      .sort({ createdAt: -1 }) // sort read messages in ascending order
      .populate("sender", "username")
      .populate("property", "name");

    const unReadMessages = await Message.find({
      recipient: userId,
      read: false,
    })
      .sort({ createdAt: -1 }) // sort read messages in ascending order
      .populate("sender", "username")
      .populate("property", "name");

    // combine read and unread
    const messages = [...unReadMessages, ...readMessages];

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify("something went wrong", { status: 500 })
    );
  }
};

// POST /api/messages
export const POST = async (request) => {
  try {
    await connectDb();

    // get the data from the form through request body using (request.json)
    const { name, email, phone, message, property, recipient } =
      await request.json();

    // get session user
    const sessionUser = await getSessionUser();

    // check for the session
    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify(
          { message: "you must be logged in to send a message" },
          { status: 401 }
        )
      );
    }

    // get the user
    const { user } = sessionUser;

    // cannot send message to self
    if (user.id === recipient) {
      return new Response(
        JSON.stringify({ message: "cannot send a message to yourself" }),
        { status: 400 }
      );
    }

    // create new message
    const newMessage = new Message({
      sender: user.id,
      recipient,
      property,
      email,
      name,
      phone,
      body: message,
    });

    // save new message
    await newMessage.save();

    return new Response(
      JSON.stringify({ message: "Message sent" }, { status: 200 })
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify("something went wrong", { status: 500 })
    );
  }
};
