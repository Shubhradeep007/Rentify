import connectDb from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// PUT /api/messages/:id
export const PUT = async (request, { params }) => {
  try {
    await connectDb();

    // get the id from params, "{id} is determined by the name of the folder"
    const { id } = params;

    // get the id from the user session
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response("User Id is required", {
        status: 401,
      });
    }

    // Get userId from session
    const { userId } = sessionUser;

    // find the message by the id
    const message = await Message.findById(id);

    // check if the message is there
    if (!message) return new Response("message not found", { status: 404 });

    // verify ownership else anyone can mark others messages as read
    if (message.recipient.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    //update the message to either read or unread depending on the current status
    message.read = !message.read;

    // save the message
    await message.save();

    return new Response(JSON.stringify(message), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

//DELETE /api/messages/:id
export const DELETE = async (request, { params }) => {
  try {
    await connectDb();

    // get the id from params, "{id} is determined by the name of the folder"
    const { id } = params;

    // get the id from the user session
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response("User Id is required", {
        status: 401,
      });
    }

    // Get userId from session
    const { userId } = sessionUser;

    // find the message by the id
    const message = await Message.findById(id);

    // check if the message is there
    if (!message) return new Response("message not found", { status: 404 });

    // verify ownership else anyone can mark others messages as read
    if (message.recipient.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await message.deleteOne();

    return new Response("message deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
