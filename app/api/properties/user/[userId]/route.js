import connectDb from "@/config/database";
import Property from "@/models/Property";

// Get /api/properties/user/:userId
export const GET = async (request, { params }) => {
  try {
    await connectDb();
    // userId after params is because of the folders name
    const userId = params.userId;

    if (!userId) {
      return new Response("userId is required", { status: 400 });
    }

    // get properties that belongs to a specific user
    const properties = await Property.find({ owner: userId });

    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
