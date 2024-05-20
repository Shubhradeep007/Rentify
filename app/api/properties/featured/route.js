import connectDb from "@/config/database";
import Property from "@/models/Property";

//  Get /api/properties/featured
export const GET = async (request) => {
  try {
    await connectDb();

    const properties = await Property.find({ is_featured: true });

    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};
