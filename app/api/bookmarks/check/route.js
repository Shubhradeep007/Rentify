// const connectDb = require("@/config/database");
// const Property = require("@/models/Property");
// const User = require("@/models/User");
// const { getSessionUser } = require("@/utils/getSessionUser");
import { getSessionUser } from "@/utils/getSessionUser";
import connectDb from "@/config/database";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export const POST = async (request) => {
  try {
    await connectDb();

    // get the id of the property to be bookmarked
    const { propertyId } = await request.json();

    // get the user
    const sessionUser = await getSessionUser();

    // check if there is session and user in the session
    if (!sessionUser || !sessionUser.userId) {
      return new Response("user Id is required", { status: 401 });
    }

    // get the user
    const { userId } = sessionUser;

    // find user in db based on their id
    // const user = await User.findById({ _id: userId });
    const user = await User.findOne({ _id: userId });

    // check if the property is already bookmarked
    let isBookmarked = user.bookmarks.includes(propertyId);

    return new Response(JSON.stringify({ isBookmarked }), {
      status: 200,
    });
  } catch (error) {
    console.error("this is the error were looking for", error);
    return new Response("something went wrong", { status: 500 });
  }
};
